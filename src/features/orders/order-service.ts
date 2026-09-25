import { randomBytes, randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { brand } from "@/config/brand";
import { normalizeDigits } from "@/lib/formatters";
import { prisma } from "@/lib/prisma";

export type CheckoutInput = {
  idempotencyKey: string;
  items: Array<{ productId: string; quantity: number }>;
  customer: { firstName: string; lastName: string; mobile: string; province: string; city: string; address: string; postalCode: string; notes?: string };
  mockOutcome?: "successful" | "failed" | "cancelled";
};

export class CheckoutError extends Error {
  constructor(message: string, public status = 400, public code = "CHECKOUT_ERROR") { super(message); }
}

function createOrderNumber() {
  return `DVS-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

function createTrackingCode() {
  return `TRK-${randomBytes(16).toString("base64url").toUpperCase()}`;
}

function toSafeNumber(value: bigint) {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new CheckoutError("مبلغ سفارش قابل پردازش نیست.", 500, "AMOUNT_OUT_OF_RANGE");
  return Number(value);
}

function customerData(customer: CheckoutInput["customer"]) {
  return { ...customer, mobile: normalizeDigits(customer.mobile).replace(/\D/g, "") };
}

export async function createOrder(input: CheckoutInput, customerId?: string) {
  const existing = await prisma.order.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing) return { order: existing, replayed: true };

  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && input.mockOutcome) {
    throw new CheckoutError("پرداخت آزمایشی در محیط عملیاتی فعال نیست.", 400, "PAYMENT_NOT_AVAILABLE");
  }
  if (input.mockOutcome && input.mockOutcome !== "successful") {
    throw new CheckoutError(input.mockOutcome === "cancelled" ? "پرداخت آزمایشی لغو شد." : "پرداخت آزمایشی ناموفق بود.", 402, "PAYMENT_FAILED");
  }

  const grouped = new Map<string, number>();
  for (const item of input.items) grouped.set(item.productId, (grouped.get(item.productId) ?? 0) + item.quantity);
  if (!grouped.size) throw new CheckoutError("سبد خرید خالی است.", 400, "EMPTY_CART");
  const customer = customerData(input.customer);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const orderNumber = createOrderNumber();
    const trackingCode = createTrackingCode();
    const reference = isProduction ? null : `MOCK-${randomUUID().replaceAll("-", "").toUpperCase()}`;
    try {
      const order = await prisma.$transaction(async (tx) => {
        const products = await tx.product.findMany({
          where: { id: { in: [...grouped.keys()] }, isPublished: true },
          select: { id: true, name: true, sku: true, priceRials: true, compareAtPriceRials: true, stockQuantity: true },
        });
        if (products.length !== grouped.size) throw new CheckoutError("یک یا چند محصول دیگر قابل سفارش نیستند.", 409, "PRODUCT_UNAVAILABLE");

        const productById = new Map(products.map((product) => [product.id, product]));
        let subtotal = BigInt(0); let discount = BigInt(0); let payableItems = BigInt(0);
        const items = [...grouped.entries()].map(([productId, quantity]) => {
          const product = productById.get(productId);
          if (!product || quantity < 1 || quantity > 99) throw new CheckoutError("تعداد یکی از اقلام معتبر نیست.", 400, "INVALID_QUANTITY");
          const listPrice = product.compareAtPriceRials ?? product.priceRials;
          const lineTotal = product.priceRials * BigInt(quantity);
          subtotal += listPrice * BigInt(quantity);
          discount += (listPrice - product.priceRials) * BigInt(quantity);
          payableItems += lineTotal;
          return { product, quantity, lineTotal };
        });
        const shipping = BigInt(brand.commerce.shippingFeeRials);
        const total = payableItems + shipping;

        for (const item of items) {
          const updated = await tx.product.updateMany({
            where: { id: item.product.id, stockQuantity: { gte: item.quantity } },
            data: { stockQuantity: { decrement: item.quantity } },
          });
          if (updated.count !== 1) throw new CheckoutError(`موجودی «${item.product.name}» کافی نیست.`, 409, "INSUFFICIENT_STOCK");
        }

        return tx.order.create({
          data: {
            orderNumber,
            trackingCode,
            idempotencyKey: input.idempotencyKey,
            customerId: customerId ?? null,
            firstName: customer.firstName,
            lastName: customer.lastName,
            mobile: customer.mobile,
            province: customer.province,
            city: customer.city,
            address: customer.address,
            postalCode: customer.postalCode,
            notes: customer.notes || null,
            subtotalRials: subtotal,
            discountRials: discount,
            shippingRials: shipping,
            totalRials: total,
            status: isProduction ? "pending" : "paid",
            items: { create: items.map(({ product, quantity, lineTotal }) => ({ productId: product.id, productName: product.name, productSku: product.sku, unitPriceRials: product.priceRials, quantity, lineTotalRials: lineTotal })) },
            payments: { create: { amountRials: total, provider: isProduction ? "manual" : "mock", status: isProduction ? "pending" : "successful", transactionReference: reference } },
          },
        });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return { order, replayed: false };
    } catch (error) {
      if (error instanceof CheckoutError) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const replay = await prisma.order.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
        if (replay) return { order: replay, replayed: true };
        continue;
      }
      throw error;
    }
  }
  throw new CheckoutError("ثبت سفارش با خطا مواجه شد. لطفاً دوباره تلاش کنید.", 500, "ORDER_CREATE_FAILED");
}

const publicOrderInclude = {
  items: true,
  payments: { orderBy: { createdAt: "desc" }, take: 1 },
} satisfies Prisma.OrderInclude;

export const adminOrderInclude = {
  items: true,
  payments: { orderBy: { createdAt: "desc" }, take: 1 },
} satisfies Prisma.OrderInclude;

export type PublicOrder = Prisma.OrderGetPayload<{ include: typeof publicOrderInclude }>;
export type AdminOrderRecord = Prisma.OrderGetPayload<{ include: typeof adminOrderInclude }>;

export async function findOrderForTracking(codeOrNumber: string, mobile: string, customerId?: string) {
  const identifier = codeOrNumber.trim().toUpperCase();
  const normalizedMobile = normalizeDigits(mobile).replace(/\D/g, "");
  const order = await prisma.order.findFirst({
    where: { OR: [{ trackingCode: identifier }, { orderNumber: identifier }], mobile: normalizedMobile },
    include: publicOrderInclude,
  });
  if (!order) return null;
  if (customerId && order.customerId && order.customerId !== customerId) return null;
  return order;
}

export async function findCustomerOrder(customerId: string, orderNumber: string) {
  return prisma.order.findFirst({ where: { customerId, orderNumber }, include: publicOrderInclude });
}

export async function listCustomerOrders(customerId: string) {
  return prisma.order.findMany({ where: { customerId }, include: publicOrderInclude, orderBy: { createdAt: "desc" } });
}

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: adminOrderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: adminOrderInclude,
  });
}

export function orderAmounts(order: { subtotalRials: bigint; discountRials: bigint; shippingRials: bigint; totalRials: bigint }) {
  return { subtotal: toSafeNumber(order.subtotalRials), discount: toSafeNumber(order.discountRials), shipping: toSafeNumber(order.shippingRials), total: toSafeNumber(order.totalRials) };
}

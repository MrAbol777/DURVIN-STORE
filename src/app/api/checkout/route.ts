import { z } from "zod";
import { getCustomerSession } from "@/lib/customer-api";
import { normalizeDigits } from "@/lib/formatters";
import { createOrder, CheckoutError } from "@/features/orders/order-service";
import { createOrderReceipt, ORDER_RECEIPT_COOKIE } from "@/lib/order-receipt";

const checkoutSchema = z.object({
  idempotencyKey: z.string().uuid(),
  items: z.array(z.object({ productId: z.string().cuid(), quantity: z.number().int().min(1).max(99) })).min(1).max(50),
  customer: z.object({
    firstName: z.string().trim().min(2).max(100), lastName: z.string().trim().min(2).max(100),
    mobile: z.string().transform((value) => normalizeDigits(value).replace(/\D/g, "")).pipe(z.string().regex(/^09\d{9}$/)),
    province: z.string().trim().min(2).max(100), city: z.string().trim().min(2).max(100),
    address: z.string().trim().min(10).max(5000), postalCode: z.string().transform((value) => normalizeDigits(value).replace(/\D/g, "")).pipe(z.string().regex(/^\d{10}$/)),
    notes: z.string().trim().max(500).optional(),
  }),
  mockOutcome: z.enum(["successful", "failed", "cancelled"]).optional(),
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "اطلاعات سفارش معتبر نیست." }, { status: 400 });
  try {
    const session = await getCustomerSession();
    const { order, replayed } = await createOrder(parsed.data, session?.customerId);
    const response = Response.json({ ok: true, data: { orderNumber: order.orderNumber, trackingCode: order.trackingCode, replayed } }, { status: replayed ? 200 : 201 });
    response.headers.append("Set-Cookie", `${ORDER_RECEIPT_COOKIE}=${createOrderReceipt(order.orderNumber)}; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    return response;
  } catch (error) {
    if (error instanceof CheckoutError) return Response.json({ ok: false, error: error.message, code: error.code }, { status: error.status });
    return Response.json({ ok: false, error: "ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}

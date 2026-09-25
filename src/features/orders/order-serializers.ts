import type { PublicOrder } from "@/features/orders/order-service";
import { maskMobile, maskName } from "@/features/orders/order-presentation";
import { orderAmounts } from "@/features/orders/order-service";

export function toTrackingOrder(order: PublicOrder) {
  const payment = order.payments[0] ?? null;
  return {
    orderNumber: order.orderNumber,
    trackingCode: order.trackingCode,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    recipientName: maskName(order.firstName, order.lastName),
    mobile: maskMobile(order.mobile),
    paymentStatus: payment?.status ?? "pending",
    paymentProvider: payment?.provider ?? "—",
    orderStatus: order.status,
    notes: order.notes,
    amounts: orderAmounts(order),
    items: order.items.map((item) => ({ productName: item.productName, sku: item.productSku, quantity: item.quantity, unitPrice: Number(item.unitPriceRials), lineTotal: Number(item.lineTotalRials) })),
  };
}

export function toOrderDetail(order: PublicOrder) {
  const payment = order.payments[0] ?? null;
  return {
    orderNumber: order.orderNumber,
    trackingCode: order.trackingCode,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    recipientName: `${order.firstName} ${order.lastName}`,
    paymentStatus: payment?.status ?? "pending",
    paymentProvider: payment?.provider ?? "—",
    orderStatus: order.status,
    notes: order.notes,
    amounts: orderAmounts(order),
    items: order.items.map((item) => ({ productName: item.productName, sku: item.productSku, quantity: item.quantity, unitPrice: Number(item.unitPriceRials), lineTotal: Number(item.lineTotalRials) })),
  };
}

import type { AdminOrder } from "@/features/admin/admin-types";
import { orderAmounts, type AdminOrderRecord } from "@/features/orders/order-service";

export function toAdminOrder(order: AdminOrderRecord): AdminOrder {
  const payment = order.payments[0] ?? null;
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    trackingCode: order.trackingCode,
    customer: {
      firstName: order.firstName,
      lastName: order.lastName,
      mobile: order.mobile,
      province: order.province,
      city: order.city,
      address: order.address,
      postalCode: order.postalCode,
      notes: order.notes ?? undefined,
    },
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.productName,
      sku: item.productSku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPriceRials),
      lineTotal: Number(item.lineTotalRials),
    })),
    ...orderAmounts(order),
    paymentStatus: payment?.status ?? "pending",
    paymentProvider: payment?.provider ?? "—",
    orderStatus: order.status,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

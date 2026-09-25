import type { OrderStatus } from "@/features/admin/admin-types";
import type { StorePaymentStatus } from "@/features/orders/order-presentation";

export const orderStatusLabels: Record<OrderStatus, string> = { pending: "در انتظار پرداخت", paid: "پرداخت تأیید شد", processing: "در حال پردازش", shipped: "ارسال شده", completed: "تکمیل شده", cancelled: "لغو شده" };
export const paymentStatusLabels: Record<StorePaymentStatus, string> = { pending: "در انتظار", successful: "موفق", failed: "ناموفق", cancelled: "لغوشده" };
export const orderStatusOptions = Object.entries(orderStatusLabels) as [OrderStatus, string][];

export function StatusPill({ status, payment = false }: { status: OrderStatus | StorePaymentStatus; payment?: boolean }) {
  const label = payment ? paymentStatusLabels[status as StorePaymentStatus] : orderStatusLabels[status as OrderStatus];
  const color = status === "completed" || status === "successful" ? "bg-[#eaf6ef] text-success" : status === "cancelled" || status === "failed" ? "bg-[#fdf0f1] text-danger" : "bg-[#f5e9e8] text-primary";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>{label}</span>;
}

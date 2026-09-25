export type StoreOrderStatus = "pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled";
export type StorePaymentStatus = "pending" | "successful" | "failed" | "cancelled";

export const orderStatusMeta: Record<StoreOrderStatus, { label: string; className: string }> = {
  pending: { label: "در انتظار پرداخت", className: "bg-[#f5e9e8] text-primary" },
  paid: { label: "پرداخت تأیید شد", className: "bg-[#eaf6ef] text-success" },
  processing: { label: "در حال آماده‌سازی", className: "bg-[#f5e9e8] text-primary" },
  shipped: { label: "ارسال شد", className: "bg-[#eaf6ef] text-success" },
  completed: { label: "تکمیل شد", className: "bg-[#eaf6ef] text-success" },
  cancelled: { label: "لغو شد", className: "bg-[#fdf0f1] text-danger" },
};

export const paymentStatusMeta: Record<StorePaymentStatus, { label: string; className: string }> = {
  pending: { label: "در انتظار", className: "bg-[#f5e9e8] text-primary" },
  successful: { label: "موفق", className: "bg-[#eaf6ef] text-success" },
  failed: { label: "ناموفق", className: "bg-[#fdf0f1] text-danger" },
  cancelled: { label: "لغوشده", className: "bg-[#fdf0f1] text-danger" },
};

export const orderStatusOptions = Object.entries(orderStatusMeta).map(([value, meta]) => [value, meta.label] as [StoreOrderStatus, string]);

export function maskMobile(mobile: string) {
  return mobile.length > 5 ? `${mobile.slice(0, 4)}••••${mobile.slice(-3)}` : "••••";
}

export function maskName(firstName: string, lastName: string) {
  return `${firstName.slice(0, 1)}*** ${lastName.slice(0, 1)}***`;
}

import { CheckCircle2, Circle, PackageCheck, Truck, XCircle } from "lucide-react";
import type { StoreOrderStatus } from "@/features/orders/order-presentation";

const steps = [
  { status: "pending", label: "ثبت سفارش", icon: Circle },
  { status: "paid", label: "پرداخت تأیید شد", icon: CheckCircle2 },
  { status: "processing", label: "در حال آماده‌سازی", icon: PackageCheck },
  { status: "shipped", label: "ارسال شد", icon: Truck },
  { status: "completed", label: "تکمیل شد", icon: CheckCircle2 },
] as const;

const positions: Record<StoreOrderStatus, number> = { pending: 0, paid: 1, processing: 2, shipped: 3, completed: 4, cancelled: -1 };

export function OrderTimeline({ status }: { status: StoreOrderStatus }) {
  if (status === "cancelled") {
    return <div className="flex items-center gap-3 rounded-xl bg-[#fdf0f1] p-4 text-sm text-danger"><XCircle className="size-5 shrink-0" aria-hidden="true" /><span>این سفارش لغو شده است.</span></div>;
  }
  const current = positions[status];
  return <ol className="grid gap-3 sm:grid-cols-5 sm:gap-0" aria-label="مراحل سفارش">{steps.map((step, index) => {
    const active = index <= current; const Icon = step.icon;
    return <li key={step.status} className="relative flex items-center gap-2 sm:flex-col sm:items-start sm:gap-2">
      {index > 0 ? <span className={`hidden sm:block absolute right-0 top-4 h-0.5 w-full -translate-x-1/2 ${active ? "bg-success" : "bg-border"}`} aria-hidden="true" /> : null}
      <span className={`relative z-10 flex size-8 items-center justify-center rounded-full ${active ? "bg-success text-white" : "bg-[#faf6f3] text-muted"}`}><Icon className="size-4" aria-hidden="true" /></span>
      <span className={active ? "text-xs font-medium text-foreground" : "text-xs text-muted"}>{step.label}</span>
    </li>;
  })}</ol>;
}

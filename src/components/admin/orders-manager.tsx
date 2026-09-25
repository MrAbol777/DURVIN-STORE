"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminLoading } from "@/components/admin/dashboard-overview";
import { StatusPill } from "@/components/admin/order-status";
import { useAdminStore } from "@/features/admin/admin-store-provider";
import { formatToman } from "@/lib/formatters";

export function OrdersManager() {
  const { orders, isHydrated } = useAdminStore();
  if (!isHydrated) return <AdminLoading />;
  return <div className="p-4 sm:p-6 lg:p-8"><p className="text-xs font-medium tracking-[0.15em] text-primary">فروش</p><h1 className="mt-3 text-3xl font-semibold text-foreground">سفارش‌ها</h1><div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface"><table className="min-w-[54rem] w-full text-right text-sm"><thead className="bg-[#faf6f3] text-xs text-muted"><tr><th className="p-4 font-medium">شماره سفارش</th><th className="p-4 font-medium">مشتری</th><th className="p-4 font-medium">مبلغ</th><th className="p-4 font-medium">تاریخ</th><th className="p-4 font-medium">پرداخت</th><th className="p-4 font-medium">وضعیت سفارش</th><th className="p-4 font-medium"></th></tr></thead><tbody className="divide-y divide-border">{orders.map((order) => <tr key={order.id}><td className="p-4 font-medium text-foreground" dir="ltr">{order.orderNumber}</td><td className="p-4"><p className="font-medium text-foreground">{order.customer.firstName} {order.customer.lastName}</p><p className="mt-1 text-xs text-muted" dir="ltr">{order.customer.mobile}</p></td><td className="p-4 font-medium text-foreground">{formatToman(order.total)}</td><td className="p-4 text-muted">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(order.createdAt))}</td><td className="p-4"><StatusPill status={order.paymentStatus} payment /></td><td className="p-4"><StatusPill status={order.orderStatus} /></td><td className="p-4"><Link href={`/admin/orders/${order.id}`} className="inline-flex size-9 items-center justify-center rounded-lg text-primary transition hover:bg-[#faf6f3]" aria-label={`مشاهده سفارش ${order.orderNumber}`}><ArrowLeft className="size-4" /></Link></td></tr>)}</tbody></table>{orders.length === 0 ? <p className="p-10 text-center text-sm text-muted">هنوز سفارشی ثبت نشده است.</p> : null}</div></div>;
}

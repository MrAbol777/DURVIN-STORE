import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { formatToman } from "@/lib/formatters";
import { prisma } from "@/lib/prisma";

const orderStatusLabels = { pending: "در انتظار بررسی", paid: "پرداخت‌شده", processing: "در حال آماده‌سازی", shipped: "ارسال‌شده", completed: "تکمیل‌شده", cancelled: "لغوشده" } as const;
const paymentStatusLabels = { pending: "در انتظار پرداخت", successful: "پرداخت موفق", failed: "پرداخت ناموفق", cancelled: "پرداخت لغوشده" } as const;

export default async function CustomerOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  const { orderNumber } = await params;
  const order = await prisma.order.findFirst({ where: { orderNumber, customerId: customer.id }, include: { items: true, payments: { orderBy: { createdAt: "desc" }, take: 1 } } });
  if (!order) notFound();
  const payment = order.payments[0];
  return <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14"><Link href="/account/orders" className="inline-flex items-center gap-1 text-sm text-primary"><ArrowRight className="size-4" aria-hidden="true" />بازگشت به سفارش‌ها</Link><div className="mt-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-muted">شماره سفارش</p><h1 className="mt-2 text-balance text-2xl font-semibold text-foreground" dir="ltr">{order.orderNumber}</h1><p className="mt-2 text-sm text-muted">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)}</p></div><div className="flex gap-2 text-xs"><span className="rounded-full bg-surface px-3 py-1.5 text-muted">{orderStatusLabels[order.status]}</span><span className="rounded-full bg-surface px-3 py-1.5 text-muted">{payment ? paymentStatusLabels[payment.status] : "بدون پرداخت"}</span></div></div><section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"><h2 className="border-b border-border p-5 text-lg font-semibold text-foreground">اقلام سفارش</h2><ul className="divide-y divide-border">{order.items.map((item) => <li key={item.id} className="flex items-start justify-between gap-4 p-5"><div><p className="font-medium text-foreground">{item.productName}</p><p className="mt-2 text-sm text-muted">{new Intl.NumberFormat("fa-IR").format(item.quantity)} عدد × {formatToman(Number(item.unitPriceRials))}</p></div><p className="shrink-0 font-semibold text-foreground">{formatToman(Number(item.unitPriceRials) * item.quantity)}</p></li>)}</ul><dl className="grid gap-3 border-t border-border p-5 text-sm"><div className="flex justify-between"><dt className="text-muted">جمع جزء</dt><dd>{formatToman(Number(order.subtotalRials))}</dd></div><div className="flex justify-between"><dt className="text-muted">تخفیف</dt><dd className="text-success">− {formatToman(Number(order.discountRials))}</dd></div><div className="flex justify-between"><dt className="text-muted">هزینه ارسال</dt><dd>{formatToman(Number(order.shippingRials))}</dd></div><div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>مبلغ نهایی</dt><dd>{formatToman(Number(order.totalRials))}</dd></div></dl></section></div>;
}

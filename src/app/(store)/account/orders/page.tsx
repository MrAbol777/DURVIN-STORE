import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { formatToman } from "@/lib/formatters";

const orderStatusLabels = { pending: "در انتظار بررسی", paid: "پرداخت‌شده", processing: "در حال آماده‌سازی", shipped: "ارسال‌شده", completed: "تکمیل‌شده", cancelled: "لغوشده" } as const;
const paymentStatusLabels = { pending: "در انتظار پرداخت", successful: "پرداخت موفق", failed: "پرداخت ناموفق", cancelled: "پرداخت لغوشده" } as const;

export const metadata = { title: "سفارش‌های من" };

export default async function CustomerOrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  const orders = await prisma.order.findMany({ where: { customerId: customer.id }, include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { createdAt: "desc" } });
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"><p className="text-sm font-medium text-primary">حساب کاربری</p><h1 className="mt-2 text-balance text-3xl font-semibold text-foreground">سفارش‌های من</h1>{orders.length ? <div className="mt-8 grid gap-4">{orders.map((order) => { const payment = order.payments[0]; return <Link key={order.id} href={`/account/orders/${order.orderNumber}`} className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-semibold text-foreground" dir="ltr">{order.orderNumber}</p><p className="mt-2 text-sm text-muted">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(order.createdAt)}</p></div><p className="font-semibold text-foreground">{formatToman(Number(order.totalRials))}</p></div><div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-background px-3 py-1.5 text-muted">{orderStatusLabels[order.status]}</span><span className="rounded-full bg-background px-3 py-1.5 text-muted">{payment ? paymentStatusLabels[payment.status] : "بدون پرداخت"}</span></div></Link>; })}</div> : <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center shadow-sm"><ClipboardList className="mx-auto size-7 text-primary" aria-hidden="true" /><h2 className="mt-4 text-lg font-semibold text-foreground">هنوز سفارشی ندارید</h2><p className="mt-2 text-pretty text-sm leading-7 text-muted">پس از ثبت سفارش در زمان ورود به حساب، آن را اینجا می‌بینید.</p><Link href="/products" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-strong">مشاهده محصولات</Link></div>}</div>;
}

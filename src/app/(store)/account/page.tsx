import Link from "next/link";
import { ClipboardList, UserRound } from "lucide-react";
import { CustomerLogoutButton } from "@/components/customer/customer-logout-button";
import { getCurrentCustomer } from "@/lib/customer-auth";

export const metadata = { title: "حساب کاربری" };

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  return <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"><p className="text-sm font-medium text-primary">حساب کاربری</p><h1 className="mt-2 text-balance text-3xl font-semibold text-foreground">سلام، {customer.firstName} {customer.lastName}</h1><p className="mt-3 text-pretty text-sm text-muted" dir="ltr">{customer.mobile}</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/account/profile" className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary"><UserRound className="size-5 text-primary" aria-hidden="true" /><h2 className="mt-4 text-lg font-semibold text-foreground">پروفایل من</h2><p className="mt-2 text-pretty text-sm leading-7 text-muted">نام و نام خانوادگی خود را مشاهده یا ویرایش کنید.</p></Link><Link href="/account/orders" className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary"><ClipboardList className="size-5 text-primary" aria-hidden="true" /><h2 className="mt-4 text-lg font-semibold text-foreground">سفارش‌های من</h2><p className="mt-2 text-pretty text-sm leading-7 text-muted">وضعیت و جزئیات سفارش‌های ثبت‌شده را ببینید.</p></Link></div><div className="mt-8"><CustomerLogoutButton /></div></div>;
}

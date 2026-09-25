import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CustomerProfileForm } from "@/components/customer/customer-profile-form";
import { getCurrentCustomer } from "@/lib/customer-auth";

export const metadata = { title: "پروفایل" };

export default async function ProfilePage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  return <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14"><Link href="/account" className="inline-flex items-center gap-1 text-sm text-primary"><ArrowRight className="size-4" aria-hidden="true" />بازگشت به حساب کاربری</Link><h1 className="mt-6 text-balance text-3xl font-semibold text-foreground">پروفایل من</h1><p className="mt-3 text-pretty text-sm leading-7 text-muted">نام و نام خانوادگی خود را به‌روزرسانی کنید.</p><div className="mt-8"><CustomerProfileForm firstName={customer.firstName} lastName={customer.lastName} mobile={customer.mobile} /></div></div>;
}

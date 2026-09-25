import { redirect } from "next/navigation";
import { CustomerAuthForm } from "@/components/customer/customer-auth-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getSafeNext } from "@/lib/safe-next";

export const metadata = { title: "ثبت‌نام" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentCustomer()) redirect("/account");
  const { next } = await searchParams;
  return <><Header /><main className="min-h-dvh bg-background px-4 py-10 sm:px-6 sm:py-14"><div className="mx-auto max-w-md"><CustomerAuthForm mode="register" nextPath={getSafeNext(next)} /></div></main><Footer /></>;
}

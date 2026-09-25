import { redirect } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCurrentCustomer } from "@/lib/customer-auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (!(await getCurrentCustomer())) redirect("/login?next=/account");
  return <><Header /><main className="min-h-dvh bg-background">{children}</main><Footer /></>;
}

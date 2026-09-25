import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStoreProvider } from "@/features/admin/admin-store-provider";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({ children }: LayoutProps<"/admin">) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin/login");
  return <AdminStoreProvider><AdminShell>{children}</AdminShell></AdminStoreProvider>;
}

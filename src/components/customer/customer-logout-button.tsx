"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function CustomerLogoutButton() {
  const router = useRouter();
  const logout = async () => { await fetch("/api/customer/logout", { method: "POST" }); router.replace("/"); router.refresh(); };
  return <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-danger/30 px-4 text-sm font-medium text-danger transition hover:bg-[#fdf0f1]"><LogOut className="size-4" aria-hidden="true" />خروج از حساب</button>;
}

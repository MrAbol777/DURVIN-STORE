"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, FolderTree, LayoutDashboard, LogOut, Menu, Package, ReceiptText, X } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";

const navigation = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ReceiptText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = async () => { await fetch("/api/admin/auth/logout", { method: "POST" }); router.replace("/admin/login"); };
  const nav = (mobile = false) => <nav className="grid gap-1">{navigation.map((item) => { const Icon = item.icon; const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href); return <Link onClick={() => mobile && setMobileOpen(false)} key={item.href} href={item.href} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition ${active ? "bg-[#f5e9e8] font-medium text-primary" : "text-muted hover:bg-[#faf6f3] hover:text-foreground"}`}><Icon className="size-4" aria-hidden="true" />{item.label}</Link>; })}</nav>;
  return (
    <div className="min-h-screen bg-[#faf6f3]">
      <header className="sticky top-0 z-40 flex h-[4.5rem] items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:hidden"><button type="button" onClick={() => setMobileOpen(true)} className="flex size-11 items-center justify-center rounded-full border border-border" aria-label="باز کردن منوی پنل"><Menu className="size-5" aria-hidden="true" /></button><SiteLogo /><span className="flex size-11 items-center justify-center text-primary"><Boxes className="size-5" aria-hidden="true" /></span></header>
      {mobileOpen ? <div className="fixed inset-0 z-50 lg:hidden"><button type="button" onClick={() => setMobileOpen(false)} aria-label="بستن منو" className="absolute inset-0 bg-foreground/20" /><aside className="relative h-full w-72 bg-surface p-5 shadow-xl"><div className="mb-8 flex items-center justify-between"><SiteLogo /><button type="button" onClick={() => setMobileOpen(false)} className="flex size-10 items-center justify-center rounded-full border border-border"><X className="size-4" /></button></div>{nav(true)}<button type="button" onClick={logout} className="mt-8 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-danger transition hover:bg-[#fdf0f1]"><LogOut className="size-4" />خروج</button></aside></div> : null}
      <aside className="fixed inset-y-0 right-0 hidden w-64 border-l border-border bg-surface p-5 lg:flex lg:flex-col"><SiteLogo /><p className="mt-2 text-xs text-muted">پنل مدیریت</p><div className="mt-9">{nav()}</div><button type="button" onClick={logout} className="mt-auto flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-danger transition hover:bg-[#fdf0f1]"><LogOut className="size-4" />خروج</button></aside>
      <div className="lg:pr-64"><main className="min-h-screen">{children}</main></div>
    </div>
  );
}

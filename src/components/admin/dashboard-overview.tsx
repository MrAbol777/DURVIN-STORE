"use client";

import Link from "next/link";
import { Package, ReceiptText, Wallet } from "lucide-react";
import { useAdminStore } from "@/features/admin/admin-store-provider";
import { formatToman } from "@/lib/formatters";

export function DashboardOverview() {
  const { products, orders, isHydrated } = useAdminStore();
  if (!isHydrated) return <AdminLoading />;
  const totalOrders = orders.reduce((sum, order) => sum + order.total, 0);
  const stats = [{ label: "محصولات", value: products.length, icon: Package, href: "/admin/products" }, { label: "سفارش‌ها", value: orders.length, icon: ReceiptText, href: "/admin/orders" }, { label: "مجموع سفارش‌ها", value: formatToman(totalOrders), icon: Wallet, href: "/admin/orders" }];
  return <div className="p-4 sm:p-6 lg:p-8"><p className="text-xs font-medium tracking-[0.15em] text-primary">پنل مدیریت</p><h1 className="mt-3 text-3xl font-semibold text-foreground">داشبورد</h1><div className="mt-8 grid gap-4 sm:grid-cols-3">{stats.map((stat) => { const Icon = stat.icon; return <Link key={stat.label} href={stat.href} className="rounded-2xl border border-border bg-surface p-5 transition hover:border-primary"><span className="flex size-10 items-center justify-center rounded-full bg-[#f8eceb] text-primary"><Icon className="size-5" /></span><p className="mt-5 text-sm text-muted">{stat.label}</p><p className="mt-2 text-xl font-semibold text-foreground">{typeof stat.value === "number" ? new Intl.NumberFormat("fa-IR").format(stat.value) : stat.value}</p></Link>; })}</div><section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface"><div className="flex items-center justify-between p-5"><h2 className="font-semibold text-foreground">سفارش‌های اخیر</h2><Link href="/admin/orders" className="text-sm text-primary">مشاهده همه</Link></div><ul className="divide-y divide-border">{orders.slice(0, 5).map((order) => <li key={order.id}><Link href={`/admin/orders/${order.id}`} className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-[#faf6f3]"><div><p className="text-sm font-medium text-foreground" dir="ltr">{order.orderNumber}</p><p className="mt-1 text-xs text-muted">{order.customer.firstName} {order.customer.lastName}</p></div><p className="text-sm font-semibold text-foreground">{formatToman(order.total)}</p></Link></li>)}</ul></section></div>;
}

export function AdminLoading() { return <div className="p-8 text-sm text-muted">در حال آماده‌سازی اطلاعات پنل…</div>; }

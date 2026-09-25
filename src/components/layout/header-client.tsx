"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Menu, ReceiptText, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { useCart } from "@/features/cart/cart-provider";

const navigation = [
  { label: "خانه", href: "/" },
  { label: "محصولات", href: "/products" },
  { label: "پیگیری سفارش", href: "/track-order" },
  { label: "دسته‌بندی‌ها", href: "/#categories" },
  { label: "درباره ما", href: "/about" },
];

function SearchForm({ className = "" }: { className?: string }) {
  return (
    <form action="/search" className={`relative ${className}`} role="search">
      <label htmlFor="product-search" className="sr-only">جست‌وجوی محصولات</label>
      <Search aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input id="product-search" name="q" type="search" placeholder="جست‌وجوی محصولات" className="h-10 w-full rounded-full border border-border bg-background px-10 text-sm outline-none transition placeholder:text-muted focus:border-primary" />
    </form>
  );
}

function CustomerMenu({ fullName }: { fullName: string }) {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/customer/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <Link href="/account" aria-label="حساب کاربری" className="flex size-11 items-center justify-center rounded-full text-foreground transition hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <UserRound className="size-5" aria-hidden="true" />
      </Link>
      <details className="group relative">
      <summary aria-label="گزینه‌های حساب کاربری" className="flex min-h-11 cursor-pointer list-none items-center gap-1 rounded-xl px-2 text-sm font-medium text-foreground transition hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        <span className="hidden max-w-24 truncate sm:inline">{fullName}</span><ChevronDown className="size-4" aria-hidden="true" />
      </summary>
      <div className="absolute left-0 top-12 z-50 w-56 rounded-2xl border border-border bg-surface p-2 shadow-lg">
        <p className="px-3 pb-2 pt-1 text-sm font-medium text-foreground">{fullName}</p>
        <Link href="/account" className="flex min-h-10 items-center rounded-xl px-3 text-sm text-foreground transition hover:bg-background hover:text-primary">حساب کاربری</Link>
        <Link href="/account/orders" className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm text-foreground transition hover:bg-background hover:text-primary"><ReceiptText className="size-4" aria-hidden="true" />سفارش‌های من</Link>
        <button type="button" onClick={logout} className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-right text-sm text-danger transition hover:bg-background"><LogOut className="size-4" aria-hidden="true" />خروج</button>
      </div>
      </details>
    </div>
  );
}

export function HeaderClient({ customer }: { customer: { fullName: string } | null }) {
  const { cartCount } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden"><details className="group relative"><summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:border-primary [&::-webkit-details-marker]:hidden" aria-label="باز کردن منوی اصلی"><Menu className="size-5 group-open:hidden" aria-hidden="true" /><X className="hidden size-5 group-open:block" aria-hidden="true" /></summary><div className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-4 shadow-lg"><SearchForm className="mb-4" /><nav aria-label="ناوبری موبایل" className="grid gap-1">{navigation.map((item) => <Link key={item.href} href={item.href} className="rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-background hover:text-primary">{item.label}</Link>)}</nav></div></details></div>
        <SiteLogo />
        <nav className="mr-7 hidden items-center gap-6 lg:flex" aria-label="ناوبری اصلی">{navigation.map((item) => <Link key={item.href} href={item.href} className="text-sm text-foreground transition hover:text-primary">{item.label}</Link>)}</nav>
        <SearchForm className="mr-auto hidden w-full max-w-xs lg:block" />
        <div className="mr-auto flex items-center gap-1 lg:mr-0">
          {customer ? <CustomerMenu fullName={customer.fullName} /> : <Link href="/login?next=/account" aria-label="ورود به حساب کاربری" className="flex size-11 items-center justify-center rounded-full text-foreground transition hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><UserRound className="size-5" aria-hidden="true" /></Link>}
          <Link href="/cart" aria-label={`سبد خرید، ${new Intl.NumberFormat("fa-IR").format(cartCount)} کالا`} className="relative flex size-11 items-center justify-center rounded-full text-foreground transition hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ShoppingBag className="size-5" aria-hidden="true" /><span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] leading-none text-white">{new Intl.NumberFormat("fa-IR").format(cartCount)}</span></Link>
        </div>
      </div>
    </header>
  );
}

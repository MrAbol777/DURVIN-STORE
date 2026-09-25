"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { OrderSummary } from "@/components/cart/order-summary";
import { QuantityControl } from "@/components/cart/quantity-control";
import { useCart } from "@/features/cart/cart-provider";
import { formatToman } from "@/lib/formatters";

export function CartPageContent() {
  const { items, isHydrated, removeItem, updateQuantity } = useCart();

  if (!isHydrated) return <div className="mx-auto min-h-80 max-w-7xl px-4 py-16 text-sm text-muted sm:px-6 lg:px-8">در حال آماده‌سازی سبد خرید…</div>;

  if (!items.length) {
    return (
      <div className="mx-auto flex min-h-96 max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#f8eceb] text-primary"><ShoppingBag className="size-6" aria-hidden="true" /></span>
        <h1 className="mt-5 text-2xl font-semibold text-foreground">سبد خرید شما خالی است</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted">برای شروع، محصولی را از فروشگاه انتخاب کنید و به سبد خود اضافه کنید.</p>
        <Link href="/products" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:bg-primary-strong">مشاهده محصولات <ArrowLeft className="size-4" aria-hidden="true" /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8"><p className="text-xs font-medium tracking-[0.15em] text-primary">سبد خرید</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">انتخاب‌های شما</h1></div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
        <section className="overflow-hidden rounded-2xl border border-border bg-surface">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.product.id} className="flex gap-3 p-4 sm:gap-5 sm:p-5">
                <Link href={`/products/${item.product.slug}`} className="relative size-22 shrink-0 overflow-hidden rounded-xl bg-[#f6f0ec] sm:size-28"><Image src={item.product.image} alt={item.product.name} fill sizes="112px" className="object-cover" style={{ objectPosition: item.product.imagePosition }} /></Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted">{item.product.category}</p>
                  <Link href={`/products/${item.product.slug}`} className="mt-1 block truncate text-sm font-semibold text-foreground transition hover:text-primary sm:text-base">{item.product.name}</Link>
                  <p className="mt-2 text-sm font-semibold text-foreground">{formatToman(item.product.price)}</p>
                  <p className="mt-1 text-xs text-muted sm:hidden">مبلغ: {formatToman(item.product.price * item.quantity)}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <QuantityControl quantity={item.quantity} max={item.product.stockCount} onChange={(quantity) => updateQuantity(item.product.id, quantity)} />
                    <button type="button" onClick={() => removeItem(item.product.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-danger"><Trash2 className="size-4" aria-hidden="true" />حذف</button>
                  </div>
                </div>
                <p className="hidden text-sm font-semibold text-foreground sm:block">{formatToman(item.product.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
        </section>
        <OrderSummary checkoutLink />
      </div>
    </div>
  );
}

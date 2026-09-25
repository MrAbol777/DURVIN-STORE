"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/features/cart/cart-provider";
import { formatToman } from "@/lib/formatters";

export function OrderSummary({ checkoutLink = false }: { checkoutLink?: boolean }) {
  const { subtotal, discount, shipping, total } = useCart();

  return (
    <aside className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">خلاصه سفارش</h2>
      <dl className="mt-5 grid gap-4 text-sm">
        <div className="flex items-center justify-between gap-4"><dt className="text-muted">جمع جزء</dt><dd className="font-medium text-foreground">{formatToman(subtotal)}</dd></div>
        <div className="flex items-center justify-between gap-4"><dt className="text-muted">تخفیف</dt><dd className="font-medium text-success">− {formatToman(discount)}</dd></div>
        <div className="flex items-center justify-between gap-4"><dt className="text-muted">هزینه ارسال</dt><dd className="font-medium text-foreground">{shipping ? formatToman(shipping) : "رایگان"}</dd></div>
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4"><dt className="font-semibold text-foreground">مبلغ قابل پرداخت</dt><dd className="text-base font-semibold text-foreground">{formatToman(total)}</dd></div>
      </dl>
      {checkoutLink ? <Link href="/checkout" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">ادامه ثبت سفارش <ArrowLeft className="size-4" aria-hidden="true" /></Link> : null}
    </aside>
  );
}

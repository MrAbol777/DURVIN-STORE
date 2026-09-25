"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatToman } from "@/lib/formatters";
import { useCart } from "@/features/cart/cart-provider";
import type { Product } from "@/types/catalog";

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const inStock = product.stockCount > 0;

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center rounded-xl border border-border bg-surface">
          <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity === 1} aria-label="کاهش تعداد" className="flex size-11 items-center justify-center text-muted transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><Minus className="size-4" aria-hidden="true" /></button>
          <output className="w-8 text-center text-sm font-semibold text-foreground" aria-live="polite">{new Intl.NumberFormat("fa-IR").format(quantity)}</output>
          <button type="button" onClick={() => setQuantity((current) => Math.min(product.stockCount, current + 1))} disabled={!inStock || quantity >= product.stockCount} aria-label="افزایش تعداد" className="flex size-11 items-center justify-center text-muted transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><Plus className="size-4" aria-hidden="true" /></button>
        </div>
        <button
          type="button"
          disabled={!inStock}
          onClick={() => { if (addItem(product, quantity)) setAdded(true); }}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted"
        >
          {added ? <Check className="size-4" aria-hidden="true" /> : <ShoppingBag className="size-4" aria-hidden="true" />}
          {added ? "به سبد اضافه شد" : inStock ? `افزودن به سبد · ${formatToman(product.price * quantity)}` : "ناموجود"}
        </button>
      </div>
      {added ? <p className="mt-3 text-sm text-success" role="status">{new Intl.NumberFormat("fa-IR").format(quantity)} عدد از {product.name} به سبد اضافه شد.</p> : null}
    </div>
  );
}

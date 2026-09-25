"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { brand } from "@/config/brand";
import { useCart } from "@/features/cart/cart-provider";
import { getDiscountPercentage, formatToman } from "@/lib/formatters";
import type { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image || brand.assets.heroImage);
  const discount = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-0.5 hover:border-[#d8c6ce]">
      <Link href={`/products/${product.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
        <div className="relative aspect-square overflow-hidden bg-[#f6f0ec]">
          {discount ? (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white">
              {new Intl.NumberFormat("fa-IR").format(discount)}٪ تخفیف
            </span>
          ) : null}
          <img
            src={imageSrc}
            alt={product.name}
            onError={() => setImageSrc(brand.assets.heroImage)}
            className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
            style={{ objectPosition: product.imagePosition }}
          />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-muted">{product.category}</p>
        <Link href={`/products/${product.slug}`} className="mt-2 block text-sm font-semibold text-foreground transition hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">{formatToman(product.price)}</p>
            {product.originalPrice ? (
              <p className="mt-1 text-xs text-muted line-through">{formatToman(product.originalPrice)}</p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => { if (addItem(product)) setAdded(true); }}
            aria-label={product.inStock ? `افزودن ${product.name} به سبد خرید` : `${product.name} ناموجود است`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-[#f4efec] disabled:text-muted"
          >
            {added ? <Check className="size-4" aria-hidden="true" /> : <ShoppingBag className="size-4" aria-hidden="true" />}
          </button>
        </div>
        <p className={`mt-3 text-xs ${product.inStock ? "text-success" : "text-danger"}`}>
          {product.inStock ? "موجود در انبار" : "ناموجود"}
        </p>
      </div>
    </article>
  );
}

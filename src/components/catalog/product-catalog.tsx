"use client";

import { useMemo, useState } from "react";
import { PackageX, Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/home/product-card";
import type { Category, Product } from "@/types/catalog";

type SortOption = "newest" | "price-asc" | "price-desc";

export function ProductCatalog({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const selectedCategoryId = categories.find((category) => category.slug === categoryFromUrl)?.id ?? "all";
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(selectedCategoryId);
  const [sort, setSort] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(6);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
    const filtered = products.filter((product) => {
      const matchesCategory = categoryId === "all" || product.categoryId === categoryId;
      const matchesQuery = !normalizedQuery || [product.name, product.category, product.shortDescription]
        .join(" ")
        .toLocaleLowerCase("fa-IR")
        .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return filtered.sort((first, second) => {
      if (sort === "price-asc") return first.price - second.price;
      if (sort === "price-desc") return second.price - first.price;
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [categoryId, products, query, sort]);

  const visibleProducts = results.slice(0, visibleCount);
  const updateFilters = () => setVisibleCount(6);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-3 rounded-2xl border border-border bg-surface p-3 sm:grid-cols-[minmax(0,1fr)_12rem_12rem] sm:p-4">
        <label className="relative block">
          <span className="sr-only">جست‌وجوی محصولات</span>
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); updateFilters(); }}
            type="search"
            placeholder="نام محصول یا دسته‌بندی را جست‌وجو کنید"
            className="h-11 w-full rounded-xl bg-background px-10 text-sm outline-none transition placeholder:text-muted focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="relative block">
          <span className="sr-only">فیلتر دسته‌بندی</span>
          <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <select
            value={categoryId}
            onChange={(event) => { setCategoryId(event.target.value); updateFilters(); }}
            className="h-11 w-full appearance-none rounded-xl bg-background px-10 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">مرتب‌سازی محصولات</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="h-11 w-full appearance-none rounded-xl bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
          >
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </label>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted"><span className="font-semibold text-foreground">{new Intl.NumberFormat("fa-IR").format(results.length)}</span> محصول پیدا شد</p>
        {categoryId !== "all" || query ? (
          <button type="button" onClick={() => { setQuery(""); setCategoryId("all"); updateFilters(); }} className="text-sm text-primary transition hover:text-primary-strong">حذف فیلترها</button>
        ) : null}
      </div>

      {results.length ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          {visibleCount < results.length ? (
            <div className="mt-10 flex justify-center">
              <button type="button" onClick={() => setVisibleCount((count) => count + 6)} className="min-h-11 rounded-full border border-border px-6 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                نمایش محصولات بیشتر
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#f8eceb] text-primary"><PackageX className="size-6" aria-hidden="true" /></span>
          <h2 className="mt-5 text-lg font-semibold text-foreground">محصولی پیدا نشد</h2>
          <p className="mt-2 max-w-sm text-sm leading-7 text-muted">عبارت جست‌وجو یا فیلتر انتخابی را تغییر دهید و دوباره امتحان کنید.</p>
          <button type="button" onClick={() => { setQuery(""); setCategoryId("all"); updateFilters(); }} className="mt-5 text-sm font-medium text-primary">نمایش همه محصولات</button>
        </div>
      )}
    </div>
  );
}

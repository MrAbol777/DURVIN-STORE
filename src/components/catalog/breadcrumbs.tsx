import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function Breadcrumbs({ category, productName }: { category: string; productName: string }) {
  return (
    <nav aria-label="مسیر صفحه" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted sm:text-sm">
        <li><Link href="/" className="transition hover:text-primary">خانه</Link></li>
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        <li><Link href="/products" className="transition hover:text-primary">محصولات</Link></li>
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        <li><span>{category}</span></li>
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        <li aria-current="page" className="max-w-44 truncate text-foreground">{productName}</li>
      </ol>
    </nav>
  );
}

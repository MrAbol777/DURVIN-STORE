import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/home/product-card";
import { SectionHeading } from "@/components/home/section-heading";
import type { Product } from "@/types/catalog";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section id="featured-products" className="bg-[#faf6f3] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="منتخب Durvin"
          title="محبوب‌های این هفته"
          description="چند انتخاب دوست‌داشتنی از مجموعهٔ نمونهٔ فروشگاه."
          action={
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:text-primary-strong">
              همه محصولات <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

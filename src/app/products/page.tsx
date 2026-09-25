import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProductCatalog } from "@/components/catalog/product-catalog";
import { getPublicCatalog } from "@/features/catalog/catalog-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "محصولات",
  description: "محصولات آرایشی و بهداشتی Durvin Store",
};

export default async function ProductsPage() {
  const { products, categories } = await getPublicCatalog();

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-[#faf6f3] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-medium tracking-[0.15em] text-primary">فروشگاه دوروین</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">محصولات</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">محصولات نمونهٔ آرایشی و بهداشتی را براساس نیاز و سلیقهٔ خود جست‌وجو و مقایسه کنید.</p>
          </div>
        </section>
        <section className="pt-8 sm:pt-10">
          <ProductCatalog products={products} categories={categories} />
        </section>
      </main>
      <Footer />
    </>
  );
}

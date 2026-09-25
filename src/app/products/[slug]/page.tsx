import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/home/product-card";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductPurchase } from "@/components/catalog/product-purchase";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getPublicProductBySlug, getRelatedPublicProducts } from "@/features/catalog/catalog-repository";
import { formatToman, getDiscountPercentage } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  return product ? { title: product.name, description: product.shortDescription } : { title: "محصول یافت نشد" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) notFound();

  const discount = product.originalPrice ? getDiscountPercentage(product.originalPrice, product.price) : null;
  const relatedProducts = await getRelatedPublicProducts(product.categoryId, product.id);

  return (
    <>
      <Header />
      <main>
        <Breadcrumbs category={product.category} productName={product.name} />
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={product.images} productName={product.name} />
            <div className="lg:pt-3">
              <p className="text-sm text-primary">{product.category}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
              <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{product.shortDescription}</p>
              <div className="mt-6 border-y border-border py-5">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                  <p className="text-2xl font-semibold text-foreground">{formatToman(product.price)}</p>
                  {product.originalPrice ? <p className="text-sm text-muted line-through">{formatToman(product.originalPrice)}</p> : null}
                  {discount ? <span className="rounded-full bg-[#f8e5e8] px-2.5 py-1 text-xs font-medium text-danger">{new Intl.NumberFormat("fa-IR").format(discount)}٪ تخفیف</span> : null}
                </div>
                <p className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${product.inStock ? "text-success" : "text-danger"}`}>
                  <Check className="size-4" aria-hidden="true" />
                  {product.inStock ? `موجود در انبار · ${new Intl.NumberFormat("fa-IR").format(product.stockCount)} عدد باقی‌مانده` : "این محصول فعلاً ناموجود است"}
                </p>
                <ProductPurchase product={product} />
              </div>
              <dl className="mt-6 grid grid-cols-1 divide-y divide-border rounded-xl border border-border sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-y-0">
                {product.attributes.map((attribute) => <div key={attribute.label} className="p-4"><dt className="text-xs text-muted">{attribute.label}</dt><dd className="mt-2 text-sm font-medium text-foreground">{attribute.value}</dd></div>)}
              </dl>
              <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
                <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" aria-hidden="true" />ضمانت اصالت کالا</p>
                <p className="flex items-center gap-2"><Truck className="size-4 text-primary" aria-hidden="true" />ارسال سریع و مطمئن</p>
              </div>
            </div>
          </div>
        </section>
        <section className="border-y border-border bg-[#faf6f3] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <article className="mx-auto max-w-3xl">
            <p className="text-xs font-medium tracking-[0.15em] text-primary">درباره محصول</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">توضیحات محصول</h2>
            <p className="mt-5 text-sm leading-8 text-muted sm:text-base">{product.description}</p>
          </article>
        </section>
        {relatedProducts.length ? (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-xs font-medium tracking-[0.15em] text-primary">پیشنهاد دوروین</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">محصولات مرتبط</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}

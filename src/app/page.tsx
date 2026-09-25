import { Benefits } from "@/components/home/benefits";
import { BrandIntro } from "@/components/home/brand-intro";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getPublicCatalog } from "@/features/catalog/catalog-repository";

export const dynamic = "force-dynamic";
export default async function Home() {
  const { products } = await getPublicCatalog();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CategoryGrid />
        <FeaturedProducts products={products} />
        <Benefits />
        <BrandIntro />
      </main>
      <Footer />
    </>
  );
}

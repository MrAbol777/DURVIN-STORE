import { redirect } from "next/navigation";

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  redirect(`/products?category=${encodeURIComponent(slug)}`);
}

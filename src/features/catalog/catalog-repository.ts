import type { Prisma } from "@prisma/client";
import { brand } from "@/config/brand";
import { prisma } from "@/lib/prisma";
import type { Category, Product, ProductAttribute } from "@/types/catalog";

export const catalogProductInclude = {
  category: true,
  images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
} satisfies Prisma.ProductInclude;

type CatalogProductRecord = Prisma.ProductGetPayload<{ include: typeof catalogProductInclude }>;

function safeRialsToNumber(value: bigint) {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Product price exceeds the supported storefront range.");
  }
  return Number(value);
}

function toAttributes(value: Prisma.JsonValue | null): ProductAttribute[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const { label, value: attributeValue } = item as Record<string, unknown>;
    return typeof label === "string" && typeof attributeValue === "string"
      ? [{ label, value: attributeValue }]
      : [];
  });
}

export function toCatalogProduct(product: CatalogProductRecord): Product {
  const fallbackImage = { src: brand.assets.heroImage, position: "center" };
  const images = product.images.length
    ? product.images.map((image) => ({ src: image.url, position: image.position ?? "center" }))
    : [fallbackImage];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category.name,
    categoryId: product.categoryId,
    price: safeRialsToNumber(product.priceRials),
    originalPrice: product.compareAtPriceRials ? safeRialsToNumber(product.compareAtPriceRials) : undefined,
    image: images[0].src,
    imagePosition: images[0].position,
    images,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    attributes: toAttributes(product.attributes),
    inStock: product.stockQuantity > 0,
    stockCount: product.stockQuantity,
    createdAt: product.createdAt.toISOString(),
  };
}

export function toCatalogCategory(category: { id: string; name: string; slug: string; description: string | null; imageUrl: string | null; imagePosition: string | null }): Category {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
    href: `/products?category=${encodeURIComponent(category.slug)}`,
    image: category.imageUrl ?? brand.assets.heroImage,
    imagePosition: category.imagePosition ?? "center",
  };
}

export async function getPublicCatalog() {
  const [productRecords, categoryRecords] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true, category: { is: { isActive: true } } },
      include: catalogProductInclude,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { products: productRecords.map(toCatalogProduct), categories: categoryRecords.map(toCatalogCategory) };
}

export async function getPublicProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isPublished: true, category: { is: { isActive: true } } },
    include: catalogProductInclude,
  });

  return product ? toCatalogProduct(product) : null;
}

export async function getRelatedPublicProducts(categoryId: string, productId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
      isPublished: true,
      category: { is: { isActive: true } },
    },
    include: catalogProductInclude,
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return products.map(toCatalogProduct);
}

import { catalogProductInclude, toCatalogCategory, toCatalogProduct } from "@/features/catalog/catalog-repository";
import { prisma } from "@/lib/prisma";
import type { AdminCategory, AdminProduct } from "./admin-types";

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const products = await prisma.product.findMany({ include: catalogProductInclude, orderBy: { createdAt: "desc" } });
  return products.map((product) => ({ ...toCatalogProduct(product), isPublished: product.isPublished }));
}

export async function getAdminCategories(): Promise<(AdminCategory & { productCount: number })[]> {
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });
  return categories.map((category) => ({ ...toCatalogCategory(category), slug: category.slug, image: category.imageUrl ?? "/images/hero-beauty.png", isActive: category.isActive, productCount: category._count.products }));
}

export async function getAdminProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: catalogProductInclude });
  return product ? { ...toCatalogProduct(product), isPublished: product.isPublished } : null;
}

export async function getAdminDashboard() {
  const [activeProducts, categoryCount, orderCount, totals] = await Promise.all([
    prisma.product.count({ where: { isPublished: true } }),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalRials: true } }),
  ]);
  return { activeProducts, categoryCount, orderCount, totalRials: totals._sum.totalRials ?? BigInt(0) };
}

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { productSchema } from "@/features/admin/admin-schemas";
import { hasAdminSession, apiError } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { getAdminProducts } from "@/features/admin/admin-catalog-repository";
import { toJsonSafe } from "@/lib/json";

export async function GET() { if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED"); return Response.json({ ok: true, data: toJsonSafe(await getAdminProducts()) }); }

export async function POST(request: Request) {
  if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED");
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "اطلاعات محصول معتبر نیست.", 400, "VALIDATION_ERROR");
  const data = parsed.data;
  try {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) return apiError("دسته‌بندی معتبر نیست.", 400, "INVALID_CATEGORY");
    const product = await prisma.product.create({ data: { sku: `DVS-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`, name: data.name, slug: data.slug, shortDescription: data.shortDescription, description: data.description, priceRials: BigInt(data.salePrice ?? data.regularPrice) * BigInt(10), compareAtPriceRials: data.salePrice ? BigInt(data.regularPrice) * BigInt(10) : null, stockQuantity: data.stockCount, categoryId: data.categoryId, isPublished: data.isPublished, images: { create: { url: data.image, sortOrder: 0, position: "center", alt: data.name } } } });
    return Response.json({ ok: true, data: { id: product.id } }, { status: 201 });
  } catch (error) { return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" ? apiError("این slug قبلاً استفاده شده است.", 409, "DUPLICATE_SLUG") : apiError("ذخیره محصول انجام نشد.", 500, "DATABASE_ERROR"); }
}

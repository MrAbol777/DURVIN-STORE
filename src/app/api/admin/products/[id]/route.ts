import { Prisma } from "@prisma/client";
import { productSchema, productStatusSchema } from "@/features/admin/admin-schemas";
import { hasAdminSession, apiError } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/products/[id]">) {
  if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED");
  const { id } = await params; const body = await request.json().catch(() => null);
  const status = productStatusSchema.safeParse(body);
  try {
    if (status.success && Object.keys(body ?? {}).length === 1) { await prisma.product.update({ where: { id }, data: status.data }); return Response.json({ ok: true }); }
    const parsed = productSchema.safeParse(body); if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "اطلاعات محصول معتبر نیست.", 400, "VALIDATION_ERROR");
    const data = parsed.data; const category = await prisma.category.findUnique({ where: { id: data.categoryId } }); if (!category) return apiError("دسته‌بندی معتبر نیست.", 400, "INVALID_CATEGORY");
    await prisma.product.update({ where: { id }, data: { name: data.name, slug: data.slug, shortDescription: data.shortDescription, description: data.description, priceRials: BigInt(data.salePrice ?? data.regularPrice) * BigInt(10), compareAtPriceRials: data.salePrice ? BigInt(data.regularPrice) * BigInt(10) : null, stockQuantity: data.stockCount, categoryId: data.categoryId, isPublished: data.isPublished, images: { deleteMany: {}, create: { url: data.image, sortOrder: 0, position: "center", alt: data.name } } } }); return Response.json({ ok: true });
  } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return apiError("محصول پیدا نشد.", 404, "NOT_FOUND"); if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return apiError("این slug قبلاً استفاده شده است.", 409, "DUPLICATE_SLUG"); return apiError("ویرایش محصول انجام نشد.", 500, "DATABASE_ERROR"); }
}
export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/products/[id]">) { if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED"); try { await prisma.product.delete({ where: { id: (await params).id } }); return Response.json({ ok: true }); } catch { return apiError("حذف محصول انجام نشد.", 400, "DATABASE_ERROR"); } }

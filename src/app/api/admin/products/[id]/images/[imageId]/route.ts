import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { hasAdminSession, apiError } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/products/[id]/images/[imageId]">) {
  if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED"); const { id: productId, imageId } = await params;
  const image = await prisma.productImage.findFirst({ where: { id: imageId, productId } }); if (!image) return apiError("تصویر پیدا نشد.", 404, "NOT_FOUND");
  await prisma.$transaction(async (tx) => { await tx.productImage.delete({ where: { id: imageId } }); const next = await tx.productImage.findFirst({ where: { productId }, orderBy: { sortOrder: "asc" } }); if (next && image.isPrimary) await tx.productImage.update({ where: { id: next.id }, data: { isPrimary: true } }); });
  if (image.url.startsWith("/uploads/products/")) await unlink(join(process.cwd(), "public", image.url)).catch(() => undefined);
  return Response.json({ ok: true });
}

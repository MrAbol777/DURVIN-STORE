import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { hasAdminSession, apiError } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const maxBytes = 5 * 1024 * 1024;

export async function POST(request: Request, { params }: RouteContext<"/api/admin/products/[id]/images">) {
  if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED");
  const { id: productId } = await params;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return apiError("محصول پیدا نشد.", 404, "NOT_FOUND");
  const form = await request.formData().catch(() => null);
  const files = form?.getAll("files").filter((value): value is File => value instanceof File) ?? [];
  if (!files.length) return apiError("حداقل یک تصویر انتخاب کنید.", 400, "VALIDATION_ERROR");
  if (files.some((file) => !allowedTypes.has(file.type) || file.size < 1 || file.size > maxBytes)) return apiError("فقط JPG، PNG و WebP تا سقف ۵ مگابایت مجاز هستند.", 400, "INVALID_IMAGE");
  const directory = join(process.cwd(), "public", "uploads", "products"); await mkdir(directory, { recursive: true });
  const current = await prisma.productImage.findMany({ where: { productId }, orderBy: { sortOrder: "asc" } });
  const created = [];
  for (const [index, file] of files.entries()) { const filename = `${randomUUID()}.${extensions[file.type]}`; await writeFile(join(directory, filename), Buffer.from(await file.arrayBuffer())); created.push({ productId, url: `/uploads/products/${filename}`, alt: product.name, sortOrder: current.length + index, isPrimary: current.length === 0 && index === 0, mimeType: file.type, fileSize: file.size }); }
  await prisma.productImage.createMany({ data: created });
  return Response.json({ ok: true });
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/products/[id]/images">) {
  if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED"); const { id: productId } = await params;
  const body = await request.json().catch(() => null) as { imageIds?: string[]; primaryId?: string; alt?: string } | null;
  const images = await prisma.productImage.findMany({ where: { productId }, orderBy: { sortOrder: "asc" } });
  if (!images.length) return apiError("تصویری برای این محصول وجود ندارد.", 404, "NOT_FOUND");
  const ordered = body?.imageIds?.length === images.length && new Set(body.imageIds).size === images.length && body.imageIds.every((id) => images.some((image) => image.id === id)) ? body.imageIds : images.map((image) => image.id);
  const primaryId = body?.primaryId && images.some((image) => image.id === body.primaryId) ? body.primaryId : images.find((image) => image.isPrimary)?.id ?? ordered[0];
  await prisma.$transaction([prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } }), ...ordered.map((id, sortOrder) => prisma.productImage.update({ where: { id }, data: { sortOrder, isPrimary: id === primaryId } }))]);
  return Response.json({ ok: true });
}

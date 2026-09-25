import { z } from "zod";
import { hasAdminSession, apiError } from "@/lib/admin-api";
import { toAdminOrder } from "@/features/orders/admin-order-serializers";
import { getAdminOrder } from "@/features/orders/order-service";
import { prisma } from "@/lib/prisma";

const updateStatusSchema = z.object({ status: z.enum(["pending", "paid", "processing", "shipped", "completed", "cancelled"]) });

export async function GET(_request: Request, { params }: RouteContext<"/api/admin/orders/[id]">) {
  if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED");
  const order = await getAdminOrder((await params).id);
  if (!order) return apiError("سفارش پیدا نشد.", 404, "NOT_FOUND");
  return Response.json({ ok: true, data: toAdminOrder(order) });
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/orders/[id]">) {
  if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED");
  const parsed = updateStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("وضعیت سفارش معتبر نیست.", 400, "VALIDATION_ERROR");
  try {
    const order = await prisma.order.update({
      where: { id: (await params).id },
      data: { status: parsed.data.status },
      include: { items: true, payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    });
    return Response.json({ ok: true, data: toAdminOrder(order) });
  } catch {
    return apiError("سفارش پیدا نشد.", 404, "NOT_FOUND");
  }
}

import { hasAdminSession, apiError } from "@/lib/admin-api";
import { toAdminOrder } from "@/features/orders/admin-order-serializers";
import { getAdminOrders } from "@/features/orders/order-service";

export async function GET() {
  if (!await hasAdminSession()) return apiError("دسترسی غیرمجاز است.", 401, "UNAUTHORIZED");
  const orders = await getAdminOrders();
  return Response.json({ ok: true, data: orders.map(toAdminOrder) });
}

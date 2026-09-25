import { z } from "zod";
import { getCustomerSession } from "@/lib/customer-api";
import { normalizeDigits } from "@/lib/formatters";
import { findOrderForTracking } from "@/features/orders/order-service";
import { toTrackingOrder } from "@/features/orders/order-serializers";

const schema = z.object({
  code: z.string().trim().min(4).max(191),
  mobile: z.string().transform((value) => normalizeDigits(value).replace(/\D/g, "")).pipe(z.string().regex(/^09\d{9}$/)),
});
const attempts = new Map<string, { count: number; resetAt: number }>();

function allowAttempt(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now(); const current = attempts.get(ip);
  if (!current || current.resetAt < now) { attempts.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (current.count >= 10) return false;
  current.count += 1; return true;
}

export async function POST(request: Request) {
  if (!allowAttempt(request)) return Response.json({ ok: false, error: "سفارش پیدا نشد یا اطلاعات واردشده صحیح نیست." }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "سفارش پیدا نشد یا اطلاعات واردشده صحیح نیست." }, { status: 404 });
  const session = await getCustomerSession();
  const order = await findOrderForTracking(parsed.data.code, parsed.data.mobile, session?.customerId);
  if (!order) return Response.json({ ok: false, error: "سفارش پیدا نشد یا اطلاعات واردشده صحیح نیست." }, { status: 404 });
  return Response.json({ ok: true, data: toTrackingOrder(order) });
}

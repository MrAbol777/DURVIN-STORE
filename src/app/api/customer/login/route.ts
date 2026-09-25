import { loginCustomerSchema } from "@/features/customers/customer-schemas";
import { createCustomerSession, customerSessionCookieOptions, CUSTOMER_SESSION_COOKIE } from "@/lib/customer-auth";
import { verifyPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { getSafeNext } from "@/lib/safe-next";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginCustomerSchema.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "شماره موبایل یا رمز عبور معتبر نیست." }, { status: 400 });
  const customer = await prisma.customer.findUnique({ where: { mobile: parsed.data.mobile } });
  if (!customer || !await verifyPassword(parsed.data.password, customer.passwordHash)) return Response.json({ ok: false, error: "شماره موبایل یا رمز عبور صحیح نیست." }, { status: 401 });
  const response = Response.json({ ok: true, redirectTo: getSafeNext(body?.next) });
  response.headers.append("Set-Cookie", `${CUSTOMER_SESSION_COOKIE}=${createCustomerSession(customer.id)}; Path=/; Max-Age=${customerSessionCookieOptions.maxAge}; HttpOnly; SameSite=Lax${customerSessionCookieOptions.secure ? "; Secure" : ""}`);
  return response;
}

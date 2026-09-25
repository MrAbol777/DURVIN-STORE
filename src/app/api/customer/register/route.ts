import { Prisma } from "@prisma/client";
import { registerCustomerSchema } from "@/features/customers/customer-schemas";
import { createCustomerSession, customerSessionCookieOptions, CUSTOMER_SESSION_COOKIE } from "@/lib/customer-auth";
import { hashPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { getSafeNext } from "@/lib/safe-next";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerCustomerSchema.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: parsed.error.issues[0]?.message ?? "اطلاعات ثبت‌نام معتبر نیست." }, { status: 400 });
  try {
    const customer = await prisma.customer.create({ data: { firstName: parsed.data.firstName, lastName: parsed.data.lastName, mobile: parsed.data.mobile, passwordHash: await hashPassword(parsed.data.password) } });
    const response = Response.json({ ok: true, data: { id: customer.id }, redirectTo: getSafeNext(body?.next) }, { status: 201 });
    const session = createCustomerSession(customer.id);
    response.headers.append("Set-Cookie", `${CUSTOMER_SESSION_COOKIE}=${session}; Path=/; Max-Age=${customerSessionCookieOptions.maxAge}; HttpOnly; SameSite=Lax${customerSessionCookieOptions.secure ? "; Secure" : ""}`);
    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return Response.json({ ok: false, error: "این شماره موبایل قبلاً ثبت‌نام شده است." }, { status: 409 });
    return Response.json({ ok: false, error: "ثبت‌نام انجام نشد." }, { status: 500 });
  }
}

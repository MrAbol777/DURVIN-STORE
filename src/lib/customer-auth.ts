import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CUSTOMER_SESSION_COOKIE = "durvin_customer_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSecret() {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret) throw new Error("CUSTOMER_SESSION_SECRET must be configured.");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createCustomerSession(customerId: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = Buffer.from(JSON.stringify({ customerId, expiresAt })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyCustomerSession(session?: string) {
  if (!session) return null;
  const [payload, signature] = session.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length || !timingSafeEqual(expectedBuffer, signatureBuffer)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { customerId?: unknown; expiresAt?: unknown };
    return typeof data.customerId === "string" && typeof data.expiresAt === "number" && data.expiresAt > Math.floor(Date.now() / 1000)
      ? { customerId: data.customerId, expiresAt: data.expiresAt }
      : null;
  } catch {
    return null;
  }
}

export const customerSessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const session = verifyCustomerSession(cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) return null;
  return prisma.customer.findUnique({
    where: { id: session.customerId },
    select: { id: true, firstName: true, lastName: true, mobile: true },
  });
}

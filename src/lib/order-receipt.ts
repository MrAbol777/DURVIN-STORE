import { createHmac, timingSafeEqual } from "node:crypto";

export const ORDER_RECEIPT_COOKIE = "durvin_order_receipt";

function secret() {
  const value = process.env.ORDER_RECEIPT_SECRET ?? process.env.CUSTOMER_SESSION_SECRET ?? process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ORDER_RECEIPT_SECRET must be configured.");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createOrderReceipt(orderNumber: string) {
  const payload = Buffer.from(JSON.stringify({ orderNumber, expiresAt: Math.floor(Date.now() / 1000) + 60 * 30 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyOrderReceipt(receipt?: string, orderNumber?: string) {
  if (!receipt || !orderNumber) return false;
  const [payload, actual] = receipt.split(".");
  if (!payload || !actual) return false;
  const expected = signature(payload);
  const expectedBuffer = Buffer.from(expected); const actualBuffer = Buffer.from(actual);
  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) return false;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { orderNumber?: unknown; expiresAt?: unknown };
    return value.orderNumber === orderNumber && typeof value.expiresAt === "number" && value.expiresAt > Math.floor(Date.now() / 1000);
  } catch { return false; }
}

export const orderReceiptCookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 30 };

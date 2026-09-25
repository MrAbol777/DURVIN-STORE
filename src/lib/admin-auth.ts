import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "durvin_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    secret: process.env.ADMIN_SESSION_SECRET ?? "",
  };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safelyEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateAdminCredentials(username: string, password: string) {
  const credentials = getCredentials();
  return Boolean(credentials.username && credentials.password && safelyEqual(username, credentials.username) && safelyEqual(password, credentials.password));
}

export function createAdminSession(username: string) {
  const { secret } = getCredentials();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const payload = Buffer.from(JSON.stringify({ username, expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminSession(session: string | undefined) {
  const { secret } = getCredentials();
  if (!session || !secret) return false;
  const [payload, signature] = session.split(".");
  if (!payload || !signature || !safelyEqual(signature, sign(payload, secret))) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { expiresAt?: number };
    return typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export const adminSessionMaxAge = SESSION_MAX_AGE_SECONDS;

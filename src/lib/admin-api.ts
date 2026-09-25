import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export const apiError = (message: string, status: number, code = "REQUEST_ERROR") => Response.json({ ok: false, error: { code, message } }, { status });
export async function hasAdminSession() { const cookieStore = await cookies(); return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value); }

import { cookies } from "next/headers";
import { z } from "zod";
import { ADMIN_SESSION_COOKIE, adminSessionMaxAge, createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";

const loginSchema = z.object({ username: z.string().trim().min(1), password: z.string().min(1) });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = loginSchema.safeParse(body);
  if (!result.success) return Response.json({ message: "نام کاربری و رمز عبور را وارد کنید." }, { status: 400 });
  if (!validateAdminCredentials(result.data.username, result.data.password)) return Response.json({ message: "اطلاعات ورود صحیح نیست." }, { status: 401 });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSession(result.data.username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: adminSessionMaxAge,
    path: "/",
  });
  return Response.json({ ok: true });
}

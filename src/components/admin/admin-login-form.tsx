"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import { brand } from "@/config/brand";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const result = await response.json() as { message?: string };
    setLoading(false);
    if (!response.ok) { setMessage(result.message ?? "ورود انجام نشد."); return; }
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next?.startsWith("/admin") ? next : "/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf6f3] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="font-serif text-xl font-semibold tracking-[0.16em] text-primary">DURVIN STORE</p>
        <h1 className="mt-7 text-2xl font-semibold text-foreground">ورود به پنل مدیریت</h1>
        <p className="mt-2 text-sm leading-7 text-muted">برای مدیریت محصولات و سفارش‌ها وارد شوید.</p>
        <form onSubmit={login} className="mt-7 grid gap-5" noValidate>
          <label><span className="mb-2 block text-sm font-medium text-foreground">نام کاربری</span><input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" className="field" required /></label>
          <label><span className="mb-2 block text-sm font-medium text-foreground">رمز عبور</span><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" className="field" required /></label>
          {message ? <p role="alert" className="rounded-xl bg-[#fdf0f1] p-3 text-sm text-danger">{message}</p> : null}
          <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:bg-muted">{loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="size-4" aria-hidden="true" />}{loading ? "در حال ورود…" : "ورود"}</button>
        </form>
        <p className="mt-6 text-xs leading-6 text-muted">اطلاعات ورود فقط از متغیرهای محیطی سرور خوانده می‌شوند.</p>
        <p className="mt-2 text-xs text-muted">{brand.name}</p>
      </section>
    </main>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { updateCustomerProfileSchema } from "@/features/customers/customer-schemas";

export function CustomerProfileForm({ firstName, lastName, mobile }: { firstName: string; lastName: string; mobile: string }) {
  const router = useRouter();
  const [values, setValues] = useState({ firstName, lastName });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = updateCustomerProfileSchema.safeParse(values);
    if (!validation.success) { setError(validation.error.issues[0]?.message ?? "اطلاعات معتبر نیست."); return; }
    setIsSubmitting(true); setError(""); setSuccess("");
    try {
      const response = await fetch("/api/customer/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(validation.data) });
      const data = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) { setError(data?.message ?? "ویرایش پروفایل انجام نشد."); return; }
      setSuccess("اطلاعات پروفایل ذخیره شد.");
      router.refresh();
    } finally { setIsSubmitting(false); }
  };
  return <form onSubmit={submit} noValidate aria-busy={isSubmitting} className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7"><div className="grid gap-5 sm:grid-cols-2"><label htmlFor="profile-first-name" className="block"><span className="mb-2 block text-sm font-medium text-foreground">نام</span><input id="profile-first-name" value={values.firstName} onChange={(event) => { setValues((current) => ({ ...current, firstName: event.target.value })); setError(""); setSuccess(""); }} autoComplete="given-name" className="field" /></label><label htmlFor="profile-last-name" className="block"><span className="mb-2 block text-sm font-medium text-foreground">نام خانوادگی</span><input id="profile-last-name" value={values.lastName} onChange={(event) => { setValues((current) => ({ ...current, lastName: event.target.value })); setError(""); setSuccess(""); }} autoComplete="family-name" className="field" /></label></div>{error ? <p role="alert" className="mt-3 text-xs text-danger">{error}</p> : null}<div className="mt-5"><span className="mb-2 block text-sm font-medium text-foreground">شماره موبایل</span><p className="field cursor-not-allowed text-muted" dir="ltr">{mobile}</p><p className="mt-2 text-xs text-muted">فعلاً تغییر شماره موبایل از این بخش امکان‌پذیر نیست.</p></div>{success ? <p role="status" className="mt-5 rounded-xl bg-[#eaf6ef] p-3 text-sm text-success">{success}</p> : null}<button type="submit" disabled={isSubmitting} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:bg-muted">{isSubmitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}{isSubmitting ? "در حال ذخیره…" : "ذخیره تغییرات"}</button></form>;
}

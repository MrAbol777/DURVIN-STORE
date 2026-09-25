"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { loginCustomerSchema, registerCustomerSchema } from "@/features/customers/customer-schemas";

type Mode = "login" | "register";
type Values = { firstName: string; lastName: string; mobile: string; password: string; passwordConfirmation: string };
type FieldName = keyof Values;

const emptyValues: Values = { firstName: "", lastName: "", mobile: "", password: "", passwordConfirmation: "" };

export function CustomerAuthForm({ mode, nextPath }: { mode: Mode; nextPath: string }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  const update = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const schema = isRegister ? registerCustomerSchema : loginCustomerSchema;
    const input = isRegister ? values : { mobile: values.mobile, password: values.password };
    const validation = schema.safeParse(input);
    if (!validation.success) {
      const fieldErrors: Partial<Record<FieldName, string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as FieldName;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`/api/customer/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...input, next: nextPath }) });
      const data = await response.json().catch(() => null) as { error?: string; redirectTo?: string } | null;
      if (!response.ok) {
        setMessage(data?.error ?? "عملیات انجام نشد. لطفاً دوباره تلاش کنید.");
        return;
      }
      router.replace(data?.redirectTo ?? "/account");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return <form onSubmit={submit} noValidate aria-busy={isSubmitting} className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7"><div><p className="text-sm font-medium text-primary">{isRegister ? "عضویت در دوروین" : "حساب مشتری"}</p><h1 className="mt-2 text-balance text-2xl font-semibold text-foreground">{isRegister ? "ساخت حساب کاربری" : "ورود به حساب کاربری"}</h1><p className="mt-3 text-pretty text-sm leading-7 text-muted">{isRegister ? "با شماره موبایل خود ثبت‌نام کنید تا سفارش‌هایتان را پیگیری کنید." : "برای مشاهدهٔ حساب و سفارش‌ها وارد شوید."}</p></div><div className="mt-7 grid gap-5">{isRegister ? <><Field id="first-name" label="نام" error={errors.firstName}><input id="first-name" value={values.firstName} onChange={(event) => update("firstName", event.target.value)} autoComplete="given-name" className="field" /></Field><Field id="last-name" label="نام خانوادگی" error={errors.lastName}><input id="last-name" value={values.lastName} onChange={(event) => update("lastName", event.target.value)} autoComplete="family-name" className="field" /></Field></> : null}<Field id="mobile" label="شماره موبایل" error={errors.mobile}><input id="mobile" value={values.mobile} onChange={(event) => update("mobile", event.target.value)} inputMode="numeric" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" className="field" dir="ltr" /></Field><Field id="password" label="رمز عبور" error={errors.password}><input id="password" value={values.password} onChange={(event) => update("password", event.target.value)} type="password" autoComplete={isRegister ? "new-password" : "current-password"} className="field" /></Field>{isRegister ? <Field id="password-confirmation" label="تکرار رمز عبور" error={errors.passwordConfirmation}><input id="password-confirmation" value={values.passwordConfirmation} onChange={(event) => update("passwordConfirmation", event.target.value)} type="password" autoComplete="new-password" className="field" /></Field> : null}</div>{message ? <p role="alert" className="mt-5 rounded-xl bg-[#fdf0f1] p-3 text-sm leading-6 text-danger">{message}</p> : null}<button type="submit" disabled={isSubmitting} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:bg-muted">{isSubmitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}{isSubmitting ? "در حال انجام…" : isRegister ? "ثبت‌نام و ورود" : "ورود"}</button><p className="mt-5 text-center text-sm text-muted">{isRegister ? "قبلاً حساب دارید؟" : "ثبت‌نام نکرده‌اید؟"} <Link href={`${isRegister ? "/login" : "/register"}?next=${encodeURIComponent(nextPath)}`} className="font-medium text-primary hover:text-primary-strong">{isRegister ? "وارد شوید" : "ثبت‌نام کنید"}</Link></p></form>;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <label htmlFor={id} className="block"><span className="mb-2 block text-sm font-medium text-foreground">{label}</span>{children}{error ? <span id={`${id}-error`} role="alert" className="mt-2 block text-xs text-danger">{error}</span> : null}</label>;
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { CheckCircle2, CreditCard, LoaderCircle, UserRound } from "lucide-react";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCart } from "@/features/cart/cart-provider";
import { normalizeDigits } from "@/lib/formatters";

const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد."), lastName: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد."),
  mobile: z.string().trim().regex(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد."), province: z.string().trim().min(2, "استان را وارد کنید."),
  city: z.string().trim().min(2, "شهر را وارد کنید."), address: z.string().trim().min(10, "آدرس باید حداقل ۱۰ حرف باشد."),
  postalCode: z.string().trim().regex(/^\d{10}$/, "کدپستی باید دقیقاً ۱۰ رقم باشد."), notes: z.string().trim().max(500, "توضیحات سفارش نمی‌تواند بیشتر از ۵۰۰ حرف باشد.").optional(),
});
type CheckoutValues = z.infer<typeof checkoutSchema>; type FieldErrors = Partial<Record<keyof CheckoutValues, string>>;
const emptyValues: CheckoutValues = { firstName: "", lastName: "", mobile: "", province: "", city: "", address: "", postalCode: "", notes: "" };

type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  mobile: string;
};

type CheckoutFormProps = {
  customer?: CheckoutCustomer | null;
};

export function CheckoutForm({ customer }: CheckoutFormProps) {
  const router = useRouter(); const { items, clearCart, isHydrated } = useCart();
  const [values, setValues] = useState<CheckoutValues>(() => ({
    ...emptyValues,
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    mobile: customer?.mobile ?? "",
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [outcome, setOutcome] = useState<"successful" | "failed" | "cancelled">("successful"); const [paymentMessage, setPaymentMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); const [guestMode, setGuestMode] = useState(false);
  const idempotencyKey = useRef(typeof crypto === "undefined" ? "" : crypto.randomUUID());
  const isDevelopment = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (customer) {
      setValues((current) => ({
        ...current,
        firstName: current.firstName || customer.firstName || "",
        lastName: current.lastName || customer.lastName || "",
        mobile: current.mobile || customer.mobile || "",
      }));
    }
  }, [customer]);

  const updateField = <Key extends keyof CheckoutValues>(key: Key, value: CheckoutValues[Key]) => { setValues((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); setPaymentMessage(""); };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const validation = checkoutSchema.safeParse(values);
    if (!validation.success) { const nextErrors: FieldErrors = {}; for (const issue of validation.error.issues) { const field = issue.path[0] as keyof CheckoutValues; if (!nextErrors[field]) nextErrors[field] = issue.message; } setErrors(nextErrors); return; }
    if (!items.length) return;
    setIsSubmitting(true); setPaymentMessage("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idempotencyKey: idempotencyKey.current, customer: validation.data, items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })), ...(isDevelopment ? { mockOutcome: outcome } : {}) }) });
      const body = await response.json().catch(() => null) as { ok?: boolean; error?: string; data?: { orderNumber: string } } | null;
      if (!response.ok || !body?.ok || !body.data) { setPaymentMessage(body?.error ?? "ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید."); return; }
      clearCart(); router.push(`/order/${body.data.orderNumber}`);
    } catch { setPaymentMessage("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید."); } finally { setIsSubmitting(false); }
  };

  if (!isHydrated) return <div className="mx-auto min-h-80 max-w-7xl px-4 py-16 text-sm text-muted sm:px-6 lg:px-8">در حال آماده‌سازی ثبت سفارش…</div>;
  if (!items.length) return <div className="mx-auto min-h-80 max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8"><h1 className="text-2xl font-semibold text-foreground">سبد خرید شما خالی است</h1><p className="mt-3 text-sm text-muted">برای ثبت سفارش ابتدا محصولی به سبد خرید اضافه کنید.</p><Link href="/products" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-white">مشاهده محصولات</Link></div>;
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"><div className="mb-8"><p className="text-xs font-medium tracking-[0.15em] text-primary">ثبت سفارش</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">اطلاعات دریافت سفارش</h1></div><div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start"><form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-border bg-surface p-5 sm:p-7"><fieldset><legend className="text-lg font-semibold text-foreground">اطلاعات گیرنده</legend><div className="mt-6 grid gap-5 sm:grid-cols-2"><FormField label="نام" error={errors.firstName}><input value={values.firstName} onChange={(event) => updateField("firstName", event.target.value)} autoComplete="given-name" className="field" /></FormField><FormField label="نام خانوادگی" error={errors.lastName}><input value={values.lastName} onChange={(event) => updateField("lastName", event.target.value)} autoComplete="family-name" className="field" /></FormField><FormField label="شماره موبایل" error={errors.mobile}><input value={values.mobile} onChange={(event) => updateField("mobile", normalizeDigits(event.target.value).replace(/\D/g, ""))} inputMode="numeric" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" className="field" /></FormField><FormField label="کدپستی" error={errors.postalCode}><input value={values.postalCode} onChange={(event) => updateField("postalCode", normalizeDigits(event.target.value).replace(/\D/g, ""))} inputMode="numeric" autoComplete="postal-code" className="field" /></FormField><FormField label="استان" error={errors.province}><input value={values.province} onChange={(event) => updateField("province", event.target.value)} autoComplete="address-level1" className="field" /></FormField><FormField label="شهر" error={errors.city}><input value={values.city} onChange={(event) => updateField("city", event.target.value)} autoComplete="address-level2" className="field" /></FormField><FormField label="آدرس" error={errors.address} className="sm:col-span-2"><textarea value={values.address} onChange={(event) => updateField("address", event.target.value)} autoComplete="street-address" rows={4} className="field resize-y" /></FormField><FormField label="توضیحات سفارش (اختیاری)" error={errors.notes} className="sm:col-span-2"><textarea value={values.notes} onChange={(event) => updateField("notes", event.target.value)} rows={3} maxLength={500} className="field resize-y" /></FormField></div></fieldset>
  {!customer ? (!guestMode ? <section className="mt-8 rounded-xl border border-primary/20 bg-[#faf6f3] p-5"><div className="flex gap-3"><UserRound className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="font-semibold text-foreground">برای پیگیری راحت‌تر سفارش، می‌توانید قبل از پرداخت حساب کاربری بسازید.</h2><p className="mt-1 text-xs leading-6 text-muted">ساخت حساب اختیاری است و سفارش مهمان نیز ثبت می‌شود.</p></div></div><div className="mt-4 flex flex-wrap gap-3"><Link href="/register?next=/checkout" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">ثبت‌نام</Link><Link href="/login?next=/checkout" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground">ورود</Link><button type="button" onClick={() => setGuestMode(true)} className="rounded-full px-4 py-2 text-sm font-medium text-primary">ادامه به‌عنوان مهمان</button></div></section> : <p className="mt-6 text-sm text-muted">سفارش به‌صورت مهمان ثبت می‌شود.</p>) : null}
  <fieldset className="mt-8 border-t border-border pt-7"><legend className="text-lg font-semibold text-foreground">{isDevelopment ? "پرداخت آزمایشی" : "پرداخت"}</legend>{isDevelopment ? <div className="mt-4 rounded-xl border border-border bg-[#faf6f3] p-4"><div className="flex gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-primary"><CreditCard className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-medium text-foreground">Mock Payment</p><p className="mt-1 text-xs leading-6 text-muted">هیچ اطلاعات کارت بانکی دریافت نمی‌شود. فقط نتیجهٔ پرداخت آزمایشی را انتخاب کنید.</p></div></div><label className="mt-4 block text-sm text-foreground">نتیجهٔ تست<select value={outcome} onChange={(event) => setOutcome(event.target.value as typeof outcome)} className="mt-2 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"><option value="successful">پرداخت موفق</option><option value="failed">پرداخت ناموفق</option><option value="cancelled">پرداخت لغوشده</option></select></label></div> : <p className="mt-4 rounded-xl bg-[#faf6f3] p-4 text-sm text-muted">درگاه پرداخت پس از اتصال امن فعال خواهد شد.</p>}</fieldset>
  {paymentMessage ? <p role="alert" className="mt-5 rounded-xl bg-[#fdf0f1] p-4 text-sm leading-7 text-danger">{paymentMessage}</p> : null}<button type="submit" disabled={isSubmitting} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:bg-muted">{isSubmitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="size-4" aria-hidden="true" />}{isSubmitting ? "در حال ثبت سفارش…" : isDevelopment ? "ثبت سفارش و پرداخت آزمایشی" : "ثبت سفارش"}</button></form><OrderSummary /></div></div>;
}
function FormField({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) { return <label className={`block ${className}`}><span className="mb-2 block text-sm font-medium text-foreground">{label}</span>{children}{error ? <span className="mt-2 block text-xs text-danger" role="alert">{error}</span> : null}</label>; }

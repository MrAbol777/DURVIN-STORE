import { Headphones, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  {
    title: "ضمانت اصالت کالا",
    description: "محصولات با دقت انتخاب می‌شوند تا با آرامش خرید کنید.",
    icon: ShieldCheck,
  },
  {
    title: "ارسال سریع",
    description: "سفارش شما پس از ثبت، با دقت برای ارسال آماده می‌شود.",
    icon: Truck,
  },
  {
    title: "پشتیبانی آنلاین",
    description: "برای انتخاب بهتر، پاسخ‌گوی سوال‌های شما هستیم.",
    icon: Headphones,
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid divide-y divide-border rounded-2xl border border-border bg-surface sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-y-0">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div key={benefit.title} className="flex gap-4 p-6 sm:p-7">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f8eceb] text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "@/config/brand";

export function BrandIntro() {
  return (
    <section className="bg-[#eee2da] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <p className="font-serif text-5xl font-light tracking-[0.16em] text-primary sm:text-6xl">DURVIN</p>
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.15em] text-primary">دربارهٔ {brand.shortName}</p>
          <h2 className="mt-4 text-2xl font-semibold leading-10 text-foreground sm:text-3xl">
            زیبایی را ساده، باکیفیت و شخصی‌تر می‌بینیم.
          </h2>
          <p className="mt-4 text-sm leading-8 text-[#5d4c54] sm:text-base">
            {brand.name} برای انتخاب آسان‌تر محصولات آرایشی و بهداشتی شکل گرفته است؛ جایی برای کشف محصولاتی که با سبک زندگی و مراقبت روزانهٔ شما همراه‌اند.
          </p>
          <Link href="/about" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:text-primary-strong">
            بیشتر درباره ما <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

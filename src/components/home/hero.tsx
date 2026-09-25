import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "@/config/brand";

export function Hero() {
  return (
    <section className="px-4 pb-12 pt-5 sm:px-6 sm:pb-16 lg:px-8">
      <div className="relative mx-auto isolate min-h-[34rem] max-w-7xl overflow-hidden rounded-3xl bg-[#efe4da] sm:min-h-[38rem]">
        <Image
          src={brand.assets.heroImage}
          alt="چیدمان محصولات آرایشی و مراقبت پوست روی سنگ روشن"
          fill
          preload
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-[35%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#f7eee8]/95 via-[#f7eee8]/72 to-transparent sm:from-[#f7eee8]/92 sm:via-[#f7eee8]/48" />
        <div className="relative mx-auto flex min-h-[34rem] max-w-7xl items-center px-6 py-14 sm:min-h-[38rem] sm:px-12 lg:px-16">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-medium tracking-[0.16em] text-primary">انتخاب‌های روزانه، با حس خوب</p>
            <h1 className="text-4xl font-semibold leading-[1.35] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              زیبایی، با انتخابی که برای تو ساخته شده
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#5d4c54] sm:text-lg">
              مجموعه‌ای از محصولات آرایشی و بهداشتی باکیفیت؛ انتخاب‌شده برای روتین‌های ساده، دقیق و دوست‌داشتنی شما.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-white transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              مشاهده محصولات
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

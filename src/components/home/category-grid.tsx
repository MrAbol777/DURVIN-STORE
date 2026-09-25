import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { homeCategories } from "@/data/mock-store";
import { SectionHeading } from "@/components/home/section-heading";

export function CategoryGrid() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="دسته‌بندی‌ها"
        title="آنچه برای زیبایی روزانه نیاز دارید"
        description="به‌سادگی دستهٔ مناسب خود را پیدا کنید و انتخابی متناسب با روتینتان داشته باشید."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {homeCategories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group relative min-h-[17.5rem] overflow-hidden rounded-2xl bg-[#eee5df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03]"
              style={{ objectPosition: category.imagePosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f2227]/75 via-[#2f2227]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/85">{category.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                مشاهده محصولات <ArrowLeft className="size-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

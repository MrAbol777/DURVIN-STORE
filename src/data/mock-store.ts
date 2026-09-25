import { brand } from "@/config/brand";
import type { Category, Product } from "@/types/catalog";

/** Temporary storefront content. It will be replaced by data from the admin panel. */
export const homeCategories: Category[] = [
  { id: "skin-care", slug: "skin-care", name: "مراقبت پوست", description: "مراقبت روزانه برای پوستی شاداب و درخشان", href: "/products?category=skin-care", image: brand.assets.heroImage, imagePosition: "20% center" },
  { id: "face-makeup", slug: "face-makeup", name: "آرایش صورت", description: "رنگ و پوشش طبیعی، دقیقاً برای هر روز", href: "/products?category=face-makeup", image: brand.assets.heroImage, imagePosition: "49% center" },
  { id: "lips-eyes", slug: "lips-eyes", name: "لب و چشم", description: "جزئیات کوچک برای جلوه‌ای ماندگار", href: "/products?category=lips-eyes", image: brand.assets.heroImage, imagePosition: "64% center" },
  { id: "hair-care", slug: "hair-care", name: "مراقبت مو", description: "انتخاب‌های ملایم برای موهای سالم‌تر", href: "/products?category=hair-care", image: brand.assets.heroImage, imagePosition: "34% center" },
];

const productImages = (imagePosition: string) => [
  { src: brand.assets.heroImage, position: imagePosition },
  { src: brand.assets.heroImage, position: "28% center" },
  { src: brand.assets.heroImage, position: "52% center" },
];

export const products: Product[] = [
  {
    id: "daily-serum", slug: "daily-hydrating-serum", name: "سرم آبرسان روزانه", category: "مراقبت پوست", categoryId: "skin-care", price: 8_900_000, originalPrice: 10_500_000,
    image: brand.assets.heroImage, imagePosition: "13% center", images: productImages("13% center"), shortDescription: "سرم سبک و آبرسان برای روتین روزانه.", description: "فرمول سبک این سرم برای کمک به حفظ رطوبت پوست طراحی شده است. بافت زودجذب آن، انتخابی دلپذیر برای شروع روتین مراقبت روزانه است.", attributes: [{ label: "حجم", value: "۳۰ میلی‌لیتر" }, { label: "نوع پوست", value: "انواع پوست" }, { label: "بافت", value: "سرمی سبک" }], inStock: true, stockCount: 12, createdAt: "2026-09-15",
  },
  {
    id: "moisture-cream", slug: "silky-moisturizing-cream", name: "کرم مرطوب‌کننده ابریشمی", category: "مراقبت پوست", categoryId: "skin-care", price: 7_600_000,
    image: brand.assets.heroImage, imagePosition: "28% center", images: productImages("28% center"), shortDescription: "مرطوب‌کننده‌ای نرم برای استفاده در تمام روز.", description: "کرم مرطوب‌کننده ابریشمی با بافتی لطیف روی پوست می‌نشیند و حس نرمی و راحتی را در طول روز حفظ می‌کند.", attributes: [{ label: "حجم", value: "۵۰ میلی‌لیتر" }, { label: "نوع پوست", value: "نرمال تا خشک" }, { label: "بافت", value: "کِرِمی نرم" }], inStock: true, stockCount: 8, createdAt: "2026-09-14",
  },
  {
    id: "natural-foundation", slug: "natural-coverage-foundation", name: "کرم‌پودر با پوشش طبیعی", category: "آرایش صورت", categoryId: "face-makeup", price: 12_400_000,
    image: brand.assets.heroImage, imagePosition: "44% center", images: productImages("44% center"), shortDescription: "پوشش یکدست با جلوه‌ای طبیعی و روزانه.", description: "این کرم‌پودر برای داشتن پوششی سبک و یکدست در آرایش روزانه طراحی شده و جلوه‌ای طبیعی به پوست می‌دهد.", attributes: [{ label: "حجم", value: "۳۵ میلی‌لیتر" }, { label: "پوشش", value: "متوسط" }, { label: "جلوه", value: "طبیعی" }], inStock: true, stockCount: 6, createdAt: "2026-09-13",
  },
  {
    id: "soft-lipstick", slug: "peach-satin-lipstick", name: "رژلب ساتن گلبهی", category: "لب و چشم", categoryId: "lips-eyes", price: 6_800_000, originalPrice: 7_900_000,
    image: brand.assets.heroImage, imagePosition: "53% center", images: productImages("53% center"), shortDescription: "رنگی ملایم با نمایی نرم و ساتن.", description: "رژلب ساتن گلبهی، رنگی گرم و قابل استفاده برای آرایش‌های روزانه و ظریف دارد و حس سبکی روی لب ایجاد می‌کند.", attributes: [{ label: "رنگ", value: "گلبهی ملایم" }, { label: "جلوه", value: "ساتن" }, { label: "ماندگاری", value: "روزانه" }], inStock: true, stockCount: 15, createdAt: "2026-09-12",
  },
  {
    id: "blush-compact", slug: "rose-compact-blush", name: "رژگونه فشرده رز", category: "آرایش صورت", categoryId: "face-makeup", price: 7_200_000,
    image: brand.assets.heroImage, imagePosition: "60% center", images: productImages("60% center"), shortDescription: "رنگی لطیف برای جلوه‌ای تازه‌تر روی گونه.", description: "رژگونه فشرده رز با رنگی قابل کنترل، به‌آسانی روی پوست پخش می‌شود و به آرایش روزانه شادابی می‌بخشد.", attributes: [{ label: "رنگ", value: "رز روشن" }, { label: "بافت", value: "پودری فشرده" }, { label: "جلوه", value: "نیمه‌مات" }], inStock: true, stockCount: 9, createdAt: "2026-09-11",
  },
  {
    id: "soft-cleanser", slug: "gentle-face-cleanser", name: "شوینده ملایم صورت", category: "مراقبت پوست", categoryId: "skin-care", price: 5_400_000,
    image: brand.assets.heroImage, imagePosition: "21% center", images: productImages("21% center"), shortDescription: "پاکسازی ملایم برای شروع و پایان روز.", description: "شوینده ملایم صورت برای پاکسازی روزانه بدون ایجاد حس خشکی طراحی شده و پوست را برای مراحل بعدی روتین آماده می‌کند.", attributes: [{ label: "حجم", value: "۱۵۰ میلی‌لیتر" }, { label: "نوع پوست", value: "حساس و نرمال" }, { label: "کاربرد", value: "روزانه" }], inStock: true, stockCount: 18, createdAt: "2026-09-10",
  },
  {
    id: "eye-pencil", slug: "soft-brown-eye-pencil", name: "مداد چشم قهوه‌ای نرم", category: "لب و چشم", categoryId: "lips-eyes", price: 4_100_000,
    image: brand.assets.heroImage, imagePosition: "66% center", images: productImages("66% center"), shortDescription: "خط چشمی نرم با رنگ قهوه‌ای عمیق.", description: "مداد چشم نرم با رنگ قهوه‌ای عمیق برای ایجاد خطوط ظریف و آرایش‌های روزانه طراحی شده است.", attributes: [{ label: "رنگ", value: "قهوه‌ای عمیق" }, { label: "بافت", value: "نرم" }, { label: "کاربرد", value: "چشم" }], inStock: false, stockCount: 0, createdAt: "2026-09-09",
  },
  {
    id: "lip-balm", slug: "nourishing-lip-balm", name: "بالم لب تغذیه‌کننده", category: "لب و چشم", categoryId: "lips-eyes", price: 3_600_000,
    image: brand.assets.heroImage, imagePosition: "55% center", images: productImages("55% center"), shortDescription: "مراقبت سبک برای لب‌های نرم‌تر.", description: "بالم لب تغذیه‌کننده با بافتی سبک، برای همراهی با مراقبت روزانه از لب‌ها انتخابی ساده و کاربردی است.", attributes: [{ label: "حجم", value: "۴.۵ گرم" }, { label: "بافت", value: "بالم" }, { label: "رایحه", value: "ملایم" }], inStock: true, stockCount: 22, createdAt: "2026-09-08",
  },
  {
    id: "hair-mask", slug: "repairing-hair-mask", name: "ماسک موی ترمیم‌کننده", category: "مراقبت مو", categoryId: "hair-care", price: 9_800_000, originalPrice: 11_200_000,
    image: brand.assets.heroImage, imagePosition: "35% center", images: productImages("35% center"), shortDescription: "مراقبت هفتگی برای موهای خشک و آسیب‌دیده.", description: "ماسک موی ترمیم‌کننده برای استفاده در روتین هفتگی طراحی شده و به موها حس لطافت و رسیدگی بیشتری می‌دهد.", attributes: [{ label: "حجم", value: "۲۰۰ میلی‌لیتر" }, { label: "نوع مو", value: "خشک و آسیب‌دیده" }, { label: "کاربرد", value: "هفتگی" }], inStock: true, stockCount: 5, createdAt: "2026-09-07",
  },
  {
    id: "hair-serum", slug: "shine-hair-serum", name: "سرم موی درخشان‌کننده", category: "مراقبت مو", categoryId: "hair-care", price: 8_300_000,
    image: brand.assets.heroImage, imagePosition: "16% center", images: productImages("16% center"), shortDescription: "درخشش ملایم و ظاهر مرتب برای مو.", description: "سرم موی درخشان‌کننده با بافتی سبک، به مرتب‌شدن ظاهر مو و جلوه‌ای لطیف‌تر کمک می‌کند.", attributes: [{ label: "حجم", value: "۶۰ میلی‌لیتر" }, { label: "نوع مو", value: "انواع مو" }, { label: "بافت", value: "سرمی سبک" }], inStock: true, stockCount: 7, createdAt: "2026-09-06",
  },
];

export const featuredProducts = products.slice(0, 6);

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

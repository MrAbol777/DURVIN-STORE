const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("node:crypto");
const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");

function loadLocalEnvironment() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^("|')|("|')$/g, "");
  }
}

loadLocalEnvironment();
const prisma = new PrismaClient();
const heroImage = "/images/hero-beauty.png";

const categories = [
  { slug: "skin-care", name: "مراقبت پوست", description: "مراقبت روزانه برای پوستی شاداب و درخشان", imagePosition: "20% center" },
  { slug: "face-makeup", name: "آرایش صورت", description: "رنگ و پوشش طبیعی، دقیقاً برای هر روز", imagePosition: "49% center" },
  { slug: "lips-eyes", name: "لب و چشم", description: "جزئیات کوچک برای جلوه‌ای ماندگار", imagePosition: "64% center" },
  { slug: "hair-care", name: "مراقبت مو", description: "انتخاب‌های ملایم برای موهای سالم‌تر", imagePosition: "34% center" },
];

const products = [
  ["daily-hydrating-serum", "DVS-SKIN-001", "سرم آبرسان روزانه", "skin-care", 8900000n, 10500000n, 12, "13% center", "سرم سبک و آبرسان برای روتین روزانه.", "فرمول سبک این سرم برای کمک به حفظ رطوبت پوست طراحی شده است. بافت زودجذب آن، انتخابی دلپذیر برای شروع روتین مراقبت روزانه است.", [["حجم", "۳۰ میلی‌لیتر"], ["نوع پوست", "انواع پوست"], ["بافت", "سرمی سبک"]]],
  ["silky-moisturizing-cream", "DVS-SKIN-002", "کرم مرطوب‌کننده ابریشمی", "skin-care", 7600000n, null, 8, "28% center", "مرطوب‌کننده‌ای نرم برای استفاده در تمام روز.", "کرم مرطوب‌کننده ابریشمی با بافتی لطیف روی پوست می‌نشیند و حس نرمی و راحتی را در طول روز حفظ می‌کند.", [["حجم", "۵۰ میلی‌لیتر"], ["نوع پوست", "نرمال تا خشک"], ["بافت", "کِرِمی نرم"]]],
  ["natural-coverage-foundation", "DVS-FACE-001", "کرم‌پودر با پوشش طبیعی", "face-makeup", 12400000n, null, 6, "44% center", "پوشش یکدست با جلوه‌ای طبیعی و روزانه.", "این کرم‌پودر برای داشتن پوششی سبک و یکدست در آرایش روزانه طراحی شده و جلوه‌ای طبیعی به پوست می‌دهد.", [["حجم", "۳۵ میلی‌لیتر"], ["پوشش", "متوسط"], ["جلوه", "طبیعی"]]],
  ["peach-satin-lipstick", "DVS-LIPS-001", "رژلب ساتن گلبهی", "lips-eyes", 6800000n, 7900000n, 15, "53% center", "رنگی ملایم با نمایی نرم و ساتن.", "رژلب ساتن گلبهی، رنگی گرم و قابل استفاده برای آرایش‌های روزانه و ظریف دارد و حس سبکی روی لب ایجاد می‌کند.", [["رنگ", "گلبهی ملایم"], ["جلوه", "ساتن"], ["ماندگاری", "روزانه"]]],
  ["rose-compact-blush", "DVS-FACE-002", "رژگونه فشرده رز", "face-makeup", 7200000n, null, 9, "60% center", "رنگی لطیف برای جلوه‌ای تازه‌تر روی گونه.", "رژگونه فشرده رز با رنگی قابل کنترل، به‌آسانی روی پوست پخش می‌شود و به آرایش روزانه شادابی می‌بخشد.", [["رنگ", "رز روشن"], ["بافت", "پودری فشرده"], ["جلوه", "نیمه‌مات"]]],
  ["gentle-face-cleanser", "DVS-SKIN-003", "شوینده ملایم صورت", "skin-care", 5400000n, null, 18, "21% center", "پاکسازی ملایم برای شروع و پایان روز.", "شوینده ملایم صورت برای پاکسازی روزانه بدون ایجاد حس خشکی طراحی شده و پوست را برای مراحل بعدی روتین آماده می‌کند.", [["حجم", "۱۵۰ میلی‌لیتر"], ["نوع پوست", "حساس و نرمال"], ["کاربرد", "روزانه"]]],
  ["soft-brown-eye-pencil", "DVS-EYES-001", "مداد چشم قهوه‌ای نرم", "lips-eyes", 4100000n, null, 0, "66% center", "خط چشمی نرم با رنگ قهوه‌ای عمیق.", "مداد چشم نرم با رنگ قهوه‌ای عمیق برای ایجاد خطوط ظریف و آرایش‌های روزانه طراحی شده است.", [["رنگ", "قهوه‌ای عمیق"], ["بافت", "نرم"], ["کاربرد", "چشم"]]],
  ["nourishing-lip-balm", "DVS-LIPS-002", "بالم لب تغذیه‌کننده", "lips-eyes", 3600000n, null, 22, "55% center", "مراقبت سبک برای لب‌های نرم‌تر.", "بالم لب تغذیه‌کننده با بافتی سبک، برای همراهی با مراقبت روزانه از لب‌ها انتخابی ساده و کاربردی است.", [["حجم", "۴.۵ گرم"], ["بافت", "بالم"], ["رایحه", "ملایم"]]],
  ["repairing-hair-mask", "DVS-HAIR-001", "ماسک موی ترمیم‌کننده", "hair-care", 9800000n, 11200000n, 5, "35% center", "مراقبت هفتگی برای موهای خشک و آسیب‌دیده.", "ماسک موی ترمیم‌کننده برای استفاده در روتین هفتگی طراحی شده و به موها حس لطافت و رسیدگی بیشتری می‌دهد.", [["حجم", "۲۰۰ میلی‌لیتر"], ["نوع مو", "خشک و آسیب‌دیده"], ["کاربرد", "هفتگی"]]],
  ["shine-hair-serum", "DVS-HAIR-002", "سرم موی درخشان‌کننده", "hair-care", 8300000n, null, 7, "16% center", "درخشش ملایم و ظاهر مرتب برای مو.", "سرم موی درخشان‌کننده با بافتی سبک، به مرتب‌شدن ظاهر مو و جلوه‌ای لطیف‌تر کمک می‌کند.", [["حجم", "۶۰ میلی‌لیتر"], ["نوع مو", "انواع مو"], ["بافت", "سرمی سبک"]]],
];

function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

async function main() {
  const categoryIds = new Map();

  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: { ...category, imageUrl: heroImage },
    });
    categoryIds.set(category.slug, saved.id);
  }

  for (const [slug, sku, name, categorySlug, priceRials, compareAtPriceRials, stockQuantity, position, shortDescription, description, attributes] of products) {
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        sku,
        name,
        categoryId: categoryIds.get(categorySlug),
        priceRials,
        compareAtPriceRials,
        stockQuantity,
        shortDescription,
        description,
        attributes: attributes.map(([label, value]) => ({ label, value })),
        images: { create: [{ url: heroImage, position, sortOrder: 0, alt: name }] },
      },
    });
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (username && password) {
    await prisma.admin.upsert({
      where: { username },
      update: {},
      create: { username, passwordHash: hashPassword(password) },
    });
  } else {
    console.warn("Admin seed skipped: ADMIN_USERNAME and ADMIN_PASSWORD are not configured.");
  }
}

main()
  .then(() => console.log("Seed completed without deleting existing records."))
  .finally(async () => prisma.$disconnect());

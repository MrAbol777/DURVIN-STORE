export function formatToman(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(value / 10)} تومان`;
}

export function getDiscountPercentage(originalPrice: number, price: number) {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function normalizeDigits(value: string) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  return value
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)));
}

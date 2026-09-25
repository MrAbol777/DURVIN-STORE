import type { CSSProperties } from "react";

type CssVariables = CSSProperties & Record<`--${string}`, string>;

/** Central brand configuration. Update these values when brand assets are final. */
export const brand = {
  name: "Durvin Store",
  shortName: "Durvin",
  description: "فروشگاه آنلاین محصولات آرایشی و بهداشتی دوروین",
  siteUrl: "https://example.com",
  locale: "fa_IR",
  direction: "rtl" as const,
  logo: {
    imagePath: null as string | null,
    alt: "لوگوی Durvin Store",
  },
  assets: {
    heroImage: "/images/hero-beauty.png",
  },
  contact: {
    phone: "۰۲۱-۰۰۰۰۰۰۰۰",
    email: "hello@example.com",
    address: "تهران، ایران",
    instagram: "durvin.store",
  },
  commerce: {
    shippingFeeRials: 0,
  },
  theme: {
    primary: "#8B3D63",
    primaryStrong: "#6D2548",
    accent: "#E8B4C8",
    background: "#FCFAFB",
    surface: "#FFFFFF",
    foreground: "#251D22",
    muted: "#746870",
    border: "#E9E1E5",
    success: "#247A50",
    danger: "#B4233A",
  },
  typography: {
    fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif",
  },
} as const;

export const brandCssVariables: CssVariables = {
  "--durvin-color-primary": brand.theme.primary,
  "--durvin-color-primary-strong": brand.theme.primaryStrong,
  "--durvin-color-accent": brand.theme.accent,
  "--durvin-color-background": brand.theme.background,
  "--durvin-color-surface": brand.theme.surface,
  "--durvin-color-foreground": brand.theme.foreground,
  "--durvin-color-muted": brand.theme.muted,
  "--durvin-color-border": brand.theme.border,
  "--durvin-color-success": brand.theme.success,
  "--durvin-color-danger": brand.theme.danger,
  "--durvin-font-family-fa": brand.typography.fontFamily,
};

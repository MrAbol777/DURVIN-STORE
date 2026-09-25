import type { Metadata } from "next";
import { brand, brandCssVariables } from "@/config/brand";
import { CartProvider } from "@/features/cart/cart-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: brand.locale,
    siteName: brand.name,
    title: brand.name,
    description: brand.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir={brand.direction}
      className="h-full antialiased"
      data-scroll-behavior="smooth"
      style={brandCssVariables}
    >
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = { title: "سبد خرید" };

export default function CartPage() {
  return <><Header /><main><CartPageContent /></main><Footer /></>;
}

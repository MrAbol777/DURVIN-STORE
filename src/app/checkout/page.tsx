import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = { title: "ثبت سفارش" };

export default function CheckoutPage() {
  return <><Header /><main><CheckoutForm /></main><Footer /></>;
}

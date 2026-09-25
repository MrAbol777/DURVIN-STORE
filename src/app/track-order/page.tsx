import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { TrackOrderForm } from "@/components/orders/track-order-form";

export const metadata: Metadata = { title: "پیگیری سفارش" };
export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) { const { code } = await searchParams; return <><Header /><main><TrackOrderForm initialCode={code ?? ""} /></main><Footer /></>; }

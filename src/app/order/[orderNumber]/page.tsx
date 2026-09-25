import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { OrderSuccessCard } from "@/components/orders/order-success-card";
import { getCustomerSession } from "@/lib/customer-api";
import { ORDER_RECEIPT_COOKIE, verifyOrderReceipt } from "@/lib/order-receipt";
import { orderAmounts } from "@/features/orders/order-service";
import { prisma } from "@/lib/prisma";

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params; const session = await getCustomerSession(); const cookieStore = await cookies();
  const canUseReceipt = verifyOrderReceipt(cookieStore.get(ORDER_RECEIPT_COOKIE)?.value, orderNumber);
  if (!canUseReceipt && !session) notFound();
  const order = await prisma.order.findFirst({ where: canUseReceipt ? { orderNumber } : { orderNumber, customerId: session!.customerId } });
  if (!order) notFound();
  return <><Header /><main className="mx-auto flex min-h-96 max-w-7xl items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8"><OrderSuccessCard order={{ orderNumber: order.orderNumber, trackingCode: order.trackingCode, createdAt: order.createdAt.toISOString(), total: orderAmounts(order).total, status: order.status, isGuest: !order.customerId }} /></main><Footer /></>;
}

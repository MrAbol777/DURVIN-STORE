import type { Product } from "@/types/catalog";
import type { StoreOrderStatus, StorePaymentStatus } from "@/features/orders/order-presentation";

export type AdminProduct = Product & { isPublished: boolean };
export type AdminCategory = { id: string; name: string; slug: string; description: string; image: string; isActive: boolean };
export type OrderStatus = StoreOrderStatus;
export type AdminOrderItem = { id: string; productId: string | null; name: string; sku: string; quantity: number; unitPrice: number; lineTotal: number };
export type AdminOrder = {
  id: string;
  orderNumber: string;
  trackingCode: string | null;
  customer: { firstName: string; lastName: string; mobile: string; province: string; city: string; address: string; postalCode: string; notes?: string };
  items: AdminOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentStatus: StorePaymentStatus;
  paymentProvider: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

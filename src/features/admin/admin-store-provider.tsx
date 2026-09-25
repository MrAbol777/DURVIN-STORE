"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AdminCategory, AdminOrder, AdminProduct, OrderStatus } from "@/features/admin/admin-types";

type AdminStoreValue = {
  products: AdminProduct[];
  categories: AdminCategory[];
  orders: AdminOrder[];
  isHydrated: boolean;
  addProduct: (product: AdminProduct) => Promise<boolean>;
  updateProduct: (id: string, product: AdminProduct) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addCategory: (category: AdminCategory) => Promise<boolean>;
  updateCategory: (id: string, category: AdminCategory) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
  refreshCatalog: () => Promise<void>;
  refreshOrders: () => Promise<void>;
};

const AdminStoreContext = createContext<AdminStoreValue | undefined>(undefined);

async function request<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  const body = await response.json().catch(() => null) as { ok?: boolean; data?: T } | null;
  return { ok: response.ok && body?.ok === true, data: body?.data };
}

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const refreshCatalog = useCallback(async () => {
    const [productsResult, categoriesResult] = await Promise.all([
      request<AdminProduct[]>("/api/admin/products"),
      request<AdminCategory[]>("/api/admin/categories"),
    ]);
    if (productsResult.ok) setProducts(productsResult.data ?? []);
    if (categoriesResult.ok) setCategories(categoriesResult.data ?? []);
  }, []);

  const refreshOrders = useCallback(async () => {
    const result = await request<AdminOrder[]>("/api/admin/orders");
    if (result.ok) setOrders(result.data ?? []);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([refreshCatalog(), refreshOrders()]).finally(() => setIsHydrated(true));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshCatalog, refreshOrders]);

  const addProduct = useCallback(async (product: AdminProduct) => {
    const result = await request("/api/admin/products", { method: "POST", body: JSON.stringify(toProductPayload(product)) });
    if (result.ok) await refreshCatalog();
    return result.ok;
  }, [refreshCatalog]);

  const updateProduct = useCallback(async (id: string, product: AdminProduct) => {
    const result = await request(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(toProductPayload(product)) });
    if (result.ok) await refreshCatalog();
    return result.ok;
  }, [refreshCatalog]);

  const deleteProduct = useCallback(async (id: string) => {
    const result = await request(`/api/admin/products/${id}`, { method: "DELETE" });
    if (result.ok) await refreshCatalog();
    return result.ok;
  }, [refreshCatalog]);

  const addCategory = useCallback(async (category: AdminCategory) => {
    const result = await request("/api/admin/categories", { method: "POST", body: JSON.stringify(category) });
    if (result.ok) await refreshCatalog();
    return result.ok;
  }, [refreshCatalog]);

  const updateCategory = useCallback(async (id: string, category: AdminCategory) => {
    const result = await request(`/api/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(category) });
    if (result.ok) await refreshCatalog();
    return result.ok;
  }, [refreshCatalog]);

  const deleteCategory = useCallback(async (id: string) => {
    const result = await request(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (result.ok) await refreshCatalog();
    return result.ok;
  }, [refreshCatalog]);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    const result = await request<AdminOrder>(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    if (!result.ok || !result.data) return false;
    setOrders((current) => current.map((order) => order.id === id ? result.data! : order));
    return true;
  }, []);

  const value = useMemo(() => ({ products, categories, orders, isHydrated, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, updateOrderStatus, refreshCatalog, refreshOrders }), [products, categories, orders, isHydrated, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, updateOrderStatus, refreshCatalog, refreshOrders]);
  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

function toProductPayload(product: AdminProduct) {
  return { name: product.name, slug: product.slug, shortDescription: product.shortDescription, description: product.description, regularPrice: (product.originalPrice ?? product.price) / 10, salePrice: product.originalPrice ? product.price / 10 : undefined, stockCount: product.stockCount, categoryId: product.categoryId, image: product.image, isPublished: product.isPublished };
}

export function useAdminStore() {
  const context = useContext(AdminStoreContext);
  if (!context) throw new Error("useAdminStore must be used within AdminStoreProvider");
  return context;
}

export const defaultAdminImage = "/images/hero-beauty.png";

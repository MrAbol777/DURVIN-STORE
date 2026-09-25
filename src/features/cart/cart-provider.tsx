"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { brand } from "@/config/brand";
import type { Product } from "@/types/catalog";

type CartItem = { product: Product; quantity: number };
type StoredCartItem = CartItem;
type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  isHydrated: boolean;
  addItem: (product: Product, quantity?: number) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "durvin-store-cart-v1";
const CartContext = createContext<CartContextValue | undefined>(undefined);

function restoreCart(): CartItem[] {
  try {
    const storedItems = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as StoredCartItem[];
    if (!Array.isArray(storedItems)) return [];

    return storedItems.reduce<CartItem[]>((restored, item) => {
      const product = item.product;
      const quantity = Math.min(Math.max(0, Number(item.quantity) || 0), product?.stockCount ?? 0);
      if (product?.inStock && quantity > 0) restored.push({ product, quantity });
      return restored;
    }, []);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setItems(restoreCart());
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (!product.inStock || product.stockCount < 1) return false;
    const safeQuantity = Math.max(1, quantity);
    const currentQuantity = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
    if (currentQuantity + safeQuantity > product.stockCount) return false;
    setItems((currentItems) => {
      const currentItem = currentItems.find((item) => item.product.id === product.id);
      if (currentItem) {
        return currentItems.map((item) => item.product.id === product.id
          ? { ...item, quantity: item.quantity + safeQuantity }
          : item);
      }
      return [...currentItems, { product, quantity: safeQuantity }];
    });
    return true;
  }, [items]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((currentItems) => currentItems.flatMap((item) => {
      if (item.product.id !== productId) return [item];
      if (quantity <= 0) return [];
      return [{ ...item, quantity: Math.min(item.product.stockCount, quantity) }];
    }));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.product.originalPrice ?? item.product.price) * item.quantity, 0);
    const discount = items.reduce((sum, item) => sum + ((item.product.originalPrice ?? item.product.price) - item.product.price) * item.quantity, 0);
    const shipping = items.length ? brand.commerce.shippingFeeRials : 0;
    return { items, cartCount, subtotal, discount, shipping, total: subtotal - discount + shipping, isHydrated, addItem, updateQuantity, removeItem, clearCart };
  }, [addItem, clearCart, isHydrated, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  addToCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/app/actions/cart";
import { track } from "@/lib/analytics/client";
import type { Cart } from "@/lib/shopify/types";

interface CartContextValue {
  cart: Cart | null;
  isPending: boolean;
  error: string | null;
  clearError: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (variantId: string, quantity?: number) => void;
  updateItem: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: Cart | null;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [isPending, startTransition] = useTransition();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addItem(variantId: string, quantity = 1) {
    setError(null);
    startTransition(async () => {
      try {
        const updated = await addToCartAction(variantId, quantity);
        setCart(updated);
        setDrawerOpen(true);
        const line = updated.lines.find((l) => l.merchandise.id === variantId);
        if (line) {
          track("add_to_cart", {
            id: variantId,
            title: line.merchandise.product.title,
            price: Number(line.cost.totalAmount.amount) / line.quantity,
            currency: line.cost.totalAmount.currencyCode,
            quantity,
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't add to cart.");
      }
    });
  }

  function updateItem(lineId: string, quantity: number) {
    setError(null);
    startTransition(async () => {
      try {
        const updated = await updateCartLineAction(lineId, quantity);
        setCart(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't update the cart.");
      }
    });
  }

  function removeItem(lineId: string) {
    setError(null);
    const removed = cart?.lines.find((l) => l.id === lineId);
    startTransition(async () => {
      try {
        const updated = await removeCartLineAction(lineId);
        setCart(updated);
        if (removed) {
          track("remove_from_cart", {
            id: removed.merchandise.id,
            title: removed.merchandise.product.title,
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't remove the item.");
      }
    });
  }

  function openDrawer() {
    setDrawerOpen(true);
    if (cart) {
      track("view_cart", {
        value: Number(cart.cost.subtotalAmount.amount),
        currency: cart.cost.subtotalAmount.currencyCode,
        items: cart.totalQuantity,
      });
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isPending,
        error,
        clearError: () => setError(null),
        isDrawerOpen,
        openDrawer,
        closeDrawer: () => setDrawerOpen(false),
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

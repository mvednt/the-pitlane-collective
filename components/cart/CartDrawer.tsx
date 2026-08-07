"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { track } from "@/lib/analytics/client";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { siteConfig } from "@/lib/config/site";
import { formatMoney } from "@/lib/utils";
import { CloseIcon } from "@/components/ui/icons";
import { CartLineItem } from "./CartLineItem";
import { FreeShipBar } from "./FreeShipBar";

export function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, error } = useCart();
  const panelRef = useFocusTrap<HTMLElement>(isDrawerOpen);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const lines = cart?.lines ?? [];
  const subtotal = Number(cart?.cost.subtotalAmount.amount ?? 0);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeDrawer}
        className="absolute inset-0 bg-tpc-black/50"
      />

      <aside
        ref={panelRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface text-foreground shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg tracking-tight">Your Cart</h2>
          <button type="button" onClick={closeDrawer} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {error ? (
          <p
            role="alert"
            className="border-b border-border bg-accent/10 px-5 py-2.5 text-xs text-accent"
          >
            {error}
          </p>
        ) : null}

        {lines.length > 0 ? (
          <div className="border-b border-border px-5 py-3">
            <FreeShipBar subtotal={subtotal} threshold={siteConfig.freeShippingThreshold} />
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted">Your cart is empty.</p>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-3 text-sm font-medium underline underline-offset-4"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && cart ? (
          <div className="border-t border-border px-5 py-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold tabular">
                {formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>
            <p className="mb-3 text-xs text-muted">
              Taxes included. Shipping calculated at checkout.
            </p>
            <Link
              href={cart.checkoutUrl}
              onClick={() =>
                track("begin_checkout", {
                  value: Number(cart.cost.subtotalAmount.amount),
                  currency: cart.cost.subtotalAmount.currencyCode,
                  items: cart.totalQuantity,
                })
              }
              className="block w-full rounded-md bg-tpc-black py-3 text-center text-sm font-semibold uppercase tracking-wide text-tpc-cream transition-opacity hover:opacity-90"
            >
              Checkout
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

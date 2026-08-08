"use server";

import { cookies } from "next/headers";
import { shopify } from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

const CART_COOKIE = "cartId";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Reads the current cart without creating one — safe to call from server components. */
export async function getCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;
  try {
    return await shopify.getCart(cartId);
  } catch {
    // A stale or malformed cart cookie (an expired cart, or a mock-mode id
    // reused against live Shopify) makes Shopify reject `$cartId`. A cart read
    // is best-effort — degrade to "no cart" rather than crashing the page.
    return null;
  }
}

async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(CART_COOKIE)?.value;

  if (existingId) {
    try {
      const existingCart = await shopify.getCart(existingId);
      if (existingCart) return existingId;
    } catch {
      // Invalid/expired cookie — fall through and create a fresh cart.
    }
  }

  const cart = await shopify.createCart();
  cookieStore.set(CART_COOKIE, cart.id, {
    maxAge: CART_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return cart.id;
}

export async function addToCartAction(
  variantId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await getOrCreateCartId();
  return shopify.addCartLines(cartId, [{ merchandiseId: variantId, quantity }]);
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await getOrCreateCartId();
  return shopify.updateCartLines(cartId, [{ lineId, quantity }]);
}

export async function removeCartLineAction(lineId: string): Promise<Cart> {
  const cartId = await getOrCreateCartId();
  return shopify.removeCartLines(cartId, [lineId]);
}

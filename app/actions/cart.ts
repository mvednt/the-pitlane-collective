"use server";

import { cookies } from "next/headers";
import { shopify } from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

const CART_COOKIE = "cartId";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Result of a cart mutation. Actions return this instead of throwing so the
 * real failure reason reaches the UI: an error thrown from a Server Action is
 * sanitised to an opaque "React error #441" in production builds, which hides
 * the actual message. Returning it as data keeps it visible.
 */
export type CartResult =
  | { ok: true; cart: Cart | null }
  | { ok: false; error: string };

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

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

/**
 * Resolves the shopper's existing, still-valid cart id — never creates one.
 * Used by update/remove: mutating a line only makes sense against the cart that
 * holds it. Creating a fresh cart here (as `getOrCreateCartId` does) would then
 * try to remove/update a line that isn't in it, which Shopify rejects — the
 * error that surfaced as "React error #441" on remove. Returns null when the
 * cart cookie is missing, expired, or Shopify can't be reached, so callers can
 * degrade to "already gone" instead of failing.
 */
async function getExistingCartId(): Promise<string | null> {
  const existingId = (await cookies()).get(CART_COOKIE)?.value;
  if (!existingId) return null;
  try {
    const cart = await shopify.getCart(existingId);
    return cart ? existingId : null;
  } catch {
    return null;
  }
}

export async function addToCartAction(
  variantId: string,
  quantity: number,
): Promise<CartResult> {
  try {
    const cartId = await getOrCreateCartId();
    const cart = await shopify.addCartLines(cartId, [
      { merchandiseId: variantId, quantity },
    ]);
    return { ok: true, cart };
  } catch (error) {
    return { ok: false, error: errorMessage(error, "Couldn't add to cart.") };
  }
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<CartResult> {
  try {
    const cartId = await getExistingCartId();
    // Cart is gone — nothing to update; report it as an empty cart.
    if (!cartId) return { ok: true, cart: null };
    const cart = await shopify.updateCartLines(cartId, [{ lineId, quantity }]);
    return { ok: true, cart };
  } catch (error) {
    return { ok: false, error: errorMessage(error, "Couldn't update the cart.") };
  }
}

export async function removeCartLineAction(lineId: string): Promise<CartResult> {
  try {
    const cartId = await getExistingCartId();
    // Cart is gone — the item is already absent; report an empty cart.
    if (!cartId) return { ok: true, cart: null };
    const cart = await shopify.removeCartLines(cartId, [lineId]);
    return { ok: true, cart };
  } catch (error) {
    return { ok: false, error: errorMessage(error, "Couldn't remove the item.") };
  }
}

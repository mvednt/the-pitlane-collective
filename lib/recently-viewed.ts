import type { Product } from "@/lib/shopify/types";

/**
 * Recently-viewed products, persisted client-side in localStorage. This is
 * website-specific UX state (not commerce data), so it never touches Shopify.
 * Device-local only; not synced to any server.
 */

export interface RecentProduct {
  handle: string;
  title: string;
  productType: string;
  image: string | null;
  price: string;
  currencyCode: string;
}

const KEY = "tpc:recently-viewed";
const MAX = 8;

export function toRecent(product: Product): RecentProduct {
  return {
    handle: product.handle,
    title: product.title,
    productType: product.productType,
    image: product.featuredImage?.url ?? null,
    price: product.priceRange.minVariantPrice.amount,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
  };
}

export function getRecent(): RecentProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RecentProduct[]) : [];
  } catch {
    return [];
  }
}

export function addRecent(product: RecentProduct): RecentProduct[] {
  if (typeof window === "undefined") return [];
  const existing = getRecent().filter((p) => p.handle !== product.handle);
  const next = [product, ...existing].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / privacy-mode failures.
  }
  return next;
}

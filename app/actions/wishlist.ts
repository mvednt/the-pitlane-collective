"use server";

import { shopify } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

/**
 * Fetches fresh product data for wishlisted handles. The wishlist itself stores
 * only Shopify references (id + handle) client-side; product and inventory data
 * always come live from the data source here, never from wishlist storage.
 * Missing handles (deleted/renamed products) are simply dropped.
 */
export async function getProductsByHandlesAction(
  handles: string[],
): Promise<Product[]> {
  if (handles.length === 0) return [];

  const products = await Promise.all(
    handles.map((handle) => shopify.getProduct(handle)),
  );

  // Preserve the incoming order (most-recently-added first) and drop misses.
  return products.filter((p): p is Product => p !== null);
}

"use server";

import { headers } from "next/headers";
import { clientIp, rateLimit, sweepIfDue } from "@/lib/rate-limit";
import { shopify } from "@/lib/shopify";

/**
 * Compact suggestion shapes sent to the search overlay. Kept small so each
 * debounced keystroke transfers little data — the full Product is not shipped.
 */
export interface ProductSuggestion {
  handle: string;
  title: string;
  productType: string;
  image: string | null;
  imageAlt: string | null;
  price: string;
  currencyCode: string;
  availableForSale: boolean;
}

export interface CollectionSuggestion {
  handle: string;
  title: string;
}

export interface PredictiveSearchResponse {
  products: ProductSuggestion[];
  collections: CollectionSuggestion[];
}

export async function predictiveSearchAction(
  query: string,
): Promise<PredictiveSearchResponse> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return { products: [], collections: [] };

  // Generous limit — search is debounced client-side, this guards abuse.
  sweepIfDue();
  const limit = rateLimit(`search:${clientIp(await headers())}`, {
    limit: 40,
    windowMs: 60_000,
  });
  if (!limit.ok) return { products: [], collections: [] };

  const { products, collections } = await shopify.predictiveSearch(trimmed, 6);

  return {
    products: products.map((p) => ({
      handle: p.handle,
      title: p.title,
      productType: p.productType,
      image: p.featuredImage?.url ?? null,
      imageAlt: p.featuredImage?.altText ?? p.title,
      price: p.priceRange.minVariantPrice.amount,
      currencyCode: p.priceRange.minVariantPrice.currencyCode,
      availableForSale: p.availableForSale,
    })),
    collections: collections.map((c) => ({
      handle: c.handle,
      title: c.title,
    })),
  };
}

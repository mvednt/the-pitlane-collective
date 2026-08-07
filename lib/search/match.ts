import type { Product } from "@/lib/shopify/types";

/**
 * Pure, dependency-free product matcher shared by the mock search and the
 * predictive-search overlay. Kept out of the `server-only` data layer so it
 * can be unit-tested and reused on either side.
 *
 * Matching is token-based (AND): every whitespace-separated token in the query
 * must appear somewhere in the product's searchable text — title, product type,
 * gender, tags, and option values (colours/sizes). This lets queries like
 * "black oversized" or "racing red jersey" resolve without hard-coding any
 * brand, team, or driver names into the logic.
 */

export function productHaystack(product: Product): string {
  const optionValues = product.options.flatMap((o) => o.values);
  return [
    product.title,
    product.productType,
    ...product.gender,
    ...product.tags,
    ...optionValues,
  ]
    .join(" ")
    .toLowerCase();
}

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function productMatchesQuery(product: Product, query: string): boolean {
  const tokens = tokenize(query);
  if (tokens.length === 0) return false;
  const haystack = productHaystack(product);
  return tokens.every((token) => haystack.includes(token));
}

/**
 * Ranks matched products so exact/prefix title hits surface first, then
 * available products ahead of sold-out ones. Returns a new sorted array.
 */
export function rankBySearchRelevance(
  products: Product[],
  query: string,
): Product[] {
  const q = query.trim().toLowerCase();
  return [...products].sort((a, b) => scoreOf(b, q) - scoreOf(a, q));
}

function scoreOf(product: Product, q: string): number {
  const title = product.title.toLowerCase();
  let score = 0;
  if (title === q) score += 100;
  else if (title.startsWith(q)) score += 50;
  else if (title.includes(q)) score += 25;
  if (product.availableForSale) score += 5;
  return score;
}

import type { Product } from "@/lib/shopify/types";

/**
 * Client-side faceted filtering + sorting for a collection's products.
 *
 * Facets are derived from the normalized product data (options, productType,
 * gender, price), which maps cleanly to Shopify later: sizes/colours come from
 * product options, category from productType, gender/fit from tags/metafields,
 * price from variant prices. Swapping to Shopify's `filters` on the collection
 * query is a drop-in replacement for `computeFacets` + `applyFilters`.
 */

export type SortKey =
  | "featured"
  | "newest"
  | "bestselling"
  | "price-asc"
  | "price-desc";

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "bestselling", label: "Bestselling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export interface ActiveFilters {
  categories: string[];
  genders: string[];
  sizes: string[];
  colours: string[];
  fits: string[];
  priceMin: number | null;
  priceMax: number | null;
  inStockOnly: boolean;
  sort: SortKey;
}

export interface Facets {
  categories: string[];
  genders: string[];
  sizes: string[];
  colours: string[];
  fits: string[];
  priceRange: [number, number];
}

export const EMPTY_FILTERS: ActiveFilters = {
  categories: [],
  genders: [],
  sizes: [],
  colours: [],
  fits: [],
  priceMin: null,
  priceMax: null,
  inStockOnly: false,
  sort: "featured",
};

/** Categorical fit facet. In live mode this maps to a `tpc.fit` metafield. */
export function fitOf(product: Product): string {
  switch (product.productType) {
    case "Baby Tee":
      return "Fitted";
    case "Jersey":
      return "Relaxed";
    default:
      return "Oversized";
  }
}

function optionValues(product: Product, optionName: string): string[] {
  const option = product.options.find(
    (o) => o.name.toLowerCase() === optionName.toLowerCase(),
  );
  return option?.values ?? [];
}

function minPrice(product: Product): number {
  return Number(product.priceRange.minVariantPrice.amount);
}

const GENDER_LABELS: Record<string, string> = {
  men: "Men",
  women: "Women",
  unisex: "Unisex",
};

export function genderLabel(gender: string): string {
  return GENDER_LABELS[gender] ?? gender;
}

export function computeFacets(products: Product[]): Facets {
  const categories = new Set<string>();
  const genders = new Set<string>();
  const sizes = new Set<string>();
  const colours = new Set<string>();
  const fits = new Set<string>();
  let min = Infinity;
  let max = 0;

  for (const product of products) {
    if (product.productType) categories.add(product.productType);
    product.gender.forEach((g) => genders.add(g));
    optionValues(product, "Size").forEach((s) => sizes.add(s));
    optionValues(product, "Colour").forEach((c) => colours.add(c));
    fits.add(fitOf(product));
    const price = minPrice(product);
    min = Math.min(min, price);
    max = Math.max(max, price);
  }

  // Preserve a sensible size order rather than alphabetical.
  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
  const sortedSizes = [...sizes].sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b),
  );

  return {
    categories: [...categories].sort(),
    genders: [...genders].sort(),
    sizes: sortedSizes,
    colours: [...colours].sort(),
    fits: [...fits].sort(),
    priceRange: [
      Number.isFinite(min) ? Math.floor(min) : 0,
      Math.ceil(max) || 0,
    ],
  };
}

function productHasSize(product: Product, sizes: string[]): boolean {
  const available = new Set(optionValues(product, "Size"));
  return sizes.some((s) => available.has(s));
}

function productHasColour(product: Product, colours: string[]): boolean {
  const available = new Set(optionValues(product, "Colour"));
  return colours.some((c) => available.has(c));
}

export function applyFilters(
  products: Product[],
  filters: ActiveFilters,
): Product[] {
  return products.filter((product) => {
    if (
      filters.categories.length &&
      !filters.categories.includes(product.productType)
    ) {
      return false;
    }
    if (
      filters.genders.length &&
      !filters.genders.some((g) => product.gender.includes(g))
    ) {
      return false;
    }
    if (filters.fits.length && !filters.fits.includes(fitOf(product))) {
      return false;
    }
    if (filters.sizes.length && !productHasSize(product, filters.sizes)) {
      return false;
    }
    if (filters.colours.length && !productHasColour(product, filters.colours)) {
      return false;
    }
    const price = minPrice(product);
    if (filters.priceMin !== null && price < filters.priceMin) return false;
    if (filters.priceMax !== null && price > filters.priceMax) return false;
    if (filters.inStockOnly && !product.availableForSale) return false;
    return true;
  });
}

export function sortProducts(
  products: Product[],
  sort: SortKey,
): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => minPrice(a) - minPrice(b));
    case "price-desc":
      return copy.sort((a, b) => minPrice(b) - minPrice(a));
    case "newest":
      return copy.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    case "bestselling":
      // Proxy: products badged "Bestseller" first, then featured order.
      return copy.sort(
        (a, b) =>
          (b.badge === "Bestseller" ? 1 : 0) -
          (a.badge === "Bestseller" ? 1 : 0),
      );
    case "featured":
    default:
      return copy;
  }
}

/** Count of active facet selections (excludes sort). */
export function activeFilterCount(filters: ActiveFilters): number {
  return (
    filters.categories.length +
    filters.genders.length +
    filters.sizes.length +
    filters.colours.length +
    filters.fits.length +
    (filters.priceMin !== null || filters.priceMax !== null ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)
  );
}

/* ------------------------------------------------------------------ */
/* URL <-> filter serialization                                        */
/* ------------------------------------------------------------------ */

type ParamsLike = {
  get(key: string): string | null;
};

function parseList(params: ParamsLike, key: string): string[] {
  const raw = params.get(key);
  return raw ? raw.split(",").filter(Boolean) : [];
}

export function parseFilters(params: ParamsLike): ActiveFilters {
  const sortRaw = params.get("sort");
  const sort: SortKey =
    sortRaw && SORT_OPTIONS.some((o) => o.value === sortRaw)
      ? (sortRaw as SortKey)
      : "featured";

  const priceMinRaw = params.get("priceMin");
  const priceMaxRaw = params.get("priceMax");

  return {
    categories: parseList(params, "category"),
    genders: parseList(params, "gender"),
    sizes: parseList(params, "size"),
    colours: parseList(params, "colour"),
    fits: parseList(params, "fit"),
    priceMin: priceMinRaw ? Number(priceMinRaw) : null,
    priceMax: priceMaxRaw ? Number(priceMaxRaw) : null,
    inStockOnly: params.get("availability") === "in-stock",
    sort,
  };
}

/** Serialize filters to URLSearchParams (omitting defaults for clean URLs). */
export function filtersToSearchParams(
  filters: ActiveFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.genders.length) params.set("gender", filters.genders.join(","));
  if (filters.sizes.length) params.set("size", filters.sizes.join(","));
  if (filters.colours.length) params.set("colour", filters.colours.join(","));
  if (filters.fits.length) params.set("fit", filters.fits.join(","));
  if (filters.priceMin !== null) params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== null) params.set("priceMax", String(filters.priceMax));
  if (filters.inStockOnly) params.set("availability", "in-stock");
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params;
}

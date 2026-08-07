import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyFilters,
  computeFacets,
  EMPTY_FILTERS,
  filtersToSearchParams,
  parseFilters,
  sortProducts,
} from "../lib/filters.ts";
import { makeProduct } from "./fixtures.ts";

const tee = makeProduct({
  handle: "tee",
  productType: "Oversized T-Shirt",
  gender: ["men"],
  priceRange: {
    minVariantPrice: { amount: "1499", currencyCode: "INR" },
    maxVariantPrice: { amount: "1499", currencyCode: "INR" },
  },
  options: [
    { id: "o1", name: "Size", values: ["S", "M", "L"] },
    { id: "o2", name: "Colour", values: ["Black"] },
  ],
});

const jersey = makeProduct({
  handle: "jersey",
  productType: "Jersey",
  gender: ["women"],
  availableForSale: false,
  priceRange: {
    minVariantPrice: { amount: "1999", currencyCode: "INR" },
    maxVariantPrice: { amount: "1999", currencyCode: "INR" },
  },
  options: [
    { id: "o1", name: "Size", values: ["M", "XL"] },
    { id: "o2", name: "Colour", values: ["Papaya"] },
  ],
});

const products = [tee, jersey];

test("computeFacets derives categories, sizes, colours and price range", () => {
  const facets = computeFacets(products);
  assert.deepEqual(facets.categories, ["Jersey", "Oversized T-Shirt"]);
  assert.deepEqual(facets.sizes, ["S", "M", "L", "XL"]); // size-ordered, not alpha
  assert.ok(facets.colours.includes("Papaya"));
  assert.deepEqual(facets.priceRange, [1499, 1999]);
});

test("applyFilters narrows by category, colour, price and availability", () => {
  assert.deepEqual(
    applyFilters(products, { ...EMPTY_FILTERS, categories: ["Jersey"] }).map(
      (p) => p.handle,
    ),
    ["jersey"],
  );
  assert.deepEqual(
    applyFilters(products, { ...EMPTY_FILTERS, colours: ["Black"] }).map(
      (p) => p.handle,
    ),
    ["tee"],
  );
  assert.deepEqual(
    applyFilters(products, { ...EMPTY_FILTERS, inStockOnly: true }).map(
      (p) => p.handle,
    ),
    ["tee"],
  );
  assert.deepEqual(
    applyFilters(products, { ...EMPTY_FILTERS, priceMax: 1500 }).map(
      (p) => p.handle,
    ),
    ["tee"],
  );
});

test("sortProducts orders by price ascending and descending", () => {
  assert.deepEqual(
    sortProducts(products, "price-asc").map((p) => p.handle),
    ["tee", "jersey"],
  );
  assert.deepEqual(
    sortProducts(products, "price-desc").map((p) => p.handle),
    ["jersey", "tee"],
  );
});

test("filters survive a URL round-trip", () => {
  const filters = {
    ...EMPTY_FILTERS,
    categories: ["Jersey"],
    colours: ["Black"],
    sizes: ["M"],
    priceMin: 1000,
    priceMax: 1800,
    inStockOnly: true,
    sort: "price-desc" as const,
  };
  const params = filtersToSearchParams(filters);
  const parsed = parseFilters(params);
  assert.deepEqual(parsed, filters);
});

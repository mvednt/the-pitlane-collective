import type { Product, ProductVariant } from "@/lib/shopify/types";

/** Minimal-but-complete Product factory for unit tests. */
export function makeProduct(overrides: Partial<Product> = {}): Product {
  const price = overrides.priceRange?.minVariantPrice.amount ?? "1499";
  const variant: ProductVariant = {
    id: "v1",
    title: "M / Black",
    availableForSale: true,
    quantityAvailable: 10,
    sku: "SKU-1",
    selectedOptions: [
      { name: "Size", value: "M" },
      { name: "Colour", value: "Black" },
    ],
    price: { amount: price, currencyCode: "INR" },
    compareAtPrice: null,
    image: null,
  };

  return {
    id: "gid://mock/Product/base",
    handle: "base-tee",
    title: "Base Tee",
    description: "A tee.",
    descriptionHtml: "<p>A tee.</p>",
    productType: "Oversized T-Shirt",
    vendor: "The Pitlane Collective",
    tags: [],
    gender: ["men"],
    badge: null,
    availableForSale: true,
    featuredImage: null,
    images: [],
    options: [
      { id: "o1", name: "Size", values: ["S", "M", "L"] },
      { id: "o2", name: "Colour", values: ["Black"] },
    ],
    variants: [variant],
    priceRange: {
      minVariantPrice: { amount: price, currencyCode: "INR" },
      maxVariantPrice: { amount: price, currencyCode: "INR" },
    },
    details: {
      fit: null,
      fabric: null,
      care: null,
      story: null,
      modelInfo: null,
      sizeGuideHref: null,
      launchDate: null,
      limitedEdition: false,
    },
    seo: { title: null, description: null },
    updatedAt: "2026-07-01T00:00:00.000Z",
    ...overrides,
  };
}

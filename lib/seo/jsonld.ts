import { siteConfig } from "@/lib/config/site";
import type { Product } from "@/lib/shopify/types";

/**
 * Typed JSON-LD builders. Everything is generated from real config/product data
 * — no fabricated ratings, review counts, GTINs, shipping, or return terms.
 * Serialization is handled by the <JsonLd> component (escapes `<`).
 */

export type JsonLdObject = Record<string, unknown>;

const url = siteConfig.url.replace(/\/$/, "");

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url,
    description: siteConfig.description,
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.youtube,
      siteConfig.social.x,
    ],
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}

export function productJsonLd(product: Product): JsonLdObject {
  const prices = product.variants.map((v) => Number(v.price.amount));
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const availability = product.availableForSale
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.seo.description ?? product.description,
    productID: product.id,
    category: product.productType || undefined,
    brand: { "@type": "Brand", name: product.vendor || siteConfig.name },
    url: `${url}/products/${product.handle}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: currency,
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: product.variants.length,
      availability,
    },
  };

  if (product.featuredImage) {
    data.image = product.images.map((img) => img.url);
  }

  // Note: no aggregateRating / review — those require real, verified data.
  return data;
}

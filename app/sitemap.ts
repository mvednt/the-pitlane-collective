import type { MetadataRoute } from "next";
import { contentPageSlugs } from "@/lib/content/pages";
import { siteConfig } from "@/lib/config/site";
import { shopify } from "@/lib/shopify";

/**
 * Dynamic sitemap. Works in both mock and live Shopify mode — products and
 * collections come from the same data-source abstraction. Non-indexable routes
 * (cart, account internals, search) are intentionally excluded; those are
 * disallowed in robots.ts.
 *
 * Regeneration: revalidated hourly (ISR). In live mode a product/collection
 * webhook hitting the revalidate route would refresh it on demand.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const [products, collections] = await Promise.all([
    shopify.getProducts(),
    shopify.getCollections(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const collectionEntries: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${base}/collections/${c.handle}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.handle}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const pageEntries: MetadataRoute.Sitemap = contentPageSlugs.map((slug) => ({
    url: `${base}/pages/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticEntries,
    ...collectionEntries,
    ...productEntries,
    ...pageEntries,
  ];
}

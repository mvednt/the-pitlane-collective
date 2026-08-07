import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

/**
 * robots.txt. Storefront content is crawlable; cart, account internals,
 * internal search results, and API routes are disallowed (non-indexable).
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/cart", "/search", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

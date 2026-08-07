import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

/**
 * Builds page Metadata with canonical URL, Open Graph, and Twitter/X card from
 * a small config. Relative `path`/`image` values resolve against
 * `metadataBase` (set in the root layout). Falls back to site defaults when
 * fields are missing.
 */
export function buildMetadata(opts: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const description = opts.description || siteConfig.description;
  const images = opts.image ? [{ url: opts.image }] : undefined;

  return {
    title: opts.title,
    description,
    alternates: { canonical: opts.path },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: opts.title,
      description,
      url: opts.path,
      siteName: siteConfig.name,
      type: opts.type ?? "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description,
      images: opts.image ? [opts.image] : undefined,
    },
  };
}

import Link from "next/link";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchIcon } from "@/components/ui/icons";
import { popularSearches } from "@/lib/config/site";
import { shopify } from "@/lib/shopify";

import { buildMetadata } from "@/lib/seo/metadata";

// Internal search results should not be indexed.
export const metadata = buildMetadata({
  title: "Search",
  description: "Search The Pitlane Collective.",
  path: "/search",
  noindex: true,
});

export default async function SearchPage(props: PageProps<"/search">) {
  const { q } = await props.searchParams;
  const query = (typeof q === "string" ? q : "").trim();
  const products = query ? await shopify.getProducts({ query }) : [];

  return (
    <div>
      <CollectionHeader
        title={query ? `Search: “${query}”` : "Search"}
        count={query ? products.length : undefined}
      />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <form action="/search" className="mb-10 flex max-w-md gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3 focus-within:border-accent">
            <SearchIcon className="h-4 w-4 text-muted" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Try: oversized, jersey, racing red…"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-tpc-black px-4 py-2 text-sm font-semibold text-tpc-cream"
          >
            Search
          </button>
        </form>

        {!query ? (
          <div>
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-muted">
              Popular searches
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted">No results for “{query}”.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground"
                >
                  {term}
                </Link>
              ))}
            </div>
            <Link
              href="/shop"
              className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}

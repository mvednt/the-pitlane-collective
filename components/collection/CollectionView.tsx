"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { CloseIcon } from "@/components/ui/icons";
import { track } from "@/lib/analytics/client";
import {
  activeFilterCount,
  applyFilters,
  computeFacets,
  filtersToSearchParams,
  parseFilters,
  sortProducts,
  type ActiveFilters,
  type SortKey,
} from "@/lib/filters";
import type { Product } from "@/lib/shopify/types";
import { FilterChips } from "./FilterChips";
import { FilterControls } from "./FilterControls";
import { SortSelect } from "./SortSelect";

const PAGE_SIZE = 12;

/** Keys of ActiveFilters that hold string[] and can be toggled. */
type ListFilterKey = "categories" | "genders" | "sizes" | "colours" | "fits";

export function CollectionView({
  products,
  showGender = true,
}: {
  products: Product[];
  showGender?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const facets = useMemo(() => computeFacets(products), [products]);

  const filtered = useMemo(() => {
    return sortProducts(applyFilters(products, filters), filters.sort);
  }, [products, filters]);

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function commit(next: ActiveFilters) {
    const params = filtersToSearchParams(next);
    const query = params.toString();
    setVisibleCount(PAGE_SIZE); // reset pagination on any filter/sort change
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }

  function toggle(key: keyof ActiveFilters, value: string) {
    const listKey = key as ListFilterKey;
    const current = filters[listKey];
    const adding = !current.includes(value);
    const nextList = adding
      ? [...current, value]
      : current.filter((v) => v !== value);
    if (adding) track("filter_applied", { type: listKey, value });
    commit({ ...filters, [listKey]: nextList });
  }

  function setPrice(min: number | null, max: number | null) {
    commit({ ...filters, priceMin: min, priceMax: max });
  }

  function setInStock(value: boolean) {
    commit({ ...filters, inStockOnly: value });
  }

  function setSort(sort: SortKey) {
    track("sort_changed", { sort });
    commit({ ...filters, sort });
  }

  function clearAll() {
    setVisibleCount(PAGE_SIZE);
    startTransition(() => router.push(pathname, { scroll: false }));
  }

  const count = activeFilterCount(filters);
  const visible = filtered.slice(0, visibleCount);

  const controls = (
    <FilterControls
      facets={facets}
      filters={filters}
      showGender={showGender}
      onToggle={toggle}
      onPrice={setPrice}
      onInStock={setInStock}
    />
  );

  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">{controls}</div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 border border-border px-3 py-1.5 text-sm lg:hidden"
            >
              Filters
              {count > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[0.65rem] font-semibold tabular text-accent-contrast">
                  {count}
                </span>
              ) : null}
            </button>
            <p className="whitespace-nowrap text-sm text-muted tabular">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
          </div>
          <SortSelect value={filters.sort} onChange={setSort} />
        </div>

        {/* Active-filter chips */}
        <div className="mb-6">
          <FilterChips
            filters={filters}
            onRemove={toggle}
            onClearPrice={() => setPrice(null, null)}
            onClearInStock={() => setInStock(false)}
            onClearAll={clearAll}
          />
        </div>

        {/* Grid / empty state */}
        {filtered.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center">
            <p className="text-muted">No products match these filters.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-3 text-sm font-medium text-accent underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-2 gap-x-4 gap-y-8 transition-opacity sm:grid-cols-3 ${
                isPending ? "opacity-60" : "opacity-100"
              }`}
            >
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {visibleCount < filtered.length ? (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="border border-tpc-stroke px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:border-tpc-white hover:bg-tpc-white hover:text-tpc-black"
                >
                  Load more
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Mobile filter drawer (bottom sheet) */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-tpc-black/70"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-surface">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
              <h2 className="font-display text-lg tracking-tight">Filters</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <CloseIcon />
              </button>
            </div>
            <div className="px-5 pb-4">{controls}</div>
            <div className="sticky bottom-0 flex gap-3 border-t border-border bg-surface px-5 py-4">
              <button
                type="button"
                onClick={clearAll}
                className="flex-1 border border-border py-3 text-sm font-semibold"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 bg-accent py-3 text-sm font-semibold uppercase tracking-wide text-accent-contrast"
              >
                Show {filtered.length}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

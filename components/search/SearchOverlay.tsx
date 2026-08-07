"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  predictiveSearchAction,
  type PredictiveSearchResponse,
} from "@/app/actions/search";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { track } from "@/lib/analytics/client";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { popularSearches } from "@/lib/config/site";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from "@/lib/recent-searches";
import { formatMoney } from "@/lib/utils";

const EMPTY: PredictiveSearchResponse = { products: [], collections: [] };

type NavItem =
  | { kind: "product"; href: string; label: string }
  | { kind: "collection"; href: string; label: string }
  | { kind: "all"; href: string; label: string };

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PredictiveSearchResponse>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    "idle",
  );
  const [recent, setRecent] = useState<string[]>([]);
  const [highlight, setHighlight] = useState(-1);

  const trimmed = query.trim();
  const showSuggestions = trimmed.length < 2;

  // Build the flat, keyboard-navigable list of result items.
  const navItems: NavItem[] = [];
  if (!showSuggestions) {
    navItems.push({
      kind: "all",
      href: `/search?q=${encodeURIComponent(trimmed)}`,
      label: `See all results for “${trimmed}”`,
    });
    for (const p of results.products) {
      navItems.push({
        kind: "product",
        href: `/products/${p.handle}`,
        label: p.title,
      });
    }
    for (const c of results.collections) {
      navItems.push({
        kind: "collection",
        href: `/collections/${c.handle}`,
        label: c.title,
      });
    }
  }

  const go = useCallback(
    (href: string, term?: string) => {
      if (term) addRecentSearch(term);
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const submitQuery = useCallback(
    (term: string) => {
      const t = term.trim();
      if (!t) return;
      track("search", { query: t });
      go(`/search?q=${encodeURIComponent(t)}`, t);
    },
    [go],
  );

  // Reset + focus when opened. Reads recent searches from localStorage (only
  // available after mount) and resets transient UI on each open.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    setRecent(getRecentSearches());
    setHighlight(-1);
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Debounced predictive search. When the query is too short the render shows
  // suggestions instead, so stale results/status are simply ignored.
  useEffect(() => {
    if (showSuggestions) return;
    // Reflect the in-flight debounced request against the external search
    // backend — a legitimate effect-driven sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    let active = true;
    const id = window.setTimeout(async () => {
      try {
        const res = await predictiveSearchAction(trimmed);
        if (!active) return;
        setResults(res);
        setStatus("done");
        setHighlight(-1);
      } catch {
        if (!active) return;
        setStatus("error");
      }
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, [trimmed, showSuggestions]);

  // Escape + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown" && navItems.length) {
      e.preventDefault();
      setHighlight((h) => (h + 1) % navItems.length);
      return;
    }
    if (e.key === "ArrowUp" && navItems.length) {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? navItems.length - 1 : h - 1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0 && navItems[highlight]) {
        const item = navItems[highlight];
        go(item.href, item.kind === "all" ? trimmed : undefined);
      } else {
        submitQuery(trimmed);
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-tpc-black/50"
      />

      <div
        ref={panelRef}
        onKeyDown={onKeyDown}
        className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-surface shadow-xl"
      >
        <div className="mx-auto max-w-3xl px-5 py-4">
          {/* Input row */}
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <SearchIcon className="h-5 w-5 text-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products and collections…"
              aria-label="Search products and collections"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="text-muted hover:text-foreground"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Suggestions (empty query) */}
          {showSuggestions ? (
            <div className="py-5">
              {recent.length > 0 ? (
                <section className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-muted">
                      Recent
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        clearRecentSearches();
                        setRecent([]);
                      }}
                      className="text-xs text-muted underline underline-offset-2 hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => submitQuery(term)}
                          className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section>
                <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-muted">
                  Popular
                </p>
                <ul className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        onClick={() => submitQuery(term)}
                        className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : (
            <div className="py-4">
              {status === "loading" ? (
                <SearchSkeleton />
              ) : status === "error" ? (
                <p className="py-8 text-center text-sm text-muted">
                  Something went wrong. Try again.
                </p>
              ) : results.products.length === 0 &&
                results.collections.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted">
                    No matches for “{trimmed}”.
                  </p>
                  <button
                    type="button"
                    onClick={() => submitQuery(trimmed)}
                    className="mt-2 text-sm font-medium text-accent underline underline-offset-4"
                  >
                    Search all products
                  </button>
                </div>
              ) : (
                <SearchResults
                  results={results}
                  navItems={navItems}
                  highlight={highlight}
                  onProduct={(href) => go(href, trimmed)}
                  onCollection={(href) => go(href, trimmed)}
                  onAll={() => submitQuery(trimmed)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-3 py-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-14 w-12 animate-pulse rounded bg-black/5" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 animate-pulse rounded bg-black/5" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-black/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchResults({
  results,
  navItems,
  highlight,
  onProduct,
  onCollection,
  onAll,
}: {
  results: PredictiveSearchResponse;
  navItems: NavItem[];
  highlight: number;
  onProduct: (href: string) => void;
  onCollection: (href: string) => void;
  onAll: () => void;
}) {
  const highlightedHref =
    highlight >= 0 ? navItems[highlight]?.href : undefined;

  return (
    <div>
      <button
        type="button"
        onClick={onAll}
        className={`mb-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium ${
          navItems[highlight]?.kind === "all" ? "bg-black/5" : ""
        }`}
      >
        <SearchIcon className="h-4 w-4 text-muted" />
        {navItems[0]?.label}
      </button>

      {results.products.length > 0 ? (
        <section className="mb-4">
          <p className="mb-1 px-2 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-muted">
            Products
          </p>
          <ul>
            {results.products.map((p) => {
              const href = `/products/${p.handle}`;
              return (
                <li key={p.handle}>
                  <button
                    type="button"
                    onClick={() => {
                      track("select_item", {
                        id: p.handle,
                        handle: p.handle,
                        title: p.title,
                      });
                      onProduct(href);
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left ${
                      highlightedHref === href ? "bg-black/5" : "hover:bg-black/5"
                    }`}
                  >
                    <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-tpc-white">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.imageAlt ?? p.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                        {p.productType}
                      </span>
                      <span className="block truncate text-sm font-medium">
                        {p.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm tabular">
                      {formatMoney({
                        amount: p.price,
                        currencyCode: p.currencyCode,
                      })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {results.collections.length > 0 ? (
        <section>
          <p className="mb-1 px-2 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-muted">
            Collections
          </p>
          <ul>
            {results.collections.map((c) => {
              const href = `/collections/${c.handle}`;
              return (
                <li key={c.handle}>
                  <button
                    type="button"
                    onClick={() => onCollection(href)}
                    className={`flex w-full items-center rounded-md px-2 py-2 text-left text-sm ${
                      highlightedHref === href ? "bg-black/5" : "hover:bg-black/5"
                    }`}
                  >
                    {c.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

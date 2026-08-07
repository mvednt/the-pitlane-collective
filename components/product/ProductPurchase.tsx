"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";
import { track } from "@/lib/analytics/client";
import { colourHex } from "@/lib/colours";
import { formatMoney } from "@/lib/utils";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { SizeGuide } from "./SizeGuide";
import { WishlistButton } from "./WishlistButton";

function findVariant(
  variants: ProductVariant[],
  selected: Record<string, string>,
): ProductVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every((o) => selected[o.name] === o.value),
  );
}

function defaultSelection(product: Product): Record<string, string> {
  const firstAvailable =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const selection: Record<string, string> = {};
  for (const option of firstAvailable?.selectedOptions ?? []) {
    selection[option.name] = option.value;
  }
  return selection;
}

function ctaLabel(variant: ProductVariant | undefined, isPending: boolean) {
  if (!variant) return "Select options";
  if (!variant.availableForSale) return "Sold out";
  return isPending ? "Adding…" : "Add to cart";
}

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem, isPending } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    defaultSelection(product),
  );
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const activeVariant = useMemo(
    () => findVariant(product.variants, selected),
    [product.variants, selected],
  );

  // Reveal the sticky mobile bar once the inline CTA scrolls out of view.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function isValueAvailable(optionName: string, value: string): boolean {
    return product.variants.some(
      (variant) =>
        variant.availableForSale &&
        variant.selectedOptions.every((o) =>
          o.name === optionName ? o.value === value : selected[o.name] === o.value,
        ),
    );
  }

  const price = activeVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAtPrice = activeVariant?.compareAtPrice ?? null;
  const canAdd = Boolean(activeVariant?.availableForSale);
  const qty = activeVariant?.quantityAvailable ?? null;
  const lowStock = qty !== null && qty > 0 && qty <= 5;

  // Render selectors only for options with more than one value.
  const visibleOptions = product.options.filter((o) => o.values.length > 1);

  function addCurrent() {
    if (activeVariant) addItem(activeVariant.id, 1);
  }

  function choose(optionName: string, value: string) {
    setSelected((p) => ({ ...p, [optionName]: value }));
    if (optionName.toLowerCase() === "size") {
      track("select_size", { handle: product.handle, size: value });
    } else if (optionName.toLowerCase() === "colour") {
      track("select_colour", { handle: product.handle, colour: value });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-baseline gap-3">
        <p className="text-xl font-semibold tabular">{formatMoney(price)}</p>
        {compareAtPrice ? (
          <p className="text-sm text-muted line-through tabular">
            {formatMoney(compareAtPrice)}
          </p>
        ) : null}
        <span className="text-xs text-muted">Taxes included</span>
      </div>

      {visibleOptions.map((option) => {
        const isColour = option.name.toLowerCase() === "colour";
        return (
          <div key={option.id} className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {option.name}
                {isColour ? (
                  <span className="ml-2 normal-case text-foreground/70">
                    {selected[option.name]}
                  </span>
                ) : null}
              </p>
              {option.name.toLowerCase() === "size" ? (
                <SizeGuide productType={product.productType} />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selected[option.name] === value;
                const available = isValueAvailable(option.name, value);

                // Sold-out combinations stay selectable (marked, not disabled)
                // so a shopper can choose one and use "Notify me when available".
                if (isColour) {
                  return (
                    <button
                      key={value}
                      type="button"
                      title={available ? value : `${value} — sold out in this size`}
                      aria-label={available ? value : `${value}, sold out in this size`}
                      aria-pressed={isSelected}
                      onClick={() =>
                        choose(option.name, value)
                      }
                      className={`relative h-9 w-9 rounded-full ring-1 ring-black/10 transition-transform hover:scale-105 ${
                        isSelected ? "ring-2 ring-offset-2 ring-tpc-black" : ""
                      } ${!available ? "opacity-45" : ""}`}
                      style={{ backgroundColor: colourHex(value) }}
                    />
                  );
                }

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={available ? value : `${value}, sold out`}
                    onClick={() =>
                      choose(option.name, value)
                    }
                    className={`min-w-11 rounded-md border px-3 py-2 text-sm tabular transition-colors ${
                      isSelected
                        ? "border-tpc-black bg-tpc-black text-tpc-cream"
                        : "border-border hover:border-foreground"
                    } ${!available ? "opacity-45 line-through" : ""}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div ref={ctaRef} className="flex gap-3">
        <button
          type="button"
          disabled={!canAdd || isPending}
          onClick={addCurrent}
          className="flex-1 rounded-md bg-tpc-black py-3.5 text-sm font-semibold uppercase tracking-wide text-tpc-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {ctaLabel(activeVariant, isPending)}
        </button>
        <div className="w-32 shrink-0">
          <WishlistButton
            productId={product.id}
            handle={product.handle}
            title={product.title}
            variant="inline"
          />
        </div>
      </div>

      {lowStock ? (
        <p className="mt-2 text-xs text-accent">
          Low stock — {qty} left in this size
        </p>
      ) : null}

      {activeVariant && !activeVariant.availableForSale ? (
        <p className="mt-2 text-xs text-muted">
          This size is sold out. Try another size — limited runs, no restocks
          guaranteed.
        </p>
      ) : null}

      {/* Sticky mobile purchase bar */}
      {showSticky ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.title}</p>
              <p className="text-sm tabular text-muted">{formatMoney(price)}</p>
            </div>
            <button
              type="button"
              disabled={!canAdd || isPending}
              onClick={addCurrent}
              className="shrink-0 rounded-md bg-tpc-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-tpc-cream disabled:opacity-40"
            >
              {ctaLabel(activeVariant, isPending)}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

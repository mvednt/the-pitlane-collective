"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/context/cart-context";
import { track } from "@/lib/analytics/client";
import { reviewSummary, siteConfig } from "@/lib/config/site";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/utils";

export interface ShowcaseTab {
  /** Tab label, e.g. "Oversized Tees". */
  label: string;
  /** Collection page this tab represents. */
  href: string;
  /** The piece put forward for this tab. */
  product: Product;
  /**
   * Campaign shot for the slot, overriding the product's own photo. Point this
   * at a file in /public (or any allowed remote host) when you have shoot
   * imagery for the piece.
   */
  image?: string;
}

const MONO_LABEL = "mono text-[0.75rem] uppercase tracking-[0.18em]";

const SIZE_OPTION = /^sizes?$/i;

function findOption(product: Product, pattern: RegExp) {
  return product.options.find((o) => pattern.test(o.name.trim()));
}

/**
 * Resolves the variant for a selection. Options the panel does not expose
 * (anything that is not size or colour) fall back to their first value, so a
 * three-option product still resolves to a real, addable variant.
 */
function findVariant(
  product: Product,
  selection: Record<string, string>,
): ProductVariant | undefined {
  const wanted: Record<string, string> = {};
  for (const option of product.options) {
    wanted[option.name] = selection[option.name] ?? option.values[0];
  }
  return product.variants.find((variant) =>
    variant.selectedOptions.every((o) => wanted[o.name] === o.value),
  );
}

/** "260gsm heavyweight cotton · Boxy fit" — the spec line under the title. */
function specLine(product: Product): string {
  return [product.details.fabric, product.details.fit]
    .filter(Boolean)
    .join(" · ");
}

/** The all-caps detail run at the foot of the panel. */
function detailLine(product: Product): string {
  return [product.details.fabric, product.details.fit, product.details.care]
    .filter(Boolean)
    .join(" · ");
}

export function FeaturedShowcase({ tabs }: { tabs: ShowcaseTab[] }) {
  const { addItem, isPending } = useCart();
  const [activeTab, setActiveTab] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const tab = tabs[activeTab] ?? tabs[0];
  const product = tab.product;

  const sizeOption = useMemo(() => findOption(product, SIZE_OPTION), [product]);
  const sizes = sizeOption?.values ?? [];

  // Size falls back to the product's own values whenever the tab changes, so a
  // size from a previous product never leaks across. Colour is deliberately not
  // offered here — findVariant settles it on the product's first colourway, and
  // shoppers pick a colour on the product page.
  const activeSize = size && sizes.includes(size) ? size : (sizes[1] ?? sizes[0] ?? null);

  const selection: Record<string, string> = {};
  if (sizeOption && activeSize) selection[sizeOption.name] = activeSize;

  // A tab's campaign shot wins over the product's own photo. Campaign frames
  // are portrait, so they anchor to the top of the slot and keep the model's
  // head in view; packshots stay centred.
  const slotImage = tab.image
    ? { src: tab.image, alt: product.title, position: "object-top" }
    : product.featuredImage
      ? {
          src: product.featuredImage.url,
          alt: product.featuredImage.altText ?? product.title,
          position: "object-center",
        }
      : null;

  const variant = findVariant(product, selection);
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const soldOut = variant ? !variant.availableForSale : !product.availableForSale;

  function selectTab(index: number) {
    setActiveTab(index);
    setSize(null);
    setQty(1);
    setAdded(false);
  }

  function addToBag() {
    if (!variant || soldOut) return;
    addItem(variant.id, qty);
    setAdded(true);
  }

  const ctaLabel = soldOut
    ? "Sold out"
    : isPending
      ? "Adding…"
      : added
        ? "Added to bag"
        : "Add to cart";

  return (
    <>
      {/* Category switcher */}
      <div
        id="shop"
        className="flex scroll-mt-24 flex-wrap items-stretch overflow-hidden border-y border-border bg-surface"
      >
        {tabs.map((t, i) => {
          const on = i === activeTab;
          return (
            <button
              key={t.label}
              type="button"
              aria-pressed={on}
              onClick={() => selectTab(i)}
              className={`mono flex-none cursor-pointer whitespace-nowrap px-8 py-5 text-[0.8rem] font-bold uppercase tracking-[0.18em] transition-colors ${
                on
                  ? "bg-accent text-accent-contrast"
                  : "bg-transparent text-muted hover:text-tpc-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Featured piece */}
      <section
        aria-label="Featured piece"
        className="grid grid-cols-[repeat(auto-fit,minmax(21.25rem,1fr))] bg-tpc-black"
      >
        <div className="relative min-h-[clamp(26rem,52vw,47.5rem)] min-w-0">
          {slotImage ? (
            <Image
              src={slotImage.src}
              alt={slotImage.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-cover ${slotImage.position}`}
            />
          ) : null}
          <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-3">
            {product.badge ? (
              <span className="mono bg-accent px-2.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent-contrast">
                {product.badge}
              </span>
            ) : null}
            <span className="mono bg-tpc-black/80 px-2.5 py-1.5 text-[0.6875rem] uppercase tracking-[0.22em] text-[#c8cbcd]">
              {tab.label}
            </span>
          </div>
        </div>

        <div className="min-w-0 bg-tpc-black p-[clamp(2.125rem,4vw,4.5rem)]">
          <p className="mono text-[0.75rem] font-bold uppercase tracking-[0.24em] text-accent">
            Featured piece
          </p>

          <h2 className="font-display mt-3.5 text-[clamp(2.375rem,4.6vw,4.75rem)] leading-[0.92]">
            <Link
              href={`/products/${product.handle}`}
              className="transition-colors hover:text-accent"
            >
              {product.title}
            </Link>
          </h2>

          {specLine(product) ? (
            <p className={`${MONO_LABEL} mt-3.5 tracking-[0.16em] text-muted`}>
              {specLine(product)}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-baseline gap-4.5">
            <p className="text-[2.75rem] font-bold tracking-[-0.03em] tabular">
              {formatMoney(price)}
            </p>
            <p className={`${MONO_LABEL} tracking-[0.16em] text-muted`}>
              Free shipping over ₹{siteConfig.freeShippingThreshold}
            </p>
          </div>

          <div className={`${MONO_LABEL} mt-5 flex items-center gap-3.5 tracking-[0.14em] text-muted`}>
            <span
              aria-hidden="true"
              className="text-[0.9375rem] tracking-[0.1em] text-[#f5b301]"
            >
              ★★★★★
            </span>
            <span>
              {reviewSummary.rating} · {reviewSummary.count} reviews
            </span>
          </div>

          {sizes.length > 0 ? (
            <>
              <div className={`${MONO_LABEL} mt-9 flex items-baseline justify-between gap-4 text-muted`}>
                <span>
                  Size — <span className="text-tpc-white">{activeSize}</span>
                </span>
                <Link
                  href="/pages/size-guide"
                  className="border-b border-[#35383b] pb-0.5 transition-colors hover:text-tpc-white"
                >
                  Size guide
                </Link>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                {sizes.map((value) => {
                  const on = value === activeSize;
                  // Availability for this size in the colour currently chosen.
                  const candidate = findVariant(product, {
                    ...selection,
                    ...(sizeOption ? { [sizeOption.name]: value } : {}),
                  });
                  const available = candidate?.availableForSale ?? false;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      aria-label={available ? value : `${value}, sold out`}
                      onClick={() => {
                        setSize(value);
                        setAdded(false);
                        track("select_size", {
                          handle: product.handle,
                          size: value,
                        });
                      }}
                      className={`mono h-[52px] min-w-[66px] cursor-pointer bg-transparent text-[0.8rem] tracking-[0.12em] tabular ${
                        on
                          ? "border border-tpc-white text-tpc-white"
                          : "border border-tpc-stroke text-muted hover:text-tpc-white"
                      } ${available ? "" : "line-through opacity-45"}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-3">
            <div className="flex flex-none items-center border border-tpc-stroke">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => {
                  setQty((q) => Math.max(1, q - 1));
                  setAdded(false);
                }}
                className="h-[60px] w-[52px] cursor-pointer border-none bg-transparent text-[1.375rem] leading-none text-tpc-white hover:bg-tpc-graphite"
              >
                −
              </button>
              <span className="mono min-w-[46px] text-center text-base tabular text-tpc-white">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => {
                  setQty((q) => Math.min(9, q + 1));
                  setAdded(false);
                }}
                className="h-[60px] w-[52px] cursor-pointer border-none bg-transparent text-[1.375rem] leading-none text-tpc-white hover:bg-tpc-graphite"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={addToBag}
              disabled={soldOut || isPending || !variant}
              className="mono inline-flex h-[60px] min-w-0 flex-[1_1_15rem] cursor-pointer items-center justify-center gap-3.5 border-none bg-accent px-7 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-accent-contrast transition-colors hover:bg-tpc-white hover:text-tpc-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent disabled:hover:text-accent-contrast"
            >
              {ctaLabel}
            </button>
          </div>

          {detailLine(product) ? (
            <p className="mono mt-7 text-[0.75rem] uppercase leading-[1.9] tracking-[0.12em] text-tpc-dim">
              {detailLine(product)}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}

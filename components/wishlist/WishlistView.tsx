"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProductsByHandlesAction } from "@/app/actions/wishlist";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";

export function WishlistView() {
  const { items, hydrated, remove } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleKey = items.map((i) => i.handle).join(",");

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    // Fetch fresh product data for the wishlisted handles from the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const handles = handleKey ? handleKey.split(",") : [];
    getProductsByHandlesAction(handles)
      .then((res) => {
        if (active) setProducts(res);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [handleKey, hydrated]);

  if (!hydrated || loading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse rounded-lg bg-black/5" />
            <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-black/5" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-20 text-center">
        <p className="text-muted">Your wishlist is empty.</p>
        <Link
          href="/shop"
          className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const variant =
          product.variants.find((v) => v.availableForSale) ?? null;

        return (
          <div key={product.id}>
            <Link
              href={`/products/${product.handle}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-tpc-white">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText ?? product.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
                {!product.availableForSale ? (
                  <span className="absolute inset-x-0 bottom-0 bg-tpc-black/85 py-1.5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-tpc-cream">
                    Sold out
                  </span>
                ) : null}
              </div>
              <div className="mt-3">
                <p className="text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                  {product.productType}
                </p>
                <div className="mt-0.5 flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-medium">{product.title}</h3>
                  <span className="text-sm font-semibold tabular">
                    {formatMoney(product.priceRange.minVariantPrice)}
                  </span>
                </div>
              </div>
            </Link>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={!variant}
                onClick={() => {
                  if (!variant) return;
                  addItem(variant.id, 1);
                  remove(product.handle);
                }}
                className="flex-1 rounded-md bg-tpc-black py-2 text-xs font-semibold uppercase tracking-wide text-tpc-cream disabled:opacity-40"
              >
                {variant ? "Move to cart" : "Sold out"}
              </button>
              <button
                type="button"
                onClick={() => remove(product.handle)}
                className="rounded-md border border-border px-3 py-2 text-xs hover:border-foreground"
                aria-label={`Remove ${product.title} from wishlist`}
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  addRecent,
  getRecent,
  type RecentProduct,
} from "@/lib/recently-viewed";
import { formatMoney } from "@/lib/utils";

/**
 * Records the current product as recently-viewed and renders a rail of the
 * others. Rendered from localStorage so it needs no extra data fetch.
 */
export function RecentlyViewed({ current }: { current: RecentProduct }) {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    // localStorage is an external system only available after mount, so this
    // read + record legitimately runs in an effect.
    addRecent(current);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getRecent().filter((p) => p.handle !== current.handle));
  }, [current]);

  if (items.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="mb-6 font-display text-2xl tracking-tight sm:text-3xl">
        Recently viewed
      </h2>
      <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.handle}
            href={`/products/${item.handle}`}
            className="group w-40 shrink-0 snap-start sm:w-52"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-tpc-panel">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="208px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : null}
            </div>
            <div className="mt-3">
              <p className="text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                {item.productType}
              </p>
              <p className="mt-0.5 text-sm font-medium">{item.title}</p>
              <p className="text-sm tabular text-muted">
                {formatMoney({ amount: item.price, currencyCode: item.currencyCode })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as ProductImage } from "@/lib/shopify/types";
import { useProductMedia } from "./ProductMediaContext";

export function Gallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [activeUrl, setActiveUrl] = useState<string | null>(
    images[0]?.url ?? null,
  );

  // Follow the purchase column's variant selection: when the shopper switches
  // colour, jump to that variant's image (if we're showing it). Handled by
  // adjusting state during render — the "storing info from previous renders"
  // pattern — rather than an effect, so the gallery never paints a stale frame.
  const media = useProductMedia();
  const [seenColourUrl, setSeenColourUrl] = useState(media?.activeImageUrl);
  if (media?.activeImageUrl !== seenColourUrl) {
    setSeenColourUrl(media?.activeImageUrl);
    if (media?.activeImageUrl && images.some((i) => i.url === media.activeImageUrl)) {
      setActiveUrl(media.activeImageUrl);
    }
  }

  const active =
    images.find((i) => i.url === activeUrl) ?? images[0] ?? null;

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-tpc-panel ">
        {active ? (
          <Image
            src={active.url}
            alt={active.altText ?? title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((image) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveUrl(image.url)}
              className={`relative aspect-square overflow-hidden border ${
                image.url === active?.url
                  ? "border-tpc-white"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

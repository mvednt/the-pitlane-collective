"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as ProductImage } from "@/lib/shopify/types";

export function Gallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? null;

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-tpc-white ">
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
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md border ${
                index === activeIndex
                  ? "border-tpc-black"
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

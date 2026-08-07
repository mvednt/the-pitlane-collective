"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/utils";
import type { CartLine } from "@/lib/shopify/types";

export function CartLineItem({ line }: { line: CartLine }) {
  const { updateItem, removeItem, isPending } = useCart();

  const size = line.merchandise.selectedOptions.find(
    (o) => o.name.toLowerCase() === "size",
  )?.value;
  const colour = line.merchandise.selectedOptions.find(
    (o) => o.name.toLowerCase() === "colour",
  )?.value;

  const max = line.merchandise.quantityAvailable;
  const atMax = max !== null && line.quantity >= max;

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={`/products/${line.merchandise.product.handle}`}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-tpc-white"
      >
        {line.merchandise.image ? (
          <Image
            src={line.merchandise.image.url}
            alt={line.merchandise.image.altText ?? line.merchandise.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${line.merchandise.product.handle}`}
              className="text-sm font-medium hover:text-accent"
            >
              {line.merchandise.product.title}
            </Link>
            <button
              type="button"
              disabled={isPending}
              onClick={() => removeItem(line.id)}
              className="shrink-0 text-xs text-muted underline underline-offset-2 hover:text-foreground disabled:opacity-40"
            >
              Remove
            </button>
          </div>
          <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted">
            {size ? <span>Size: {size}</span> : null}
            {colour ? <span>Colour: {colour}</span> : null}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-md border border-border">
            <button
              type="button"
              disabled={isPending}
              onClick={() => updateItem(line.id, line.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-sm disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-7 text-center text-sm tabular">{line.quantity}</span>
            <button
              type="button"
              disabled={isPending || atMax}
              onClick={() => updateItem(line.id, line.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-sm disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="text-sm font-medium tabular">
            {formatMoney(line.cost.totalAmount)}
          </p>
        </div>

        {atMax ? (
          <p className="mt-1 text-[0.7rem] text-muted">Max available reached</p>
        ) : null}
      </div>
    </li>
  );
}

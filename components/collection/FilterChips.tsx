"use client";

import { genderLabel, type ActiveFilters } from "@/lib/filters";
import { formatMoney } from "@/lib/utils";

interface Chip {
  key: keyof ActiveFilters;
  value: string;
  label: string;
}

export function FilterChips({
  filters,
  onRemove,
  onClearPrice,
  onClearInStock,
  onClearAll,
}: {
  filters: ActiveFilters;
  onRemove: (key: keyof ActiveFilters, value: string) => void;
  onClearPrice: () => void;
  onClearInStock: () => void;
  onClearAll: () => void;
}) {
  const chips: Chip[] = [
    ...filters.categories.map((v) => ({ key: "categories" as const, value: v, label: v })),
    ...filters.genders.map((v) => ({ key: "genders" as const, value: v, label: genderLabel(v) })),
    ...filters.fits.map((v) => ({ key: "fits" as const, value: v, label: v })),
    ...filters.sizes.map((v) => ({ key: "sizes" as const, value: v, label: `Size ${v}` })),
    ...filters.colours.map((v) => ({ key: "colours" as const, value: v, label: v })),
  ];

  const hasPrice = filters.priceMin !== null || filters.priceMax !== null;
  const anyActive = chips.length > 0 || hasPrice || filters.inStockOnly;

  if (!anyActive) return null;

  const priceLabel = hasPrice
    ? `${filters.priceMin !== null ? formatMoney({ amount: String(filters.priceMin), currencyCode: "INR" }) : "Min"} – ${filters.priceMax !== null ? formatMoney({ amount: String(filters.priceMax), currencyCode: "INR" }) : "Max"}`
    : "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          type="button"
          onClick={() => onRemove(chip.key, chip.value)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs hover:border-foreground"
        >
          {chip.label}
          <span aria-hidden="true" className="text-muted">×</span>
          <span className="sr-only">Remove filter</span>
        </button>
      ))}

      {hasPrice ? (
        <button
          type="button"
          onClick={onClearPrice}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs hover:border-foreground"
        >
          {priceLabel}
          <span aria-hidden="true" className="text-muted">×</span>
        </button>
      ) : null}

      {filters.inStockOnly ? (
        <button
          type="button"
          onClick={onClearInStock}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs hover:border-foreground"
        >
          In stock
          <span aria-hidden="true" className="text-muted">×</span>
        </button>
      ) : null}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-accent underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}

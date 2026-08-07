"use client";

import { colourHex } from "@/lib/colours";
import {
  genderLabel,
  type ActiveFilters,
  type Facets,
} from "@/lib/filters";
import { cn } from "@/lib/utils";

interface Props {
  facets: Facets;
  filters: ActiveFilters;
  showGender: boolean;
  onToggle: (key: keyof ActiveFilters, value: string) => void;
  onPrice: (min: number | null, max: number | null) => void;
  onInStock: (value: boolean) => void;
}

function FilterGroup({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border py-5">
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-muted">
        {heading}
      </p>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  swatch,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  swatch?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-accent"
      />
      {swatch ? (
        <span
          className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: swatch }}
          aria-hidden="true"
        />
      ) : null}
      <span className={cn(checked && "font-medium")}>{label}</span>
    </label>
  );
}

export function FilterControls({
  facets,
  filters,
  showGender,
  onToggle,
  onPrice,
  onInStock,
}: Props) {
  const [rangeMin, rangeMax] = facets.priceRange;

  return (
    <div>
      {facets.categories.length > 1 ? (
        <FilterGroup heading="Category">
          {facets.categories.map((c) => (
            <CheckRow
              key={c}
              label={c}
              checked={filters.categories.includes(c)}
              onChange={() => onToggle("categories", c)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {showGender && facets.genders.length > 1 ? (
        <FilterGroup heading="Gender">
          {facets.genders.map((g) => (
            <CheckRow
              key={g}
              label={genderLabel(g)}
              checked={filters.genders.includes(g)}
              onChange={() => onToggle("genders", g)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {facets.fits.length > 1 ? (
        <FilterGroup heading="Fit">
          {facets.fits.map((f) => (
            <CheckRow
              key={f}
              label={f}
              checked={filters.fits.includes(f)}
              onChange={() => onToggle("fits", f)}
            />
          ))}
        </FilterGroup>
      ) : null}

      {facets.sizes.length > 1 ? (
        <FilterGroup heading="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const active = filters.sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onToggle("sizes", s)}
                  className={cn(
                    "min-w-10 rounded-md border px-2.5 py-1.5 text-xs tabular transition-colors",
                    active
                      ? "border-tpc-black bg-tpc-black text-tpc-cream"
                      : "border-border hover:border-foreground",
                  )}
                  aria-pressed={active}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      ) : null}

      {facets.colours.length > 1 ? (
        <FilterGroup heading="Colour">
          {facets.colours.map((c) => (
            <CheckRow
              key={c}
              label={c}
              checked={filters.colours.includes(c)}
              onChange={() => onToggle("colours", c)}
              swatch={colourHex(c)}
            />
          ))}
        </FilterGroup>
      ) : null}

      <FilterGroup heading="Price">
        <div className="flex items-center gap-2 text-sm">
          <input
            type="number"
            inputMode="numeric"
            min={rangeMin}
            max={rangeMax}
            placeholder={`₹${rangeMin}`}
            value={filters.priceMin ?? ""}
            onChange={(e) =>
              onPrice(e.target.value ? Number(e.target.value) : null, filters.priceMax)
            }
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 tabular outline-none focus:border-accent"
            aria-label="Minimum price"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={rangeMin}
            max={rangeMax}
            placeholder={`₹${rangeMax}`}
            value={filters.priceMax ?? ""}
            onChange={(e) =>
              onPrice(filters.priceMin, e.target.value ? Number(e.target.value) : null)
            }
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 tabular outline-none focus:border-accent"
            aria-label="Maximum price"
          />
        </div>
      </FilterGroup>

      <FilterGroup heading="Availability">
        <CheckRow
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={() => onInStock(!filters.inStockOnly)}
        />
      </FilterGroup>
    </div>
  );
}

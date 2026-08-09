"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";

/**
 * Size-guide modal. Charts are placeholder measurements (cm) grouped by
 * category. In live mode these map to a Shopify page / metaobject rather than
 * this static table — final measurements pending confirmation.
 */

type Chart = {
  category: string;
  columns: string[];
  rows: Array<[string, ...string[]]>;
};

const CHARTS: Chart[] = [
  {
    category: "Oversized T-Shirt",
    columns: ["Size", "Chest (in)", "Length (in)"],
    rows: [
      ["S", "42", "27"],
      ["M", "44", "28"],
      ["L", "46", "29"],
      ["XL", "48", "30"],
      ["XXL", "50", "31"],
    ],
  },
  {
    category: "Baby Tee",
    columns: ["Size", "Chest (in)", "Length (in)"],
    rows: [
      ["XS", "30", "16"],
      ["S", "32", "16.5"],
      ["M", "34", "17"],
      ["L", "36", "17.5"],
    ],
  },
  {
    category: "Jersey",
    columns: ["Size", "Chest (in)", "Length (in)"],
    rows: [
      ["S", "40", "27"],
      ["M", "42", "28"],
      ["L", "44", "29"],
      ["XL", "46", "30"],
      ["XXL", "48", "31"],
    ],
  },
];

export function SizeGuide({ productType }: { productType: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useFocusTrap<HTMLDivElement>(open);
  const [active, setActive] = useState(
    () => CHARTS.find((c) => c.category === productType)?.category ?? CHARTS[0].category,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const chart = CHARTS.find((c) => c.category === active) ?? CHARTS[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-accent underline underline-offset-4"
      >
        Size guide
      </button>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Size guide">
          <button
            type="button"
            aria-label="Close size guide"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-tpc-black/70"
          />
          <div
            ref={panelRef}
            className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-surface shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-lg tracking-tight">Size Guide</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close size guide">
                <CloseIcon />
              </button>
            </div>

            <div className="flex gap-2 px-5 pt-4">
              {CHARTS.map((c) => (
                <button
                  key={c.category}
                  type="button"
                  onClick={() => setActive(c.category)}
                  className={` px-3 py-1.5 text-xs font-medium transition-colors ${
                    active === c.category
                      ? "bg-accent text-accent-contrast"
                      : "border border-border hover:border-foreground"
                  }`}
                >
                  {c.category}
                </button>
              ))}
            </div>

            <div className="p-5">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {chart.columns.map((col) => (
                      <th
                        key={col}
                        className="py-2 text-xs font-semibold uppercase tracking-wide text-muted"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((row) => (
                    <tr key={row[0]} className="border-b border-border/60">
                      {row.map((cell, i) => (
                        <td key={i} className={`py-2.5 tabular ${i === 0 ? "font-medium" : "text-foreground/70"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-muted">
                Measurements are approximate and provided as a guide. Final size
                charts pending confirmation.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

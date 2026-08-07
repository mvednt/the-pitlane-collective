import type { ProductBadge } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

const STYLES: Record<ProductBadge, string> = {
  New: "bg-tpc-black text-tpc-cream",
  Bestseller: "bg-tpc-black text-tpc-cream",
  Limited: "bg-accent text-accent-contrast",
  "Low Stock": "bg-tpc-cream text-tpc-black ring-1 ring-tpc-black/15",
};

export function Badge({
  badge,
  className,
}: {
  badge: ProductBadge;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em]",
        STYLES[badge],
        className,
      )}
    >
      {badge}
    </span>
  );
}

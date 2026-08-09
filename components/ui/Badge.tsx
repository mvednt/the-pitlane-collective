import type { ProductBadge } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

const STYLES: Record<ProductBadge, string> = {
  New: "bg-accent text-accent-contrast",
  Bestseller: "bg-tpc-white text-tpc-black",
  Limited: "bg-accent text-accent-contrast",
  "Low Stock": "bg-transparent text-tpc-white ring-1 ring-tpc-white/40",
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
        "inline-flex items-center px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em]",
        STYLES[badge],
        className,
      )}
    >
      {badge}
    </span>
  );
}

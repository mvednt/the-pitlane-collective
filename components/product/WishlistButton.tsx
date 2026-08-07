"use client";

import { useWishlist } from "@/context/wishlist-context";
import { HeartIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Toggles a product in the wishlist. Two visual variants:
 * - "overlay": circular button for product-card corners
 * - "inline": bordered pill for the product page
 * State updates immediately (optimistic, localStorage-backed).
 */
export function WishlistButton({
  productId,
  handle,
  title,
  variant = "overlay",
}: {
  productId: string;
  handle: string;
  title: string;
  variant?: "overlay" | "inline";
}) {
  const { has, toggle, hydrated } = useWishlist();
  const saved = hydrated && has(handle);

  function onClick(e: React.MouseEvent) {
    // Product cards wrap the button in a link — don't navigate on toggle.
    e.preventDefault();
    e.stopPropagation();
    toggle({ productId, handle });
  }

  const label = saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`;

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={label}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-md border py-3 text-sm font-semibold transition-colors",
          saved
            ? "border-accent text-accent"
            : "border-border hover:border-foreground",
        )}
      >
        <HeartIcon className="h-4 w-4" filled={saved} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 backdrop-blur transition-colors hover:bg-surface",
        saved ? "text-accent" : "text-foreground",
      )}
    >
      <HeartIcon className="h-4 w-4" filled={saved} />
    </button>
  );
}

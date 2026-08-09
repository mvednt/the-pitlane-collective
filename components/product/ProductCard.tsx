import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/product/WishlistButton";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";

export function ProductCard({ product }: { product: Product }) {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const hasRange = minVariantPrice.amount !== maxVariantPrice.amount;
  const compareAt = product.variants.find((v) => v.compareAtPrice)?.compareAtPrice;
  const secondaryImage = product.images[1] ?? null;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-tpc-panel">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
        ) : null}
        {secondaryImage ? (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : null}

        {product.badge ? (
          <span className="absolute left-3 top-3">
            <Badge badge={product.badge} />
          </span>
        ) : null}
        {/* Always visible on touch; on pointer devices it fades in on hover. */}
        <span className="absolute right-2 top-2 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <WishlistButton
            productId={product.id}
            handle={product.handle}
            title={product.title}
          />
        </span>
        {!product.availableForSale ? (
          <span className="absolute inset-x-0 bottom-0 bg-tpc-black/85 py-1.5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-tpc-cream">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
          {product.productType}
        </p>
        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium">{product.title}</h3>
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            {compareAt ? (
              <span className="text-xs text-muted line-through tabular">
                {formatMoney(compareAt)}
              </span>
            ) : null}
            <span className="text-sm font-semibold tabular">
              {hasRange ? "From " : ""}
              {formatMoney(minVariantPrice)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { shopify } from "@/lib/shopify";
import { FeaturedShowcase, type ShowcaseTab } from "./FeaturedShowcase";

/**
 * Category strip + featured piece (design file, "#shop").
 *
 * The design's four tabs each put one piece forward; this fetches the pick for
 * every tab up front so switching tabs is instant and needs no round trip.
 * Tabs whose pick is missing are dropped rather than rendered blank.
 *
 * Set `productHandle` to pin a specific piece to a tab. Otherwise the pick is
 * the best seller in `collectionHandle` — or across the whole catalogue when
 * that is undefined, so the tab works with or without the collection existing.
 */
const CATEGORIES: Array<{
  label: string;
  href: string;
  collectionHandle?: string;
  productHandle?: string;
  /** Campaign shot for the slot, in place of the product's own photo. */
  image?: string;
}> = [
  {
    label: "All",
    href: "/shop",
    productHandle: "oversized-tee-22",
    image: "/campaign/ferrari-wordmark-tee-model.jpg",
  },
  { label: "Oversized Tees", href: "/collections/oversized", collectionHandle: "oversized" },
  { label: "Baby Tees", href: "/collections/baby-tees", collectionHandle: "baby-tees" },
  { label: "Jerseys", href: "/collections/jerseys", collectionHandle: "jerseys" },
];

export async function ShopShowcase() {
  const results = await Promise.all(
    CATEGORIES.map(async (category) => {
      if (category.productHandle) {
        return shopify.getProduct(category.productHandle);
      }
      const [product] = await shopify.getProducts({
        collectionHandle: category.collectionHandle,
        first: 1,
        sortKey: "BEST_SELLING",
      });
      return product ?? null;
    }),
  );

  const tabs: ShowcaseTab[] = CATEGORIES.flatMap((category, i) => {
    const product = results[i];
    return product
      ? [
          {
            label: category.label,
            href: category.href,
            product,
            image: category.image,
          },
        ]
      : [];
  });

  if (tabs.length === 0) return null;

  return <FeaturedShowcase tabs={tabs} />;
}

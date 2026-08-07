import { Suspense } from "react";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { shopify } from "@/lib/shopify";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Shop All",
  description:
    "Every piece from The Pitlane Collective — oversized tees, baby tees and jerseys.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await shopify.getProducts();

  return (
    <div>
      <CollectionHeader
        title="Shop All"
        description="Every piece from the collection. Built for race weekends, made for every other day."
        count={products.length}
      />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Suspense>
          <CollectionView products={products} />
        </Suspense>
      </div>
    </div>
  );
}

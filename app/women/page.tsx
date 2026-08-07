import { Suspense } from "react";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { shopify } from "@/lib/shopify";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Women",
  description:
    "Women's motorsport-inspired apparel — baby tees, oversized fits and jerseys.",
  path: "/women",
});

export default async function WomenPage() {
  const products = await shopify.getProducts({ gender: "women" });

  return (
    <div>
      <CollectionHeader
        title="Women"
        description="Baby tees, oversized fits and jerseys for the everyday rotation."
        count={products.length}
      />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Suspense>
          <CollectionView products={products} showGender={false} />
        </Suspense>
      </div>
    </div>
  );
}

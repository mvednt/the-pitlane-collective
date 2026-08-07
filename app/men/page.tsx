import { Suspense } from "react";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { shopify } from "@/lib/shopify";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Men",
  description: "Men's motorsport-inspired apparel — oversized tees and jerseys.",
  path: "/men",
});

export default async function MenPage() {
  const products = await shopify.getProducts({ gender: "men" });

  return (
    <div>
      <CollectionHeader
        title="Men"
        description="Oversized tees and jerseys, built for the everyday rotation."
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

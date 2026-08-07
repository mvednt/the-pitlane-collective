import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { JsonLd } from "@/components/seo/JsonLd";
import { shopify } from "@/lib/shopify";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(
  props: PageProps<"/collections/[handle]">,
): Promise<Metadata> {
  const { handle } = await props.params;
  const collection = await shopify.getCollection(handle);
  if (!collection) return {};

  return buildMetadata({
    title: collection.seo.title ?? collection.title,
    description: collection.seo.description ?? collection.description,
    path: `/collections/${handle}`,
    image: collection.image?.url,
  });
}

export default async function CollectionPage(
  props: PageProps<"/collections/[handle]">,
) {
  const { handle } = await props.params;
  const collection = await shopify.getCollection(handle);
  if (!collection) notFound();

  const products = await shopify.getProducts({ collectionHandle: handle });

  return (
    <div>
      <TrackEvent
        event={{
          name: "view_collection",
          params: { handle, title: collection.title },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: collection.title, path: `/collections/${handle}` },
        ])}
      />
      <CollectionHeader
        title={collection.title}
        description={collection.description}
        count={products.length}
        breadcrumb={[{ label: "Shop", href: "/shop" }]}
      />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Suspense>
          <CollectionView products={products} />
        </Suspense>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { Collection, Product } from "@/lib/shopify/types";

export function FeaturedDrop({
  collection,
  products,
}: {
  collection: Collection | null;
  products: Product[];
}) {
  if (!collection) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-tpc-black">
          {collection.image ? (
            <Image
              src={collection.image.url}
              alt={collection.title}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="section-label">
            <span className="text-accent">03</span>{" "}
            <span aria-hidden="true">/</span> Featured drop
          </p>
          <h2 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
            {collection.title}
          </h2>
          <p className="mt-3 max-w-md text-muted">{collection.description}</p>
          <Link
            href={`/collections/${collection.handle}`}
            className="mt-6 inline-block rounded-md bg-tpc-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-tpc-cream transition-opacity hover:opacity-90"
          >
            Shop the collection
          </Link>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

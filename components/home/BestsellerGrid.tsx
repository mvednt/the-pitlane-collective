import { SectionHeader } from "@/components/home/SectionHeader";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/shopify/types";

export function BestsellerGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeader
        index="02"
        eyebrow="Best sellers"
        title="Pole Position Picks"
        viewAllHref="/collections/bestsellers"
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

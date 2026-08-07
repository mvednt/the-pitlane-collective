import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/shopify/types";

/** Horizontally scrolling product rail (related, complete-the-look, etc.). */
export function ProductRail({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="mb-6 font-display text-2xl tracking-tight sm:text-3xl">
        {title}
      </h2>
      <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-40 shrink-0 snap-start sm:w-52"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

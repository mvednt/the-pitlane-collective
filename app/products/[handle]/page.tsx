import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { Gallery } from "@/components/product/Gallery";
import { ProductAccordions } from "@/components/product/ProductAccordions";
import { ProductMediaProvider } from "@/components/product/ProductMediaContext";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductRail } from "@/components/product/ProductRail";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { toRecent } from "@/lib/recently-viewed";
import { shopify } from "@/lib/shopify";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(
  props: PageProps<"/products/[handle]">,
): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await shopify.getProduct(handle);
  if (!product) return {};

  return buildMetadata({
    title: product.seo.title ?? product.title,
    description: product.seo.description ?? product.description,
    path: `/products/${handle}`,
    image: product.featuredImage?.url,
    type: "website",
  });
}

export default async function ProductPage(
  props: PageProps<"/products/[handle]">,
) {
  const { handle } = await props.params;
  const product = await shopify.getProduct(handle);
  if (!product) notFound();

  const related = await shopify.getRelatedProducts(handle, 6);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 pb-28 md:pb-16">
      <TrackEvent
        event={{
          name: "view_item",
          params: {
            id: product.id,
            handle: product.handle,
            title: product.title,
            price: Number(product.priceRange.minVariantPrice.amount),
            currency: product.priceRange.minVariantPrice.currencyCode,
            category: product.productType,
          },
        }}
      />
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.title, path: `/products/${handle}` },
          ]),
        ]}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-accent">Home</Link>
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            <Link href="/shop" className="hover:text-accent">Shop</Link>
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{product.title}</span>
          </li>
        </ol>
      </nav>

      <ProductMediaProvider>
        <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="md:sticky md:top-24 md:self-start">
            <Gallery images={product.images} title={product.title} />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {product.productType}
              </p>
              {product.badge ? <Badge badge={product.badge} /> : null}
            </div>
            <h1 className="mb-6 font-display text-3xl tracking-tight sm:text-4xl">
              {product.title}
            </h1>

            <ProductPurchase product={product} />
            <ProductAccordions product={product} />
          </div>
        </div>
      </ProductMediaProvider>

      <ProductRail title="You might also like" products={related} />
      <RecentlyViewed current={toRecent(product)} />
    </div>
  );
}

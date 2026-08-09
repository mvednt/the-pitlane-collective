import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { getCart } from "@/app/actions/cart";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ConsentGate } from "@/components/consent/ConsentGate";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { CartProvider } from "@/context/cart-context";
import { ConsentProvider } from "@/context/consent-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { siteConfig } from "@/lib/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

/**
 * Type is set in the system Helvetica/Arial stack with a system monospace for
 * technical labels, matching the design file — no webfonts to download.
 */

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cart = await getCart();

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <ConsentProvider>
          <CartProvider initialCart={cart}>
            <WishlistProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <ConsentGate />
              <Suspense fallback={null}>
                <AnalyticsProvider />
              </Suspense>
            </WishlistProvider>
          </CartProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}

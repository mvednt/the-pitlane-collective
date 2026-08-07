import type { Metadata } from "next";
import { Anton, JetBrains_Mono, Space_Grotesk } from "next/font/google";
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

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      lang="en"
      className={`${anton.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
    >
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

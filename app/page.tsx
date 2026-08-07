import { TrackEvent } from "@/components/analytics/TrackEvent";
import { BestsellerGrid } from "@/components/home/BestsellerGrid";
import { BrandStatement } from "@/components/home/BrandStatement";
import { CategoryEditorial } from "@/components/home/CategoryEditorial";
import { FeaturedDrop } from "@/components/home/FeaturedDrop";
import { GenderNav } from "@/components/home/GenderNav";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { SocialProof } from "@/components/home/SocialProof";
import { StatBand } from "@/components/home/StatBand";
import { shopify } from "@/lib/shopify";

export default async function HomePage() {
  const [newDrop, newDropProducts, bestsellers] = await Promise.all([
    shopify.getCollection("new-drop"),
    shopify.getProducts({ collectionHandle: "new-drop", first: 4 }),
    shopify.getProducts({ collectionHandle: "bestsellers", first: 8 }),
  ]);

  return (
    <>
      <TrackEvent event={{ name: "view_home", params: {} }} />
      <Hero />
      <Marquee />
      <CategoryEditorial />
      <FeaturedDrop collection={newDrop} products={newDropProducts} />
      <BestsellerGrid products={bestsellers} />
      <StatBand />
      <GenderNav />
      <BrandStatement />
      <SocialProof />
      <NewsletterSection />
    </>
  );
}

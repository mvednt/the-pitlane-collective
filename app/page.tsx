import { TrackEvent } from "@/components/analytics/TrackEvent";
import { Hero } from "@/components/home/Hero";
import { Lookbook } from "@/components/home/Lookbook";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ShopShowcase } from "@/components/home/ShopShowcase";
import { StorySection } from "@/components/home/StorySection";

export default function HomePage() {
  return (
    <>
      <TrackEvent event={{ name: "view_home", params: {} }} />
      <Hero />
      <ShopShowcase />
      <Lookbook />
      <StorySection />
      <NewsletterSection />
    </>
  );
}

import { newsletter } from "@/lib/config/site";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          {newsletter.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-tpc-cream/70">
          {newsletter.body}
        </p>
        <div className="mt-8 flex justify-center">
          <NewsletterForm variant="onDark" />
        </div>
      </div>
    </section>
  );
}

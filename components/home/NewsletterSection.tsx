import { Reveal } from "@/components/ui/Reveal";
import { newsletter } from "@/lib/config/site";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <Reveal
      as="section"
      className="gutter flex flex-wrap items-center justify-between gap-10 border-t border-border bg-surface py-[clamp(3rem,6vw,6rem)]"
    >
      <div className="min-w-0 flex-[1_1_23.75rem]">
        <h2 className="font-display m-0 text-[clamp(2rem,3.6vw,3.625rem)] leading-[0.96]">
          {newsletter.heading}
          <br />
          <span className="text-accent">{newsletter.headingAccent}</span>
        </h2>
        <p className="mt-5 text-[1.0625rem] leading-[1.55] text-muted">
          {newsletter.body}
        </p>
      </div>

      <div className="min-w-0 flex-[1_1_26.25rem]">
        <NewsletterForm />
      </div>
    </Reveal>
  );
}

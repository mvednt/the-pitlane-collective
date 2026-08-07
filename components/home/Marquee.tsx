import { ticker } from "@/lib/config/site";

/**
 * Infinite ticker marquee (timing-screen aesthetic). Two identical tracks scroll
 * left; the second seamlessly follows the first. Pauses under
 * prefers-reduced-motion (global rule), leaving static, readable text.
 */
export function Marquee() {
  const items = [...ticker, ...ticker];

  return (
    <div
      aria-hidden="true"
      className="section-dark overflow-hidden border-y border-tpc-cream/10 py-3"
    >
      <div className="flex w-max">
        {[0, 1].map((track) => (
          <div key={track} className="marquee-track">
            {items.map((item, i) => (
              <span
                key={`${track}-${i}`}
                className="mono flex items-center whitespace-nowrap text-[0.7rem] uppercase tracking-[0.18em] text-tpc-cream/80"
              >
                <span className="px-6">{item}</span>
                <span className="text-accent">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

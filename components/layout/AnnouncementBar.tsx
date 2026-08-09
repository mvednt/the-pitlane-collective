import { announcements } from "@/lib/config/site";

/**
 * Red announcement ticker (design file, top band). Two identical tracks scroll
 * left so the loop is seamless; the animation pauses under
 * prefers-reduced-motion, leaving static, readable copy.
 *
 * The scrolling copy is duplicated, so it is hidden from assistive tech and the
 * messages are exposed once in a visually-hidden list instead.
 */
export function AnnouncementBar() {
  // Doubled inside each track so a wide viewport is never left with a gap.
  const items = [...announcements, ...announcements];

  return (
    <div className="flex h-10 items-center overflow-hidden bg-accent">
      <ul className="sr-only">
        {announcements.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="flex w-max" aria-hidden="true">
        {[0, 1].map((track) => (
          <div key={track} className="marquee-track">
            {items.map((item, i) => (
              <span
                key={`${track}-${i}`}
                className="mono flex items-center gap-[22px] whitespace-nowrap pr-[22px] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-accent-contrast"
              >
                <span>{item}</span>
                <span className="opacity-55">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

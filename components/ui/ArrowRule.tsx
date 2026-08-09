/**
 * The design's CTA arrow: a short rule with a chevron head, drawn in
 * `currentColor` so it inherits whatever the button/link is doing on hover.
 */
export function ArrowRule({ width = 24 }: { width?: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative block h-0.5 bg-current"
      style={{ width }}
    >
      <span className="absolute -top-1 right-0 h-[9px] w-[9px] rotate-45 border-r-2 border-t-2 border-current" />
    </span>
  );
}

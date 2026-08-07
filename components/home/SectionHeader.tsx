import Link from "next/link";

/**
 * Editorial numbered section header — a mono "NN /" label above a display
 * title, with an optional "view all" link. Borrowed from the reference's
 * timing-screen section numbering.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel = "View all",
  dark = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className={`section-label ${dark ? "text-tpc-cream/50" : ""}`}>
          <span className="text-accent">{index}</span>{" "}
          <span aria-hidden="true">/</span> {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className={`mono shrink-0 text-xs tracking-wider hover:text-accent ${
            dark ? "text-tpc-cream/70" : "text-muted"
          }`}
        >
          {viewAllLabel} →
        </Link>
      ) : null}
    </div>
  );
}

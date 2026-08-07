import Image from "next/image";
import Link from "next/link";
import { hero } from "@/lib/config/site";

export function Hero() {
  return (
    <section className="relative -mt-[calc(var(--header-h))] flex min-h-[88vh] items-end overflow-hidden bg-tpc-black text-tpc-cream">
      <Image
        src={hero.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tpc-black/90 via-tpc-black/30 to-tpc-black/40" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="mb-5 flex items-center gap-3">
          <span className="mono inline-flex items-center gap-2 rounded-full border border-tpc-cream/25 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-tpc-cream/90">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {hero.eyebrow} / Live
          </span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
          {hero.headline}
        </h1>
        <p className="mono mt-5 text-[0.7rem] uppercase tracking-[0.18em] text-accent">
          {hero.spec}
        </p>
        <p className="mt-3 max-w-md text-base text-tpc-cream/80">
          {hero.supporting}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={hero.primaryCta.href}
            className="rounded-md bg-tpc-cream px-6 py-3 text-sm font-semibold uppercase tracking-wide text-tpc-black transition-colors hover:bg-white"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="rounded-md border border-tpc-cream/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-tpc-cream transition-colors hover:border-tpc-cream"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

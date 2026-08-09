import Image from "next/image";
import Link from "next/link";
import { ArrowRule } from "@/components/ui/ArrowRule";
import { hero, heroStats } from "@/lib/config/site";

/** Track path traced by the animated racing line under the hero. */
const TRACK =
  "M -140 376 C 190 376 250 220 470 220 C 670 220 710 320 890 320 C 1070 320 1090 178 1280 178 C 1450 178 1480 360 1740 360";

export function Hero() {
  const lines = [...hero.headlineLines, hero.headlineAccentLine];

  return (
    <section className="relative flex min-h-[86vh] items-end overflow-hidden bg-tpc-black">
      <Image
        src={hero.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,.95)_0%,rgba(10,10,10,.72)_44%,rgba(10,10,10,.2)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,#0a0a0a_1%,rgba(10,10,10,0)_40%)]" />

      {/* Racing line sweeping across the lower third of the frame. */}
      <svg
        viewBox="0 0 1600 420"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 w-full opacity-55"
      >
        <defs>
          <filter id="tpc-hero-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id="tpc-hero-track" d={TRACK} />
        </defs>

        <use
          href="#tpc-hero-track"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="3 12"
          opacity=".16"
        />
        <use
          href="#tpc-hero-track"
          pathLength="1000"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="170 1000"
          filter="url(#tpc-hero-glow)"
          className="stroke-accent"
          style={{ animation: "tpc-trail 9s linear infinite" }}
        />
        <use
          href="#tpc-hero-track"
          pathLength="1000"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="90 1000"
          opacity=".5"
          filter="url(#tpc-hero-glow)"
          style={{ animation: "tpc-trail-lag 9s linear infinite" }}
        />
      </svg>

      <div className="gutter relative flex w-full flex-wrap items-end justify-between gap-10 pb-12 pt-32">
        <div className="min-w-0 flex-[1_1_32rem]">
          <h1 className="font-display m-0 text-[clamp(3.5rem,8.6vw,9.375rem)] leading-[0.86] tracking-[-0.04em] text-tpc-white">
            {lines.map((line, i) => (
              <span
                key={line}
                className={`block overflow-hidden pb-[0.02em] ${
                  i === lines.length - 1 ? "text-accent" : ""
                }`}
              >
                <span
                  className="block"
                  style={{
                    animation: `tpc-rise .85s cubic-bezier(.2,.95,.25,1) ${0.12 + i * 0.1}s both`,
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="mt-8 max-w-[44ch] text-[clamp(1rem,1.35vw,1.3125rem)] leading-[1.55] text-tpc-body"
            style={{ animation: "tpc-fade .7s ease-out .56s both" }}
          >
            {hero.supporting}
          </p>

          <div
            className="mt-9 flex flex-wrap gap-3.5"
            style={{ animation: "tpc-fade .7s ease-out .66s both" }}
          >
            <Link
              href={hero.primaryCta.href}
              className="mono inline-flex items-center gap-[18px] bg-accent px-[34px] py-5 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-accent-contrast transition-colors hover:bg-tpc-white hover:text-tpc-black"
            >
              {hero.primaryCta.label}
              <ArrowRule />
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="mono inline-flex items-center border border-tpc-white/35 px-10 py-5 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-tpc-white transition-colors hover:border-tpc-white hover:bg-tpc-white/10"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <dl
          className="flex w-full flex-row flex-wrap justify-between gap-6 text-left sm:w-auto sm:flex-none sm:flex-col sm:justify-start sm:text-right"
          style={{ animation: "tpc-fade .8s ease-out .8s both" }}
        >
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <dd className="text-[1.875rem] font-bold leading-none tracking-[-0.02em] tabular text-tpc-white">
                {stat.value}
                {stat.accent ? (
                  <span className="text-accent">{stat.accent}</span>
                ) : null}
              </dd>
              <dt className="mono mt-1 text-[0.6875rem] uppercase tracking-[0.22em] text-[#7e8184]">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

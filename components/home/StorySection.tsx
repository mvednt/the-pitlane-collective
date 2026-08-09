import Image from "next/image";
import Link from "next/link";
import { ArrowRule } from "@/components/ui/ArrowRule";
import { Reveal } from "@/components/ui/Reveal";
import { story } from "@/lib/config/site";

/** Two-up brand story: image beside the manifesto (design file, "#story"). */
export function StorySection() {
  return (
    <Reveal
      as="section"
      id="story"
      className="grid scroll-mt-24 grid-cols-[repeat(auto-fit,minmax(21.25rem,1fr))] bg-tpc-black"
    >
      <div className="relative min-h-[clamp(23.75rem,44vw,41.25rem)] min-w-0">
        <Image
          src={story.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-center p-[clamp(2.125rem,4.4vw,5rem)]">
        <div className="flex items-center gap-4">
          <span className="block h-0.5 w-10 bg-accent" aria-hidden="true" />
          <span className="mono text-[0.75rem] font-bold uppercase tracking-[0.24em] text-accent">
            {story.eyebrow}
          </span>
        </div>

        <h2 className="font-display mt-6 text-[clamp(2.375rem,4.6vw,4.875rem)] leading-[0.9]">
          {story.headline}
          <br />
          <span className="text-accent">{story.headlineAccent}</span>
        </h2>

        {story.body.map((paragraph, i) => (
          <p
            key={paragraph}
            className={`max-w-[48ch] text-[clamp(0.9375rem,1.25vw,1.1875rem)] leading-[1.65] text-tpc-body ${
              i === 0 ? "mt-7" : "mt-5"
            }`}
          >
            {paragraph}
          </p>
        ))}

        <Link
          href={story.cta.href}
          className="mono mt-9 inline-flex items-center gap-4 self-start border-b border-[#3a3d40] pb-2.5 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-tpc-white transition-colors hover:border-accent hover:text-accent"
        >
          {story.cta.label}
          <ArrowRule width={22} />
        </Link>
      </div>
    </Reveal>
  );
}

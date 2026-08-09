import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { lookbook } from "@/lib/config/site";
import { shopify } from "@/lib/shopify";

/**
 * Lookbook mosaic: one tall tile beside two stacked ones, hairline gaps showing
 * the canvas through (design file, "#lookbook"). Each tile links into the
 * collection it shows and uses that collection's own artwork when the store has
 * one, falling back to the configured placeholder.
 */
export async function Lookbook() {
  const collections = await Promise.all(
    lookbook.map((look) => shopify.getCollection(look.handle).catch(() => null)),
  );

  const tiles = lookbook.map((look, i) => ({
    title: collections[i]?.title ?? look.title,
    href: `/collections/${look.handle}`,
    image: collections[i]?.image?.url ?? look.image,
  }));

  const [lead, ...rest] = tiles;

  return (
    <Reveal
      as="section"
      id="lookbook"
      className="grid scroll-mt-24 grid-cols-1 gap-0.5 bg-border md:grid-cols-2"
    >
      <LookTile
        {...lead}
        className="min-h-[clamp(26rem,46vw,48.75rem)] md:row-span-2"
      />
      {rest.map((tile) => (
        <LookTile
          key={tile.href}
          {...tile}
          className="min-h-[clamp(16.25rem,23vw,24.3rem)]"
        />
      ))}
    </Reveal>
  );
}

function LookTile({
  title,
  href,
  image,
  className,
}: {
  title: string;
  href: string;
  image: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative min-w-0 overflow-hidden bg-tpc-black ${className}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,10,.75)_0%,rgba(10,10,10,0)_55%)]" />
      <span className="mono absolute bottom-6 left-6 flex items-center gap-3 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-tpc-white">
        <span className="block h-0.5 w-6 bg-accent" aria-hidden="true" />
        {title}
      </span>
    </Link>
  );
}

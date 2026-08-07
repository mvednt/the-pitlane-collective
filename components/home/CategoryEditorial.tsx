import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/home/SectionHeader";
import { categoryBlocks } from "@/lib/config/site";

export function CategoryEditorial() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeader
        index="01"
        eyebrow="Choose your garage"
        title="Shop by category"
        viewAllHref="/shop"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {categoryBlocks.map((block) => (
          <Link
            key={block.href}
            href={block.href}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-tpc-black"
          >
            <Image
              src={block.image}
              alt={block.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tpc-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-tpc-cream">
              <h3 className="font-display text-3xl tracking-tight">{block.title}</h3>
              <p className="mt-1 text-sm text-tpc-cream/70">{block.descriptor}</p>
              <span className="mt-3 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-accent">
                Shop {block.title} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

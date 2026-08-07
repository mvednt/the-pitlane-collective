import Image from "next/image";
import Link from "next/link";

const blocks = [
  { title: "Shop Men", href: "/men", image: "/mock/collections/men.svg" },
  { title: "Shop Women", href: "/women", image: "/mock/collections/women.svg" },
];

export function GenderNav() {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-6 py-8 md:grid-cols-2">
      {blocks.map((block) => (
        <Link
          key={block.href}
          href={block.href}
          className="group relative aspect-[16/9] overflow-hidden rounded-lg bg-tpc-black"
        >
          <Image
            src={block.image}
            alt={block.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl tracking-tight text-tpc-cream sm:text-5xl">
              {block.title}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

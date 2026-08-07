import Image from "next/image";
import Link from "next/link";
import type { MegaMenu as MegaMenuData } from "@/lib/config/site";

export function MegaMenuPanel({
  menu,
  onNavigate,
}: {
  menu: MegaMenuData;
  onNavigate: () => void;
}) {
  if (!menu.columns) return null;

  return (
    <div className="absolute left-0 right-0 top-full border-t border-border bg-surface text-foreground shadow-lg">
      <div className="mx-auto flex max-w-6xl gap-12 px-6 py-8">
        <div className="flex flex-1 gap-16">
          {menu.columns.map((column) => (
            <div key={column.heading}>
              <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">
                {column.heading}
              </p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="text-sm text-foreground/80 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {menu.feature ? (
          <Link
            href={menu.feature.href}
            onClick={onNavigate}
            className="group relative hidden aspect-[4/3] w-72 shrink-0 overflow-hidden rounded-lg md:block"
          >
            <Image
              src={menu.feature.image}
              alt={menu.feature.title}
              fill
              sizes="288px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-3 left-3 font-display text-lg text-tpc-cream">
              {menu.feature.title}
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

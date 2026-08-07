import Link from "next/link";

export function CollectionHeader({
  title,
  description,
  count,
  breadcrumb = [],
}: {
  title: string;
  description?: string;
  count?: number;
  breadcrumb?: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            {breadcrumb.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
                <Link href={crumb.href} className="hover:text-accent">
                  {crumb.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true">/</span>
              <span className="text-foreground">{title}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-xl text-sm text-muted">{description}</p>
            ) : null}
          </div>
          {count !== undefined ? (
            <p className="text-sm text-muted tabular">
              {count} {count === 1 ? "product" : "products"}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

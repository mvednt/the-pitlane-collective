import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config/site";
import { contentPageSlugs, getContentPage } from "@/lib/content/pages";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return contentPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/pages/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getContentPage(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/pages/${slug}`,
    type: "article",
  });
}

export default async function ContentPage(props: PageProps<"/pages/[slug]">) {
  const { slug } = await props.params;
  const page = getContentPage(slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
        {page.title}
      </h1>

      {page.reviewRequired ? (
        <p className="mt-6 border border-accent/30 bg-accent/5 p-4 text-sm text-foreground/80">
          <strong className="font-semibold">Draft — pending review.</strong>{" "}
          This policy is placeholder content and has not been legally reviewed.
          It is not binding until finalised.
        </p>
      ) : null}

      {page.intro ? (
        <p className="mt-6 text-lg leading-relaxed text-foreground/80">
          {page.intro}
        </p>
      ) : null}

      {page.custom === "contact" ? (
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href={siteConfig.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent px-5 py-2.5 font-semibold uppercase tracking-wide text-accent-contrast transition-colors hover:bg-tpc-white hover:text-tpc-black"
          >
            WhatsApp us
          </a>
          <a
            href="mailto:hello@thepitlanecollective.test"
            className="border border-border px-5 py-2.5 font-semibold"
          >
            Email us
          </a>
          {/* [CONFIG: real WhatsApp number + support email before launch] */}
        </div>
      ) : null}

      <div className="mt-10 space-y-8">
        {page.sections.map((section, i) => (
          <section key={i}>
            {section.heading ? (
              <h2 className="mb-2 font-display text-xl tracking-tight">
                {section.heading}
              </h2>
            ) : null}
            {section.body?.map((p, j) => (
              <p
                key={j}
                className="mt-2 text-sm leading-relaxed text-foreground/80"
              >
                {p}
              </p>
            ))}
            {section.list ? (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/80">
                {section.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.note ? (
              <p className="mt-2 border border-border bg-surface p-3 text-xs text-muted">
                {section.note}
              </p>
            ) : null}
          </section>
        ))}
      </div>

      {page.tables?.length ? (
        <div className="mt-10 space-y-8">
          {page.tables.map((table, i) => (
            <div key={i}>
              {table.caption ? (
                <h2 className="mb-3 font-display text-xl tracking-tight">
                  {table.caption}
                </h2>
              ) : null}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      {table.columns.map((col) => (
                        <th
                          key={col}
                          className="py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-muted"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, r) => (
                      <tr key={r} className="border-b border-border/60">
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className={`py-2.5 pr-4 tabular ${c === 0 ? "font-medium" : "text-foreground/70"}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

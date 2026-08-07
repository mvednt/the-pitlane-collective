import { brandStatement, craftsmanship } from "@/lib/config/site";

export function BrandStatement() {
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            {brandStatement.heading}
          </h2>
          <p className="mt-6 text-lg text-tpc-cream/70">{brandStatement.body}</p>
        </div>

        <div className="mt-16 grid gap-8 border-t border-tpc-cream/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {craftsmanship.map((item) => (
            <div key={item.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-tpc-cream">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-tpc-cream/60">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

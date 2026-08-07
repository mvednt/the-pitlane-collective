import { stats } from "@/lib/config/site";

/**
 * At-a-glance stat band (honest values only — no fabricated metrics). Big mono
 * numerals over a mono label, in a bordered grid, echoing the reference's
 * counter row.
 */
export function StatBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface px-5 py-8 text-center">
            <p className="mono text-2xl tracking-tight text-foreground sm:text-3xl">
              {stat.value}
            </p>
            <p className="section-label mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

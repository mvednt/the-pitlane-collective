const reviews = [
  {
    quote: "The oversized fit is exactly right — heavy fabric, sits clean. Nothing like the cheap fan tees.",
    name: "Aditya R.",
    location: "Bengaluru",
  },
  {
    quote: "Finally motorsport merch I'd actually wear to college. The baby tee is my new favourite.",
    name: "Sneha M.",
    location: "Pune",
  },
  {
    quote: "Ordered the jersey for race weekend, wore it all week. Print hasn't faded once.",
    name: "Kabir S.",
    location: "Delhi",
  },
];

export function SocialProof() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Made for the ones watching every lap
        </h2>
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground tabular">4.8</span> / 5
          average
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <figure
            key={review.name}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <div className="mb-3 text-accent" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote className="text-sm text-foreground/80">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs text-muted">
              {review.name} · {review.location}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

/**
 * Newsletter capture (spec §8K). This is a UI + client-validation shell only:
 * on submit it shows a success state but does not yet POST anywhere. Wire the
 * onSubmit to Shopify customer marketing consent or an email provider in a
 * later phase — clearly a placeholder until then.
 */
export function NewsletterForm({
  variant = "onLight",
}: {
  variant?: "onLight" | "onDark";
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onDark = variant === "onDark";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to Shopify customer marketing consent / email provider.
    track("newsletter_signup", {});
    setDone(true);
  }

  if (done) {
    return (
      <p className={cn("text-sm", onDark ? "text-tpc-cream/80" : "text-foreground/80")}>
        You&apos;re on the grid. Watch your inbox for the next drop.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <label htmlFor={`newsletter-${variant}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-${variant}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={cn(
          "min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-accent",
          onDark
            ? "border-tpc-cream/25 bg-transparent text-tpc-cream placeholder:text-tpc-cream/40"
            : "border-border bg-surface text-foreground placeholder:text-muted",
        )}
      />
      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-90"
      >
        Subscribe
      </button>
    </form>
  );
}

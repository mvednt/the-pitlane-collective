"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/client";

/**
 * Newsletter capture (spec §8K). This is a UI + client-validation shell only:
 * on submit it shows a success state but does not yet POST anywhere. Wire the
 * onSubmit to Shopify customer marketing consent or an email provider in a
 * later phase — clearly a placeholder until then.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to Shopify customer marketing consent / email provider.
    track("newsletter_signup", {});
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-wrap">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setDone(false);
        }}
        placeholder="YOUR EMAIL ADDRESS"
        className="mono h-16 min-w-0 flex-[1_1_13.75rem] border border-tpc-stroke bg-tpc-black px-5.5 text-[0.8rem] tracking-[0.16em] text-tpc-white outline-none placeholder:text-tpc-dim focus:border-accent"
      />
      <button
        type="submit"
        className="mono h-16 flex-none cursor-pointer border-none bg-accent px-10 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-accent-contrast transition-colors hover:bg-tpc-white hover:text-tpc-black"
      >
        {done ? "Joined" : "Join"}
      </button>

      <p aria-live="polite" className="mono w-full pt-3 text-[0.75rem] uppercase tracking-[0.16em] text-muted">
        {done ? "You're on the grid. Watch your inbox for the next drop." : ""}
      </p>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useConsent } from "@/context/consent-context";

/**
 * Non-intrusive bottom consent banner. Shown only until the visitor decides.
 * "Accept" and "Reject" are given equal visual weight (no dark patterns), and a
 * "Preferences" option allows granular choice.
 */
export function ConsentBanner() {
  const { acceptAll, rejectNonEssential, openPreferences } = useConsent();

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-surface/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-foreground/80">
          We use necessary cookies to run the store, and optional cookies for
          analytics and marketing. You can change this anytime.{" "}
          <Link href="/pages/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openPreferences}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground"
          >
            Preferences
          </button>
          <button
            type="button"
            onClick={rejectNonEssential}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-md bg-tpc-black px-4 py-2 text-sm font-semibold uppercase tracking-wide text-tpc-cream"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

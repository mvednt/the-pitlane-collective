"use client";

import { useConsent } from "@/context/consent-context";

/** Footer link that reopens the consent preferences modal. */
export function CookiePreferencesLink() {
  const { openPreferences } = useConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-sm text-tpc-cream/75 transition-colors hover:text-accent"
    >
      Cookie preferences
    </button>
  );
}

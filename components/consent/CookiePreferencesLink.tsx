"use client";

import { useConsent } from "@/context/consent-context";

/** Footer link that reopens the consent preferences modal. */
export function CookiePreferencesLink() {
  const { openPreferences } = useConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className="mono cursor-pointer text-[0.75rem] uppercase tracking-[0.16em] text-tpc-dim transition-colors hover:text-tpc-white"
    >
      Cookie settings
    </button>
  );
}

"use client";

import { useConsent } from "@/context/consent-context";
import { ConsentBanner } from "./ConsentBanner";
import { ConsentPreferences } from "./ConsentPreferences";

/**
 * Shows the consent banner until the visitor has decided (after hydration to
 * avoid a flash), and mounts the preferences modal (reachable from the banner
 * or footer). The modal renders whenever it's open, even after a decision.
 */
export function ConsentGate() {
  const { hydrated, decided } = useConsent();
  return (
    <>
      {hydrated && !decided ? <ConsentBanner /> : null}
      <ConsentPreferences />
    </>
  );
}

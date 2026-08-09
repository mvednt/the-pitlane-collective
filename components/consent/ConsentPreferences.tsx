"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { useConsent } from "@/context/consent-context";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";

/** Granular consent modal — reachable from the banner and the footer. */
export function ConsentPreferences() {
  const { consent, preferencesOpen, closePreferences, save, acceptAll } =
    useConsent();
  const panelRef = useFocusTrap<HTMLDivElement>(preferencesOpen);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);

  // Sync local toggles to saved consent each time the modal opens.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!preferencesOpen) return;
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePreferences();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!preferencesOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie preferences"
    >
      <button
        type="button"
        aria-label="Close preferences"
        onClick={closePreferences}
        className="absolute inset-0 bg-tpc-black/70"
      />
      <div
        ref={panelRef}
        className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg tracking-tight">
            Cookie Preferences
          </h2>
          <button type="button" onClick={closePreferences} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <Row
            title="Strictly necessary"
            body="Required for the store, cart and checkout to work. Always on."
          >
            <input type="checkbox" checked disabled aria-label="Necessary cookies (always on)" className="h-4 w-4 accent-accent" />
          </Row>
          <Row
            title="Analytics"
            body="Helps us understand what's working. No email, phone or address is ever sent."
          >
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              aria-label="Analytics cookies"
              className="h-4 w-4 accent-accent"
            />
          </Row>
          <Row
            title="Marketing"
            body="Used to measure and improve campaigns."
          >
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              aria-label="Marketing cookies"
              className="h-4 w-4 accent-accent"
            />
          </Row>
        </div>

        <div className="flex gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={() => {
              save({ analytics, marketing });
              closePreferences();
            }}
            className="flex-1 border border-border py-3 text-sm font-semibold"
          >
            Save choices
          </button>
          <button
            type="button"
            onClick={() => {
              acceptAll();
              closePreferences();
            }}
            className="flex-1 bg-accent py-3 text-sm font-semibold uppercase tracking-wide text-accent-contrast"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{body}</p>
      </div>
      <div className="pt-0.5">{children}</div>
    </div>
  );
}

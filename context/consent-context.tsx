"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Cookie/consent state, persisted in a versioned localStorage record. Bumping
 * CONSENT_VERSION invalidates prior consent so returning visitors are asked
 * again after a material policy change.
 *
 * `necessary` is always true (strictly-required cookies). `analytics` and
 * `marketing` default to false until the visitor decides — analytics providers
 * never load until `analytics` is granted (see AnalyticsProvider).
 */

export const CONSENT_VERSION = 1;
const KEY = "tpc:consent";

export interface ConsentState {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

interface ConsentContextValue {
  consent: ConsentState;
  /** True once we've read localStorage — avoids SSR/first-paint mismatch. */
  hydrated: boolean;
  /** True when the visitor has made a choice at the current version. */
  decided: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  save: (prefs: { analytics: boolean; marketing: boolean }) => void;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
}

const DEFAULT_CONSENT: ConsentState = {
  version: CONSENT_VERSION,
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function read(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<ConsentState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    // Read persisted consent after mount (localStorage isn't available on the
    // server) — a legitimate external-system read.
    /* eslint-disable react-hooks/set-state-in-effect */
    setStored(read());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function persist(next: ConsentState) {
    setStored(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore quota / privacy-mode failures
    }
  }

  function make(analytics: boolean, marketing: boolean): ConsentState {
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    };
  }

  const value: ConsentContextValue = {
    consent: stored ?? DEFAULT_CONSENT,
    hydrated,
    decided: stored !== null,
    acceptAll: () => persist(make(true, true)),
    rejectNonEssential: () => persist(make(false, false)),
    save: (prefs) => persist(make(prefs.analytics, prefs.marketing)),
    preferencesOpen,
    openPreferences: () => setPreferencesOpen(true),
    closePreferences: () => setPreferencesOpen(false),
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context)
    throw new Error("useConsent must be used within a ConsentProvider");
  return context;
}

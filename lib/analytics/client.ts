/**
 * Central analytics dispatcher (client-side singleton).
 *
 * Responsibilities:
 * - Hold the configured provider IDs and current analytics-consent state.
 * - Lazily load each provider's script ONLY when it has an ID and consent is
 *   granted.
 * - Fan a typed event out to every loaded provider, stripping undefined params.
 *
 * Components import `track` / `pageview` and call them freely; nothing happens
 * until both an ID and consent exist, so calls are always safe.
 */
import type { AnalyticsIds } from "./config";
import type {
  AnalyticsEvent,
  AnalyticsEventMap,
  AnalyticsEventName,
} from "./events";
import {
  clarityProvider,
  ga4Provider,
  metaPixelProvider,
  type Provider,
} from "./providers";

interface Binding {
  provider: Provider;
  id: string;
}

let ids: AnalyticsIds = { ga4: null, metaPixel: null, clarity: null };
let consented = false;
const loaded = new Set<string>();

function bindings(): Binding[] {
  const list: Binding[] = [];
  if (ids.ga4) list.push({ provider: ga4Provider, id: ids.ga4 });
  if (ids.metaPixel)
    list.push({ provider: metaPixelProvider, id: ids.metaPixel });
  if (ids.clarity) list.push({ provider: clarityProvider, id: ids.clarity });
  return list;
}

function ensureLoaded() {
  if (typeof window === "undefined" || !consented) return;
  for (const { provider, id } of bindings()) {
    if (loaded.has(provider.key)) continue;
    provider.load(id);
    loaded.add(provider.key);
  }
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out as T;
}

export const analytics = {
  configure(nextIds: AnalyticsIds) {
    ids = nextIds;
    ensureLoaded();
  },
  setConsent(granted: boolean) {
    consented = granted;
    ensureLoaded();
  },
  /** Whether events will actually be delivered right now. */
  isActive(): boolean {
    return consented && bindings().length > 0;
  },
  track<K extends AnalyticsEventName>(name: K, params: AnalyticsEventMap[K]) {
    if (!consented) return;
    // Rebuilt as the discriminated union member for the provider API.
    const event = {
      name,
      params: stripUndefined(params as Record<string, unknown>),
    } as unknown as AnalyticsEvent;
    for (const { provider } of bindings()) provider.track(event);
  },
};

export function track<K extends AnalyticsEventName>(
  name: K,
  params: AnalyticsEventMap[K],
) {
  analytics.track(name, params);
}

export function pageview(path: string) {
  analytics.track("page_view", { path });
}

/** Dispatch a pre-built, discriminated event object (used by <TrackEvent>). */
export function emit(event: import("./events").AnalyticsEvent) {
  (analytics.track as (name: string, params: unknown) => void)(
    event.name,
    event.params,
  );
}

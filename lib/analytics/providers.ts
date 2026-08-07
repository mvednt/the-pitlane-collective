/**
 * Provider-specific analytics code, isolated behind a common `Provider`
 * interface. Each provider knows how to lazily inject its script and how to map
 * a typed `AnalyticsEvent` into its own API. The dispatcher in `client.ts` never
 * references a provider's globals directly.
 *
 * All script loading is deferred until the dispatcher decides a provider is both
 * configured (has an ID) and consented.
 */
import {
  META_STANDARD_EVENTS,
  type AnalyticsEvent,
} from "./events";

export interface Provider {
  readonly key: string;
  load: (id: string) => void;
  track: (event: AnalyticsEvent) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: any;
    _fbq?: any;
    clarity?: (...args: unknown[]) => void;
  }
}

function injectScript(src: string, attrs: Record<string, string> = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.appendChild(s);
}

/* --------------------------------- GA4 ---------------------------------- */

export const ga4Provider: Provider = {
  key: "ga4",
  load(id) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    // Disable automatic page_view; we send them ourselves to avoid duplicates.
    window.gtag("config", id, { send_page_view: false });
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
  },
  track(event) {
    if (!window.gtag) return;
    if (event.name === "page_view") {
      window.gtag("event", "page_view", { page_path: event.params.path });
      return;
    }
    window.gtag("event", event.name, event.params);
  },
};

/* ------------------------------ Meta Pixel ------------------------------ */

export const metaPixelProvider: Provider = {
  key: "metaPixel",
  load(id) {
    if (window.fbq) return;
    const fbq: any = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    };
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    injectScript("https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id);
  },
  track(event) {
    if (!window.fbq) return;
    const standard = META_STANDARD_EVENTS[event.name];
    if (standard) window.fbq("track", standard, event.params);
    else window.fbq("trackCustom", event.name, event.params);
  },
};

/* ------------------------------- Clarity -------------------------------- */

export const clarityProvider: Provider = {
  key: "clarity",
  load(id) {
    if (window.clarity) return;
    const c: any = function (...args: unknown[]) {
      (c.q = c.q || []).push(args);
    };
    window.clarity = c;
    injectScript(`https://www.clarity.ms/tag/${id}`);
  },
  track(event) {
    // Clarity is primarily session analytics; forward event names as custom
    // events/tags without any payload (payloads may contain non-PII values we
    // don't need in Clarity).
    if (!window.clarity) return;
    window.clarity("event", event.name);
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

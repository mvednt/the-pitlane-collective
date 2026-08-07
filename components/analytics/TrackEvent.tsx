"use client";

import { useEffect } from "react";
import { emit } from "@/lib/analytics/client";
import type { AnalyticsEvent } from "@/lib/analytics/events";

/**
 * Fires a single analytics event on mount. Lets server components emit view
 * events (view_home / view_collection / view_item) without becoming client
 * components themselves. No-ops until analytics is consented + configured.
 */
export function TrackEvent({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    emit(event);
    // Fire once per mount for this event identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

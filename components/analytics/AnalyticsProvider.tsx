"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useConsent } from "@/context/consent-context";
import { analytics, pageview } from "@/lib/analytics/client";
import { getAnalyticsIds } from "@/lib/analytics/config";

/**
 * Wires the analytics dispatcher to consent + routing:
 * - Configures provider IDs once on mount.
 * - Grants/revokes analytics based on cookie consent (providers load only when
 *   consent is granted AND an ID exists).
 * - Emits a single de-duplicated `page_view` per URL (path + query) once
 *   analytics is active.
 *
 * Renders nothing.
 */
export function AnalyticsProvider() {
  const { consent } = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    analytics.configure(getAnalyticsIds());
  }, []);

  useEffect(() => {
    analytics.setConsent(consent.analytics);
  }, [consent.analytics]);

  useEffect(() => {
    if (!analytics.isActive()) return;
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (lastPath.current === url) return; // de-dupe
    lastPath.current = url;
    pageview(url);
  }, [pathname, searchParams, consent.analytics]);

  return null;
}

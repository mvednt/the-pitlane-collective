/**
 * Public analytics IDs. These are `NEXT_PUBLIC_*` because analytics tags are
 * inherently client-side and the IDs appear in the browser by design — they are
 * not secrets. A provider is only ever loaded when its ID is present AND the
 * visitor has granted analytics consent (see `lib/analytics/client.ts`).
 */
export interface AnalyticsIds {
  ga4: string | null;
  metaPixel: string | null;
  clarity: string | null;
}

import { publicEnv } from "@/lib/env.public";

export function getAnalyticsIds(): AnalyticsIds {
  return {
    ga4: publicEnv.NEXT_PUBLIC_GA4_ID ?? null,
    metaPixel: publicEnv.NEXT_PUBLIC_META_PIXEL_ID ?? null,
    clarity: publicEnv.NEXT_PUBLIC_CLARITY_ID ?? null,
  };
}

export function hasAnyAnalyticsId(ids: AnalyticsIds): boolean {
  return Boolean(ids.ga4 || ids.metaPixel || ids.clarity);
}

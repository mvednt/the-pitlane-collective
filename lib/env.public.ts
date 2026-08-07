import { z } from "zod";

/**
 * Public environment (safe to reference on the client). These are inlined by
 * Next at build time via literal `process.env.NEXT_PUBLIC_*` access. Analytics
 * IDs are public by nature — they appear in client tags — and are optional so
 * mock/dev runs need none of them.
 */

const optionalString = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().optional(),
);

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.url().default("http://localhost:3000"),
  ),
  NEXT_PUBLIC_GA4_ID: optionalString,
  NEXT_PUBLIC_META_PIXEL_ID: optionalString,
  NEXT_PUBLIC_CLARITY_ID: optionalString,
});

// Literal accesses so Next can inline each value in the client bundle.
export const publicEnv = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
});

export type PublicEnv = typeof publicEnv;

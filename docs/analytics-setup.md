# Analytics setup

GA4, Meta Pixel and Microsoft Clarity, all behind one typed dispatcher and
**gated on cookie consent**. Nothing loads without both an ID and consent.

## Prerequisites
- A GA4 property, Meta Pixel, and/or a Clarity project (any subset).

## Where to find IDs
- **GA4**: Google Analytics → Admin → Data Streams → your web stream →
  **Measurement ID** (`G-XXXXXXX`).
- **Meta Pixel**: Meta Events Manager → your pixel → **Pixel ID** (numeric).
- **Microsoft Clarity**: Clarity → Settings → **Project ID**.

## Environment variables (public by design)
```
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```
These are `NEXT_PUBLIC_*` because analytics tags run in the browser and the IDs
are not secrets. A provider loads **only** when its ID is present **and** the
visitor grants analytics consent.

## How it behaves
- No consent → no scripts, no `gtag`/`fbq`/`clarity`.
- Consent granted but no IDs → still nothing loads.
- IDs + consent → provider scripts load once; events fan out via
  [`lib/analytics`](../lib/analytics). No email/phone/address is ever sent.
- `purchase` is **not** fired client-side — take it from Shopify analytics /
  Shopify order data server-side. `begin_checkout` fires on checkout click.

## Consent
The banner + preferences modal live in [`components/consent`](../components/consent);
consent is versioned in localStorage ([`context/consent-context.tsx`](../context/consent-context.tsx)).
"Cookie preferences" in the footer reopens it.

## Verification
1. Load the site, **don't** consent → dev console: `window.gtag` is `undefined`,
   no `googletagmanager`/`facebook`/`clarity` scripts.
2. Accept analytics → scripts load; GA4 DebugView / Pixel Helper show events.

## Common failure cases
- **No events** — consent not granted, or the ID is wrong/missing.
- **CSP blocks scripts** — ensure analytics hosts are allowed (they are in the
  production CSP; see [deployment-vercel.md](deployment-vercel.md)).

## Security / privacy
- Never put PII in event params. The dispatcher strips `undefined` and only
  sends product/UI identifiers.
- Respect regional consent laws; the banner defaults optional cookies **off**.

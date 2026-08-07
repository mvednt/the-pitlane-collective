# Deployment (Vercel)

Prerequisites: a Vercel account, this repo connected, and (for live commerce) a
Shopify store with a Storefront API token. The app also deploys and runs on
mock data with no credentials.

## Build & runtime

- **Install command:** `npm install`
- **Build command:** `npm run build` (Next.js 16, Turbopack)
- **Output:** Next.js (Vercel auto-detects)
- **Node version:** 20+ (set via Vercel Project Settings → Node.js Version, or an
  `.nvmrc` / `engines` field). The app is tested on Node 20/22.
- **Image hosts:** `cdn.shopify.com` is already allowed in `next.config.ts`
  `images.remotePatterns`. Add any other product-image host you use.

## Environment variables

| Variable | Scope | Preview | Production | Notes |
|---|---|---|---|---|
| `DATA_SOURCE` | server | `mock` (or unset) | `live` | `live` requires the two Shopify vars below |
| `SHOPIFY_STORE_DOMAIN` | server | optional | required (live) | `your-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | server | optional | required (live) | Storefront API token |
| `SHOPIFY_API_VERSION` | server | optional | optional | pin the Storefront API version (defaults `2025-01`) |
| `NEXT_PUBLIC_SITE_URL` | public | preview URL | canonical URL | used for canonical/OG/sitemap |
| `NEXT_PUBLIC_GA4_ID` | public | optional | optional | loads only after consent |
| `NEXT_PUBLIC_META_PIXEL_ID` | public | optional | optional | loads only after consent |
| `NEXT_PUBLIC_CLARITY_ID` | public | optional | optional | loads only after consent |

Server variables are never exposed to the client (`server-only`-guarded).
Analytics IDs are `NEXT_PUBLIC_*` by design (they appear in client tags) and are
not secrets.

### Preview vs production

- Use **Preview** deployments on mock data (or a dev Shopify store) with
  `DATA_SOURCE=mock`. Set `NEXT_PUBLIC_SITE_URL` to the preview URL if you want
  correct canonical/OG there.
- Use **Production** with `DATA_SOURCE=live` and the real Shopify token, and set
  `NEXT_PUBLIC_SITE_URL` to your custom domain.

## Allowed domains

- **Shopify:** payments run on Shopify-hosted checkout, so no storefront CORS
  config is needed for checkout. If you later add the Headless channel's app
  domains, list your production domain there.
- **Analytics:** GA4/Meta/Clarity need no domain allow-listing for a standard
  web property.

## Caching / ISR

- Storefront reads (products, collections, search) are cached with a default
  time-based revalidate (~5 min) in `lib/shopify/client.ts`, so live data stays
  reasonably fresh without webhooks. Cart calls are always `no-store`.
- `sitemap.xml` revalidates hourly.
- To make a specific page update instantly after a Shopify edit, lower the
  revalidate window or (later) add a minimal revalidation endpoint.

## Security

- Security headers are set in `next.config.ts`; a strict nonce-based CSP is set
  per request in `proxy.ts` (`lib/security/csp.ts`). The CSP allow-lists only
  Shopify image CDN + GA4/Meta/Clarity — it is not relaxed globally.
- Rate limiting on the search action is in-memory per instance
  (`lib/rate-limit.ts`); for strict global limits back it with a shared store.
- Errors are handled by `app/error.tsx` and `app/global-error.tsx`; 404 by
  `app/not-found.tsx`. `app/api/health` is a simple readiness check.

## Post-deploy verification checklist

- [ ] `GET /api/health` → `{ status: "ok", dataSource: "live" }`
- [ ] Homepage, collections, PDP render with live products
- [ ] Search (overlay + `/search`) returns results
- [ ] Filtering + sorting update the URL and grid
- [ ] Wishlist add/remove persists (localStorage)
- [ ] Cart: add → drawer → **Checkout redirects to Shopify checkout**
- [ ] `sitemap.xml` and `robots.txt` return correctly
- [ ] Cookie consent banner appears; analytics load only after consent + IDs set
- [ ] Mobile layout + sticky add-to-cart
- [ ] 404 route renders `app/not-found.tsx`

## Rollback

- Vercel keeps immutable deployments — use **Instant Rollback** to the previous
  production deployment from the Vercel dashboard if a release regresses.

## Before accepting real orders

Verify in Shopify: Razorpay (through Shopify) is live, shipping, taxes/GST,
legal policy pages, transactional emails, and **a real test order end-to-end**.

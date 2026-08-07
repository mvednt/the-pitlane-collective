# The Pitlane Collective

A premium, F1-inspired merchandise storefront: a custom Next.js (App Router) +
TypeScript front end on top of **Shopify**. Shopify is the single source of truth
for products, collections, variants, inventory, cart, checkout, orders,
discounts, shipping, taxes, refunds, transactional emails and customer data.
Payments run through **Razorpay configured inside Shopify checkout**.

The app runs on typed **mock data** with zero credentials for local development,
and switches to live Shopify the moment credentials are set.

## Architecture

```
Customer → Next.js storefront → Shopify Storefront API → Shopify cart
        → Shopify checkout (Razorpay configured inside Shopify)
        → Shopify: orders, inventory, discounts, emails, refunds, customer data
```

The storefront does **not** duplicate any commerce system. There is no custom
payment code, no custom order/inventory logic, no server-side persistence, and
no custom authentication.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). By default it runs on mock
product/collection/cart data — browse, filter, search, pick variants, add to
cart. In mock mode the checkout button routes to `/cart` (no real payment).

## Switching to live Shopify

1. `cp .env.local.example .env.local`
2. Shopify admin → **Settings → Apps and sales channels → Develop apps** (or the
   **Headless** channel) → create an app → enable the **Storefront API** →
   generate an access token. (See [docs/shopify-setup.md](docs/shopify-setup.md).)
3. Set `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, and
   `DATA_SOURCE=live`.
4. Restart. The storefront now reads live products/inventory and the checkout
   button redirects to Shopify's hosted checkout.

## Environment variables

Validated at startup by [`lib/env.public.ts`](lib/env.public.ts) (client-safe)
and [`lib/env.server.ts`](lib/env.server.ts) (server-only, `server-only`-guarded
so secrets never reach the client bundle). Everything is optional for mock mode;
`DATA_SOURCE=live` fails clearly if the Shopify vars are missing.

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `DATA_SOURCE` | server | no | `mock` \| `live`; unset = auto-detect |
| `SHOPIFY_STORE_DOMAIN` | server | live only | `your-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | server | live only | Storefront API token (public-safe; kept server-side) |
| `SHOPIFY_API_VERSION` | server | no (defaults `2025-01`) | Storefront API version |
| `NEXT_PUBLIC_SITE_URL` | public | no (defaults localhost) | Canonical / OG / sitemap base URL |
| `NEXT_PUBLIC_GA4_ID` | public | no | Google Analytics 4 — loads only after consent |
| `NEXT_PUBLIC_META_PIXEL_ID` | public | no | Meta Pixel — loads only after consent |
| `NEXT_PUBLIC_CLARITY_ID` | public | no | Microsoft Clarity — loads only after consent |

Analytics IDs are `NEXT_PUBLIC_*` by design (they appear in client tags) and are
not secrets. A provider loads only when its ID is set **and** the visitor grants
analytics consent. No email, phone, or address is ever sent to analytics.

## What's in the storefront

- **Pages** — home, `/shop`, `/men`, `/women`, collections
  (`/collections/[handle]`: oversized, baby-tees, jerseys, new-drop,
  bestsellers), product pages, cart, wishlist, policy/support pages, search.
- **Product** — variant + colour selection, live inventory availability, size
  guide, accordions, related products, recently viewed (localStorage), mobile
  sticky add-to-cart.
- **Discovery** — faceted filtering + sorting with URL state, predictive search
  overlay + `/search` results.
- **Cart** — Shopify Cart via server actions ([`app/actions/cart.ts`](app/actions/cart.ts)),
  slide-out drawer, quantity controls, free-shipping progress; **checkout
  redirects to Shopify's hosted checkout**.
- **Wishlist** — entirely client-side in `localStorage`, storing only Shopify
  product references ([`context/wishlist-context.tsx`](context/wishlist-context.tsx));
  the wishlist page re-fetches fresh product data from Shopify.
- **SEO** — dynamic metadata (canonical, OG, Twitter), typed JSON-LD
  (Organization, WebSite + SearchAction, Product, Breadcrumb), dynamic
  `sitemap.xml` + `robots.txt`, `noindex` on internal search.
- **Analytics & consent** — one typed dispatcher ([`lib/analytics`](lib/analytics))
  fanning to GA4 / Meta Pixel / Clarity, gated by a versioned cookie-consent
  system ([`context/consent-context.tsx`](context/consent-context.tsx)).
- **Security** — nonce-based CSP ([`proxy.ts`](proxy.ts) + [`lib/security/csp.ts`](lib/security/csp.ts)),
  static security headers ([`next.config.ts`](next.config.ts)), error boundaries
  (`app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`), and a simple
  `/api/health` readiness check.

Customer accounts are intentionally **not** built — launch uses guest checkout;
a link to Shopify-hosted customer accounts can be added later.

## Data layer

Every page reads the normalized interface in [`lib/shopify/types.ts`](lib/shopify/types.ts)
(`ShopifyDataSource`) — never raw GraphQL. Two adapters implement it:

- [`lib/shopify/mock.ts`](lib/shopify/mock.ts) — in-memory mock data for local dev.
- [`lib/shopify/live.ts`](lib/shopify/live.ts) — Shopify Storefront API (GraphQL),
  via fragments/queries/mutations in `lib/shopify/`. The client
  ([`lib/shopify/client.ts`](lib/shopify/client.ts)) adds timeouts, throttle/5xx
  retries with backoff, response validation, and time-based ISR caching.

[`lib/shopify/index.ts`](lib/shopify/index.ts) picks the adapter from env and
exports a single `shopify` object.

## Scripts

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint
- `npm test` — unit tests (search-matching + filter/sort logic) via Node's runner

## Going live

Setup guides are in [`docs/`](docs/README.md): Shopify, products/collections,
metafields, Razorpay-through-Shopify, analytics, domain, shipping/GST, and Vercel
deployment. The store is **not** ready for real payments until, in Shopify,
Razorpay is live and shipping, taxes/GST, legal policy pages, transactional
emails, and a real end-to-end test order are all verified.

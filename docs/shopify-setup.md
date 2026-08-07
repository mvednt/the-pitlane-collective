# Shopify setup

Connect the storefront to a live Shopify store via the Storefront API.

## Prerequisites
- A Shopify store (any plan that includes the Storefront API / Headless channel). `[CONFIRM plan on shopify.com/pricing]`
- Admin access to the store.

## 1. Create / choose a store
Shopify Admin is at `https://admin.shopify.com`. Use an existing store or create one.

## 2. Add the Headless channel (or a custom app)
Two supported options for a Storefront API token:

**A. Headless channel (recommended)**
- Admin → **Settings → Apps and sales channels → Shopify App Store** → install **Headless**.
- Open **Headless** → **Storefront API** → create a storefront → copy the **public access token**.

**B. Custom app**
- Admin → **Settings → Apps and sales channels → Develop apps → Create an app**.
- **Configuration → Storefront API** → enable access → **Install app** → copy the **Storefront API access token**.

## 3. Storefront API permissions
Enable the unauthenticated scopes the storefront needs (defaults are usually sufficient):
`unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
`unauthenticated_read_product_tags`, `unauthenticated_read_collection_listings`,
`unauthenticated_write_checkouts` / cart, `unauthenticated_read_checkouts`.

## 4. Which token is which (security)
- **Storefront API access token** → this is the **public** token used by
  `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. It is designed to be used from a storefront
  and is safe to expose to browsers. This app still keeps it **server-only** and
  proxies all calls server-side (see [`lib/shopify/client.ts`](../lib/shopify/client.ts)).
- **Admin API token** → **not used by this storefront.** Shopify handles orders,
  inventory, discounts, refunds, emails and customer data. If you ever add an
  Admin API integration, keep its token server-only and never import it into a
  client component.

## 5. Environment variables
```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com   # no protocol
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...             # public storefront token
SHOPIFY_API_VERSION=2025-01          # optional; see below
DATA_SOURCE=live                                # optional; auto-detected otherwise
```
With domain + token set, the app switches to live automatically. `DATA_SOURCE=live`
forces it and fails clearly if either is missing.

## 6. API version & the upgrade process
The version is pinned via `SHOPIFY_API_VERSION` (default in
[`lib/shopify/client.ts`](../lib/shopify/client.ts)). Shopify ships quarterly
versions and supports each for ~12 months.

To upgrade:
1. Read Shopify's changelog for the target version (breaking changes).
2. Bump `SHOPIFY_API_VERSION` in a **preview** deploy first.
3. Smoke-test products, collections, search, cart create/add/update, checkout URL.
4. Update GraphQL fragments/queries in `lib/shopify/{fragments,queries,mutations}` only if a field changed.
5. Promote to production.

> Do **not** use the deprecated Checkout APIs. This app uses the current **Cart
> API** (`cartCreate`, `cartLinesAdd/Update/Remove`) and redirects to the cart's
> `checkoutUrl` for Shopify-hosted checkout.

## Verification
```bash
DATA_SOURCE=live npm run build   # fails clearly if creds missing
```
Then load the homepage, a collection, and a product; add to cart; click checkout
and confirm it redirects to `*.myshopify.com` / your checkout domain.

## Common failure cases
- **401 / invalid token** — wrong token type or store domain; re-copy the Storefront token.
- **Empty products** — products aren't published to the Headless/online sales channel.
- **Throttled (429)** — the client retries with backoff; heavy traffic may need caching/ISR tuning.
- **CORS errors** — you're calling the Storefront API from the browser; keep calls server-side (this app does).

## Security warnings
- Never commit `.env.local`.
- Keep any server-side secrets out of client components (this storefront needs none beyond the Storefront token).
- Rotate tokens if leaked (Admin → app → regenerate).

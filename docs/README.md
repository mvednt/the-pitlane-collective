# The Pitlane Collective — setup & operations guides

These guides cover connecting the storefront to live services. **Nothing here is
required to run the app** — it works fully on mock data with zero credentials.
Follow the guides in order when going live.

> Honesty note: these docs deliberately **do not** invent merchant eligibility,
> fees, or approval timelines for third parties (Shopify, Razorpay, couriers,
> etc.). Where a value depends on your account or a provider's current terms,
> it's marked `[CONFIRM …]` — check the provider's own dashboard/docs.

## Architecture (launch)

```
Customer → Next.js storefront → Shopify Storefront API → Shopify cart
        → Shopify checkout (Razorpay configured inside Shopify)
        → Shopify handles orders, inventory, discounts, emails, refunds, customer data
```

Shopify is the single source of truth for all commerce. The storefront does not
duplicate orders, inventory, payments, accounts, or persistence.

| Guide | What it covers |
|---|---|
| [shopify-setup.md](shopify-setup.md) | Store, Headless channel, Storefront token, permissions, API version + upgrades |
| [products-collections.md](products-collections.md) | Products, variants, inventory, tags, collections |
| [metafields-metaobjects.md](metafields-metaobjects.md) | Structured product fields + editorial content |
| [razorpay-shopify.md](razorpay-shopify.md) | Payments: Razorpay configured **inside** Shopify checkout |
| [analytics-setup.md](analytics-setup.md) | GA4, Meta Pixel, Microsoft Clarity + consent |
| [domain-setup.md](domain-setup.md) | Custom domain, canonical URL, allowed domains |
| [shipping-gst.md](shipping-gst.md) | Shipping, taxes/GST, markets & currency |
| [deployment-vercel.md](deployment-vercel.md) | Vercel deploy, env matrix, verification checklist |

## Environment variables

The single source of truth is [`.env.local.example`](../.env.local.example),
validated at startup by [`lib/env.public.ts`](../lib/env.public.ts) (client-safe)
and [`lib/env.server.ts`](../lib/env.server.ts) (server-only). A full table is in
the [project README](../README.md#environment-variables).

## Before accepting real orders

The store is **not** ready for real payments until all of these are verified in
Shopify: Razorpay (through Shopify) is live, shipping, taxes/GST, legal policy
pages, transactional emails, **and a real test order placed end-to-end**.

# Metafields & metaobjects

Use metafields for structured product attributes instead of stuffing everything
into the description, and metaobjects for editorial homepage content.

## Prerequisites
- Shopify connected; products created.

## Product metafields (namespace `tpc`)
Admin → **Settings → Custom data → Products → Add definition**. Suggested:

| Key (`tpc.*`) | Type | Storefront use |
|---|---|---|
| `fit` | single line text | Fit facet + PDP "Fit & model" |
| `fabric` | multi-line text | PDP "Fabric & care" |
| `care` | multi-line text | PDP "Fabric & care" |
| `story` | multi-line text | PDP product story |
| `model_info` | single line text | PDP "Fit & model" |
| `size_guide` | reference (metaobject/page) | Size-guide link |
| `launch_date` | date | New-drop scheduling |
| `limited_edition` | boolean | "No restocks" note |

> When you wire these, extend the Storefront product query in
> [`lib/shopify/fragments.ts`](../lib/shopify/fragments.ts) to fetch
> `metafields(identifiers: [...])` and map them in
> [`lib/shopify/transforms.ts`](../lib/shopify/transforms.ts) into
> `ProductDetails`. The types already exist ([`lib/shopify/types.ts`](../lib/shopify/types.ts)).

## Metaobjects for editorial content
Admin → **Settings → Custom data → Metaobjects**. Model your homepage sections
(hero, category blocks, brand statement, craftsmanship) as metaobjects, then read
them via the Storefront API to replace the local config in
[`lib/config/site.ts`](../lib/config/site.ts).

## Verification
- PDP accordions show your metafield content instead of placeholders.
- Fit facet reflects `tpc.fit`.

## Common failure cases
- **Metafield not returned** — definition not exposed to the **Storefront API**
  (toggle "Storefront access" on the definition).
- **Wrong namespace/key** — must match the identifiers in your query exactly.

## Security
- Read-only via the Storefront token; no secrets.

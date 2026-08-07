# Products & collections

Shopify is the **single source of truth** for products, variants, inventory and
collections. The storefront only reads them.

## Prerequisites
- Shopify connected ([shopify-setup.md](shopify-setup.md)).

## Products & variants
- Admin → **Products → Add product**.
- Set **Options** to **Size** and **Colour** so the storefront renders selectors
  and colour swatches (this app expects those option names). Every product
  should carry both, even single-colour ones.
- Add **variants** for each Size × Colour. Set price and (optional) compare-at price.
- **Media**: first image is the card/featured image; a second image powers the
  card hover swap and the gallery.
- Publish to the **Headless** and/or **Online Store** sales channel.

## Inventory
- Enable **Track quantity** per variant. Availability (`availableForSale`,
  `quantityAvailable`) drives sold-out states, low-stock messaging and the
  "Notify me" flow. Never manage inventory anywhere but Shopify.

## Product type, tags & gender
- **Product type** maps to the storefront category (e.g. `Oversized T-Shirt`,
  `Baby Tee`, `Jersey`) and to the "Fit" facet.
- **Tags** feed search and badges. Use tags like `new`, `bestseller`, `limited`
  for the card badge, and `men` / `women` for the gender facet (or use collections).

## Collections
- Admin → **Products → Collections**. Create at least: `new-drop`, `bestsellers`,
  `oversized`, `baby-tees`, `jerseys`, `men`, `women` (handles matter — they map
  to storefront routes and the mega-menu in [`lib/config/site.ts`](../lib/config/site.ts)).
- Manual or automated (smart) collections both work.

## Verification
- The homepage "New Drop"/"Bestsellers" pull from those collection handles.
- `/collections/<handle>`, `/men`, `/women` list the right products.
- Facets (size/colour/category/price/availability) populate from live data.

## Common failure cases
- **Product hidden** — not published to the sales channel.
- **No colour swatch** — the option isn't named exactly `Colour`.
- **Wrong facet** — product type / tags not set as above.

## Security
- No secrets involved here; all read-only via the Storefront token.

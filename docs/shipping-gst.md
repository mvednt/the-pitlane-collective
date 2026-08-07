# Shipping, taxes/GST, markets & currency

All configured **in Shopify** — the storefront reads prices/availability and
redirects to Shopify checkout where shipping and taxes are calculated.

## Shipping
- Admin → **Settings → Shipping and delivery**.
- Create shipping zones/rates for India (and elsewhere if you ship there).
- Optionally add free-shipping above a threshold. The storefront shows a
  free-shipping progress bar using `siteConfig.freeShippingThreshold`
  ([`lib/config/site.ts`](../lib/config/site.ts)) — keep this in sync with your
  actual Shopify rule.
- COD: configure under **Settings → Payments → Manual payment methods** and/or
  your Razorpay/COD app. `[CONFIRM COD availability and any charges]`

## Taxes & GST (India)
- Admin → **Settings → Taxes and duties**.
- Configure GST for India per your registration. `[CONFIRM GST registration, rates and HSN with your accountant]`
- Decide tax-inclusive vs exclusive pricing; the storefront displays "Taxes
  included" copy — align this with your Shopify tax setting.
- GST invoice details on orders are handled by Shopify / an invoicing app.

> The storefront does **not** compute tax or GST. Do not hard-code rates.

## Markets & currency
- Admin → **Settings → Markets**: set your primary market (India), currency (INR)
  and any additional markets.
- The storefront formats prices in INR (`en-IN`) via
  [`lib/utils.ts`](../lib/utils.ts) `formatMoney`. For multi-currency, drive the
  currency from the market/Storefront `@inContext` directive.

## Verification
- Checkout shows correct shipping options and tax for a test address.
- A test order's invoice reflects GST as configured.

## Common failure cases
- **No shipping at checkout** — address not covered by a shipping zone.
- **Wrong tax** — market/tax settings incomplete.
- **Free-ship mismatch** — storefront threshold differs from the Shopify rule.

## Security / compliance
- GST/business/legal specifics are `[CONFIG]`/`[CONFIRM]` placeholders in the app
  ([`lib/content/pages.ts`](../lib/content/pages.ts)) — fill them with reviewed
  values before launch.

# Razorpay through Shopify (recommended payments path)

This is the **default and recommended** path. Payments, orders, inventory and
transactional emails all stay inside Shopify; the storefront never touches card
data.

```
Custom storefront → Shopify cart → Shopify-hosted checkout
  → Razorpay (configured inside Shopify) → Shopify order
  → Shopify inventory update → Shopify transactional emails
```

The storefront's checkout button redirects to the cart's `checkoutUrl`
(Shopify-hosted checkout); you configure Razorpay **inside Shopify**. This is the
only payment path — there is no custom payment code in the app.

## Prerequisites
- Shopify store connected.
- A Razorpay account. `[CONFIRM eligibility, KYC, and fees with Razorpay — do not assume]`

## Steps
1. Admin → **Settings → Payments**.
2. Look for **Razorpay** as a provider/app for your region. Availability depends
   on your Shopify market and Razorpay account. `[CONFIRM in your Shopify Payments settings]`
3. Connect/authorise Razorpay and enable the payment methods you want (UPI,
   cards, netbanking, wallets — subject to your Razorpay account).
4. Configure COD separately under **Settings → Payments → Manual payment methods**
   if you offer it.

## Environment variables
None in this app — Razorpay lives entirely inside Shopify checkout.

## Verification
- Place a **test order** through the Shopify-hosted checkout.
- Confirm the order appears in Admin → **Orders**, inventory decremented, and the
  order-confirmation email was sent (Admin → **Settings → Notifications**).

## Common failure cases
- **Razorpay not listed** — region/market or account not eligible; check with
  Shopify Payments settings and Razorpay. Consider the optional custom path only
  if Shopify-managed Razorpay is genuinely unavailable.
- **Checkout doesn't redirect** — ensure live Shopify mode is on and the cart has items.

## Security
- No payment secrets in this codebase for this path. Do not add any.

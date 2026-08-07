# Domain setup

## Prerequisites
- The app deployed (see [deployment-vercel.md](deployment-vercel.md)).
- Access to your DNS provider.

## Steps
1. Add your custom domain in your host (Vercel → Project → **Settings → Domains**).
2. Point DNS per the host's instructions (usually a `CNAME`, or `A`/`ALIAS` for apex).
3. Wait for TLS to provision.

## App configuration
Set the canonical base URL so metadata, canonical tags and the sitemap use it:
```
NEXT_PUBLIC_SITE_URL=https://www.thepitlanecollective.com
```
This feeds `metadataBase`, Open Graph/Twitter URLs, `sitemap.xml`, `robots.txt`
and JSON-LD ([`lib/config/site.ts`](../lib/config/site.ts)).

## Allowed domains (register your production URL where required)
- **Shopify**: if you use the Headless channel, add your storefront domain in
  the channel settings. `[CONFIRM in Headless → settings]`
- **Analytics**: no domain allow-listing required, but set the GA4 data stream
  URL to your domain.

## Verification
- `https://<domain>/robots.txt` shows `Sitemap: https://<domain>/sitemap.xml`.
- `https://<domain>/sitemap.xml` lists absolute URLs on your domain.
- Page source `<link rel="canonical">` points to your domain.

## Common failure cases
- **Canonical/sitemap show localhost** — `NEXT_PUBLIC_SITE_URL` not set in prod.
- **Mixed content** — ensure everything is `https`.

## Security
- Force HTTPS (hosts do this by default). Secure cookies require HTTPS in prod.

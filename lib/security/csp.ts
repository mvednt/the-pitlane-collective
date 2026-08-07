/**
 * Content Security Policy builder.
 *
 * Scripts use a per-request nonce + `strict-dynamic` (no `'unsafe-inline'` for
 * scripts) so only our own nonced bundle — and scripts it loads (GA4, Meta
 * Pixel, Clarity) — can execute. Host allowlists cover the beacon/connect and
 * frame origins the integrations need. The policy is NOT relaxed globally to
 * ease integrations; each host is added intentionally.
 *
 * Compatible with: Shopify (cdn images; checkout is a top-level redirect),
 * GA4, Meta Pixel, and Microsoft Clarity. The policy is not relaxed globally to
 * ease integrations; each host is added intentionally.
 */
export function buildCsp(nonce: string, isDev: boolean): string {
  const analyticsConnect = [
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://www.google-analytics.com",
    "https://stats.g.doubleclick.net",
    "https://connect.facebook.net",
    "https://www.facebook.com",
    "https://*.clarity.ms",
    "https://c.bing.com",
  ];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // Styles can't execute JS; allow inline to stay compatible with Next/Tailwind
    // injected critical CSS without a per-style nonce.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": [
      "'self'",
      "blob:",
      "data:",
      "https://cdn.shopify.com",
      "https://www.google-analytics.com",
      "https://www.facebook.com",
      "https://*.clarity.ms",
    ],
    "font-src": ["'self'", "data:"],
    "connect-src": [
      "'self'",
      ...analyticsConnect,
      ...(isDev ? ["ws:", "wss:"] : []),
    ],
    "frame-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  const parts = Object.entries(directives).map(
    ([k, v]) => `${k} ${v.join(" ")}`,
  );
  parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

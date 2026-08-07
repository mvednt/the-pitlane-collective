import { NextResponse, type NextRequest } from "next/server";
import { buildCsp } from "@/lib/security/csp";

/**
 * Next.js Proxy (middleware). Generates a per-request nonce and sets a strict,
 * nonce-based Content-Security-Policy. Next automatically applies the nonce to
 * its own scripts; our analytics loader runs from nonced bundle code so
 * `strict-dynamic` lets it inject provider scripts.
 *
 * Other static security headers are set in next.config.ts. API routes and
 * static assets are excluded via the matcher.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const csp = buildCsp(nonce, isDev);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

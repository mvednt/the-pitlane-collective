import "server-only";

/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Scope: this limits per SERVER INSTANCE only. It's a sensible first line of
 * defence for a single-region deployment, but on multi-instance/serverless
 * platforms each instance keeps its own counter. For strict global limits, back
 * this with a shared store (e.g. Upstash Redis / Vercel KV) behind the same
 * `rateLimit` signature — see docs/deployment-vercel.md.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= opts.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: opts.limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}

// Occasionally evict expired buckets to bound memory.
let lastSweep = Date.now();
export function sweepIfDue() {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

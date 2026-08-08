import "server-only";
import { serverEnv } from "@/lib/env.server";

/**
 * Shopify Storefront API GraphQL client.
 *
 * Token safety:
 * - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is the **public** Storefront API token.
 *   It is designed to be used from the storefront and is safe to expose to the
 *   browser. We still keep it SERVER-ONLY here (this module imports
 *   `server-only`) so all Storefront calls run server-side — that avoids CORS,
 *   lets us add timeouts/retries, and keeps our exact query shapes private.
 * - There is NO Admin API token in this app; the storefront never needs one.
 *   Admin credentials, if ever added, MUST remain server-only and never be
 *   imported into a client component.
 *
 * API version: pinned via `SHOPIFY_API_VERSION` (defaults below).
 * See docs/shopify-setup.md → "Upgrading the API version".
 */

const DEFAULT_API_VERSION = "2025-01";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;
/**
 * Default freshness for cached Storefront reads (products/collections/search).
 * With no webhooks, time-based ISR keeps live data reasonably fresh; cart calls
 * pass `cache: "no-store"` and are unaffected.
 */
const DEFAULT_REVALIDATE_SECONDS = 300;

export function getShopifyConfig() {
  return {
    domain: serverEnv.SHOPIFY_STORE_DOMAIN,
    token: serverEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: serverEnv.SHOPIFY_API_VERSION || DEFAULT_API_VERSION,
  };
}

export function isLiveShopifyConfigured(): boolean {
  const { domain, token } = getShopifyConfig();
  return Boolean(domain && token);
}

interface ShopifyFetchOptions<TVariables> {
  query: string;
  variables?: TVariables;
  cache?: RequestCache;
  tags?: string[];
  /** Per-call revalidate seconds (ISR). Ignored when `cache: "no-store"`. */
  revalidate?: number;
}

interface ShopifyGraphQLResponse<TData> {
  data?: TData;
  errors?: Array<{ message: string }>;
  extensions?: {
    cost?: {
      throttleStatus?: {
        currentlyAvailable: number;
        maximumAvailable: number;
      };
    };
  };
}

export class ShopifyApiError extends Error {
  readonly status?: number;
  readonly retryable: boolean;
  constructor(message: string, opts: { status?: number; retryable?: boolean } = {}) {
    super(message);
    this.name = "ShopifyApiError";
    this.status = opts.status;
    this.retryable = opts.retryable ?? false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Removes duplicate GraphQL fragment definitions from a composed query.
 *
 * Our fragment constants in `fragments.ts` are self-contained: each one appends
 * the fragments it depends on. Composing overlapping fragments therefore emits
 * the same `fragment` block more than once — e.g. `ProductFragment` pulls in
 * `ProductVariantFragment`, which itself pulls in `MoneyFragment`/`ImageFragment`,
 * so those definitions appear twice. GraphQL requires fragment names to be
 * unique per document ("Fragment name ... must be unique"), so we keep the first
 * definition of each name and drop later ones. Fragment spreads (`...Name`) and
 * inline fragments (`... on Type`) are left untouched.
 */
export function dedupeFragmentDefinitions(query: string): string {
  const fragmentStart = /fragment\s+(\w+)\s+on\s+\w+\s*\{/g;
  const seen = new Set<string>();
  const removals: Array<[number, number]> = [];
  let match: RegExpExecArray | null;

  while ((match = fragmentStart.exec(query)) !== null) {
    const name = match[1];
    const blockStart = match.index;
    // Walk balanced braces from the opening `{` to find the block's end.
    let depth = 0;
    let i = query.indexOf("{", blockStart);
    for (; i < query.length; i++) {
      const ch = query[i];
      if (ch === "{") depth++;
      else if (ch === "}" && --depth === 0) {
        i++;
        break;
      }
    }
    const blockEnd = i; // exclusive
    if (seen.has(name)) {
      removals.push([blockStart, blockEnd]);
    } else {
      seen.add(name);
    }
    // Resume scanning past this block so nested content isn't re-matched.
    fragmentStart.lastIndex = blockEnd;
  }

  if (removals.length === 0) return query;

  let result = "";
  let cursor = 0;
  for (const [start, end] of removals) {
    result += query.slice(cursor, start);
    cursor = end;
  }
  return result + query.slice(cursor);
}

/** Redacts the store domain from error text so logs don't leak the shop handle. */
function redact(text: string, domain: string): string {
  return domain ? text.split(domain).join("<shop>") : text;
}

/**
 * Fetch wrapper for the Storefront API. Adds:
 * - a hard request timeout (AbortController),
 * - bounded retries with backoff for 429 (throttle) and 5xx/network errors,
 * - GraphQL error + empty-data validation,
 * - domain redaction in error messages.
 *
 * Only used by `lib/shopify/live.ts`; callers never see raw GraphQL shapes.
 */
export async function shopifyFetch<TData, TVariables = Record<string, unknown>>({
  query,
  variables,
  cache = "force-cache",
  tags,
  revalidate,
}: ShopifyFetchOptions<TVariables>): Promise<TData> {
  const { domain, token, apiVersion } = getShopifyConfig();

  if (!domain || !token) {
    throw new ShopifyApiError(
      "Shopify live mode is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    );
  }

  const document = dedupeFragmentDefinitions(query);
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
  const nextOptions =
    cache === "no-store"
      ? undefined
      : { tags, revalidate: revalidate ?? DEFAULT_REVALIDATE_SECONDS };

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query: document, variables }),
        cache,
        next: nextOptions,
        signal: controller.signal,
      });

      // Retry throttling (429) and transient upstream errors (5xx).
      if (response.status === 429 || response.status >= 500) {
        if (attempt < MAX_RETRIES) {
          const retryAfter = Number(response.headers.get("retry-after"));
          const backoff = Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : 300 * 2 ** attempt;
          await sleep(backoff);
          continue;
        }
        throw new ShopifyApiError(
          `Shopify Storefront API is unavailable (HTTP ${response.status}).`,
          { status: response.status, retryable: true },
        );
      }

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new ShopifyApiError(
          redact(
            `Shopify Storefront API request failed: ${response.status} ${response.statusText} ${body}`,
            domain,
          ),
          { status: response.status },
        );
      }

      const json = (await response.json()) as ShopifyGraphQLResponse<TData>;

      if (json.errors?.length) {
        throw new ShopifyApiError(
          redact(
            `Shopify Storefront API returned errors: ${json.errors
              .map((e) => e.message)
              .join("; ")}`,
            domain,
          ),
        );
      }

      if (!json.data) {
        throw new ShopifyApiError("Shopify Storefront API returned no data.");
      }

      return json.data;
    } catch (error) {
      lastError = error;
      // Abort (timeout) and network errors are retryable.
      const isAbort = error instanceof Error && error.name === "AbortError";
      const isShopifyRetryable =
        error instanceof ShopifyApiError && error.retryable;
      const isNetwork =
        error instanceof TypeError || isAbort;
      if ((isNetwork || isShopifyRetryable) && attempt < MAX_RETRIES) {
        await sleep(300 * 2 ** attempt);
        continue;
      }
      if (error instanceof ShopifyApiError) throw error;
      if (isAbort) {
        throw new ShopifyApiError(
          `Shopify Storefront API request timed out after ${REQUEST_TIMEOUT_MS}ms.`,
          { retryable: true },
        );
      }
      throw new ShopifyApiError(
        `Shopify Storefront API request failed: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new ShopifyApiError("Shopify Storefront API request failed.");
}

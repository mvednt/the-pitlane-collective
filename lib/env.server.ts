import "server-only";
import { z } from "zod";

/**
 * Server-only environment. Guarded by `server-only` so it never reaches the
 * client bundle. Validated once at first import.
 *
 * Shopify is the single source of truth for commerce. Mock mode needs no
 * credentials; `DATA_SOURCE=live` fails loudly if the Shopify Storefront
 * variables are missing.
 */

const optionalString = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().optional(),
);

const schema = z
  .object({
    SHOPIFY_STORE_DOMAIN: optionalString,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: optionalString,
    SHOPIFY_API_VERSION: optionalString,
    DATA_SOURCE: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(["mock", "live"]).optional(),
    ),
  })
  .superRefine((val, ctx) => {
    if (
      val.DATA_SOURCE === "live" &&
      (!val.SHOPIFY_STORE_DOMAIN || !val.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "DATA_SOURCE=live requires SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to be set.",
      });
    }
  });

function loadServerEnv() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "env"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration:\n${details}\n` +
        "See .env.local.example. Mock mode runs with no live credentials.",
    );
  }
  return parsed.data;
}

export const serverEnv = loadServerEnv();
export type ServerEnv = typeof serverEnv;

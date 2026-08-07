import "server-only";
import { serverEnv } from "@/lib/env.server";
import { isLiveShopifyConfigured } from "./client";
import { liveDataSource } from "./live";
import { mockDataSource } from "./mock";
import type { ShopifyDataSource } from "./types";

export type DataSourceMode = "mock" | "live";

/**
 * Resolves which adapter backs the storefront:
 * - `DATA_SOURCE=mock` always forces mock data (useful for demos/tests).
 * - `DATA_SOURCE=live` forces live mode and throws if credentials are missing.
 * - Otherwise, live mode is used automatically once SHOPIFY_STORE_DOMAIN and
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN are both set; mock data is the fallback.
 */
export function getDataSourceMode(): DataSourceMode {
  const forced = serverEnv.DATA_SOURCE;
  if (forced === "mock") return "mock";
  if (forced === "live") return "live";
  return isLiveShopifyConfigured() ? "live" : "mock";
}

export function getShopifyDataSource(): ShopifyDataSource {
  return getDataSourceMode() === "live" ? liveDataSource : mockDataSource;
}

export const shopify: ShopifyDataSource = {
  getProducts: (...args) => getShopifyDataSource().getProducts(...args),
  getProduct: (...args) => getShopifyDataSource().getProduct(...args),
  getRelatedProducts: (...args) =>
    getShopifyDataSource().getRelatedProducts(...args),
  predictiveSearch: (...args) =>
    getShopifyDataSource().predictiveSearch(...args),
  getCollections: (...args) => getShopifyDataSource().getCollections(...args),
  getCollection: (...args) => getShopifyDataSource().getCollection(...args),
  createCart: (...args) => getShopifyDataSource().createCart(...args),
  getCart: (...args) => getShopifyDataSource().getCart(...args),
  addCartLines: (...args) => getShopifyDataSource().addCartLines(...args),
  updateCartLines: (...args) =>
    getShopifyDataSource().updateCartLines(...args),
  removeCartLines: (...args) =>
    getShopifyDataSource().removeCartLines(...args),
};

export * from "./types";

/**
 * Normalized domain types for The Pitlane Collective storefront.
 *
 * Every page/component reads these shapes only — never raw Shopify Storefront
 * API GraphQL responses. `lib/shopify/mock.ts` and `lib/shopify/live.ts` both
 * implement `ShopifyDataSource` and return these types, so swapping the data
 * source (via env vars, see `lib/shopify/index.ts`) requires no UI changes.
 */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface SEO {
  title: string | null;
  description: string | null;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  sku: string | null;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
}

export type ProductBadge = "New" | "Bestseller" | "Limited" | "Low Stock";

/**
 * Structured attributes sourced from Shopify metafields (namespace `tpc`) in
 * live mode (spec §27). Optional so the app degrades gracefully when a product
 * has none set.
 */
export interface ProductDetails {
  fit: string | null;
  fabric: string | null;
  care: string | null;
  story: string | null;
  modelInfo: string | null;
  sizeGuideHref: string | null;
  launchDate: string | null;
  limitedEdition: boolean;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  /** e.g. ["men","women"] — derived from tags/collections in live mode. */
  gender: string[];
  badge: ProductBadge | null;
  availableForSale: boolean;
  featuredImage: Image | null;
  images: Image[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  details: ProductDetails;
  seo: SEO;
  updatedAt: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
  seo: SEO;
  updatedAt: string;
}

export interface CartLineMerchandise {
  id: string; // variant id
  title: string;
  selectedOptions: SelectedOption[];
  quantityAvailable: number | null;
  image: Image | null;
  product: {
    id: string;
    handle: string;
    title: string;
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: CartLineMerchandise;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
}

export interface PredictiveSearchResult {
  products: Product[];
  collections: Collection[];
}

export type ProductSortKey =
  | "RELEVANCE"
  | "BEST_SELLING"
  | "CREATED"
  | "PRICE"
  | "TITLE";

export interface ProductListParams {
  first?: number;
  query?: string;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  collectionHandle?: string;
  gender?: string;
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export interface CartLineUpdateInput {
  lineId: string;
  quantity: number;
}

/**
 * Contract implemented by both the mock adapter and the live Shopify
 * Storefront API adapter. Pages and server actions depend on this interface,
 * never on a concrete adapter, so `lib/shopify/index.ts` can switch
 * implementations based on environment configuration alone.
 */
export interface ShopifyDataSource {
  getProducts(params?: ProductListParams): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  getRelatedProducts(handle: string, limit?: number): Promise<Product[]>;
  predictiveSearch(query: string, limit?: number): Promise<PredictiveSearchResult>;
  getCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | null>;

  createCart(): Promise<Cart>;
  getCart(cartId: string): Promise<Cart | null>;
  addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart>;
  updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart>;
  removeCartLines(cartId: string, lineIds: string[]): Promise<Cart>;
}

import "server-only";
import { shopifyFetch } from "./client";
import {
  ADD_CART_LINES_MUTATION,
  CREATE_CART_MUTATION,
  REMOVE_CART_LINES_MUTATION,
  UPDATE_CART_LINES_MUTATION,
} from "./mutations/cart";
import { GET_CART_QUERY } from "./queries/cart";
import {
  GET_COLLECTION_BY_HANDLE_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  GET_COLLECTIONS_QUERY,
} from "./queries/collections";
import {
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_ID_BY_HANDLE_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
  GET_PRODUCTS_QUERY,
} from "./queries/products";
import { PREDICTIVE_SEARCH_QUERY } from "./queries/search";
import {
  toCart,
  toCollection,
  toProduct,
  type ShopifyCartNode,
  type ShopifyCollectionNode,
  type ShopifyProductNode,
} from "./transforms";
import type {
  Cart,
  CartLineInput,
  CartLineUpdateInput,
  Collection,
  PredictiveSearchResult,
  Product,
  ProductListParams,
  ShopifyDataSource,
} from "./types";

const DEFAULT_PAGE_SIZE = 100;

interface EdgesResponse<TNode> {
  edges: Array<{ node: TNode }>;
}

interface CartMutationPayload {
  cart: ShopifyCartNode | null;
  userErrors: Array<{ field: string[]; message: string }>;
}

function assertNoUserErrors(
  userErrors: Array<{ field: string[]; message: string }>,
  action: string,
) {
  if (userErrors.length > 0) {
    throw new Error(
      `Shopify ${action} failed: ${userErrors.map((e) => e.message).join("; ")}`,
    );
  }
}

/**
 * Narrows a product list to a gender.
 *
 * `Product.gender` is derived in `toProduct` from the Shopify tags `men`,
 * `women` and `unisex`. Applied after fetching (rather than as a Storefront
 * `query:` filter) so it behaves identically on the collection and catalog
 * paths, and matches the mock adapter's semantics. Products with no gender tag
 * match nothing — tag them in Shopify to have them appear on /men and /women.
 */
function filterByGender(products: Product[], gender?: string): Product[] {
  if (!gender) return products;
  const wanted = gender.toLowerCase();
  return products.filter((p) => p.gender.includes(wanted));
}

export const liveDataSource: ShopifyDataSource = {
  async getProducts(params: ProductListParams = {}): Promise<Product[]> {
    if (params.collectionHandle) {
      const data = await shopifyFetch<{
        collectionByHandle: {
          products: EdgesResponse<ShopifyProductNode>;
        } | null;
      }>({
        query: GET_COLLECTION_PRODUCTS_QUERY,
        variables: {
          handle: params.collectionHandle,
          first: params.first ?? DEFAULT_PAGE_SIZE,
          sortKey: params.sortKey,
          reverse: params.reverse ?? false,
        },
      });

      if (!data.collectionByHandle) return [];
      return filterByGender(
        data.collectionByHandle.products.edges.map((e) => toProduct(e.node)),
        params.gender,
      );
    }

    const data = await shopifyFetch<{
      products: EdgesResponse<ShopifyProductNode>;
    }>({
      query: GET_PRODUCTS_QUERY,
      variables: {
        first: params.first ?? DEFAULT_PAGE_SIZE,
        query: params.query,
        sortKey: params.sortKey,
        reverse: params.reverse ?? false,
      },
    });

    return filterByGender(
      data.products.edges.map((e) => toProduct(e.node)),
      params.gender,
    );
  },

  async getProduct(handle: string): Promise<Product | null> {
    const data = await shopifyFetch<{ product: ShopifyProductNode | null }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    });

    return data.product ? toProduct(data.product) : null;
  },

  async getRelatedProducts(handle: string, limit = 4): Promise<Product[]> {
    // Resolve the product id, then use Shopify's native recommendations.
    const idData = await shopifyFetch<{ product: { id: string } | null }>({
      query: GET_PRODUCT_ID_BY_HANDLE_QUERY,
      variables: { handle },
    });
    if (!idData.product) return [];

    const data = await shopifyFetch<{
      productRecommendations: ShopifyProductNode[] | null;
    }>({
      query: GET_PRODUCT_RECOMMENDATIONS_QUERY,
      variables: { productId: idData.product.id },
    });

    return (data.productRecommendations ?? [])
      .slice(0, limit)
      .map((node) => toProduct(node));
  },

  async predictiveSearch(
    query: string,
    limit = 6,
  ): Promise<PredictiveSearchResult> {
    if (!query.trim()) return { products: [], collections: [] };

    const data = await shopifyFetch<{
      predictiveSearch: {
        products: ShopifyProductNode[];
        collections: ShopifyCollectionNode[];
      };
    }>({
      query: PREDICTIVE_SEARCH_QUERY,
      variables: { query, limit },
      cache: "no-store",
    });

    return {
      products: data.predictiveSearch.products.map((node) => toProduct(node)),
      collections: data.predictiveSearch.collections.map((node) =>
        toCollection(node),
      ),
    };
  },

  async getCollections(): Promise<Collection[]> {
    const data = await shopifyFetch<{
      collections: EdgesResponse<ShopifyCollectionNode>;
    }>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first: DEFAULT_PAGE_SIZE },
    });

    return data.collections.edges.map((e) => toCollection(e.node));
  },

  async getCollection(handle: string): Promise<Collection | null> {
    const data = await shopifyFetch<{
      collectionByHandle: ShopifyCollectionNode | null;
    }>({
      query: GET_COLLECTION_BY_HANDLE_QUERY,
      variables: { handle },
    });

    return data.collectionByHandle ? toCollection(data.collectionByHandle) : null;
  },

  async createCart(): Promise<Cart> {
    const data = await shopifyFetch<{ cartCreate: CartMutationPayload }>({
      query: CREATE_CART_MUTATION,
      cache: "no-store",
    });

    const result = data.cartCreate;
    assertNoUserErrors(result.userErrors, "cartCreate");
    if (!result.cart) throw new Error("Shopify cartCreate returned no cart.");
    return toCart(result.cart);
  },

  async getCart(cartId: string): Promise<Cart | null> {
    const data = await shopifyFetch<{ cart: ShopifyCartNode | null }>({
      query: GET_CART_QUERY,
      variables: { cartId },
      cache: "no-store",
    });

    return data.cart ? toCart(data.cart) : null;
  },

  async addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
    const data = await shopifyFetch<{ cartLinesAdd: CartMutationPayload }>({
      query: ADD_CART_LINES_MUTATION,
      variables: { cartId, lines },
      cache: "no-store",
    });

    const result = data.cartLinesAdd;
    assertNoUserErrors(result.userErrors, "cartLinesAdd");
    if (!result.cart) throw new Error("Shopify cartLinesAdd returned no cart.");
    return toCart(result.cart);
  },

  async updateCartLines(
    cartId: string,
    lines: CartLineUpdateInput[],
  ): Promise<Cart> {
    const data = await shopifyFetch<{ cartLinesUpdate: CartMutationPayload }>({
      query: UPDATE_CART_LINES_MUTATION,
      variables: { cartId, lines },
      cache: "no-store",
    });

    const result = data.cartLinesUpdate;
    assertNoUserErrors(result.userErrors, "cartLinesUpdate");
    if (!result.cart)
      throw new Error("Shopify cartLinesUpdate returned no cart.");
    return toCart(result.cart);
  },

  async removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
    const data = await shopifyFetch<{ cartLinesRemove: CartMutationPayload }>({
      query: REMOVE_CART_LINES_MUTATION,
      variables: { cartId, lineIds },
      cache: "no-store",
    });

    const result = data.cartLinesRemove;
    assertNoUserErrors(result.userErrors, "cartLinesRemove");
    if (!result.cart)
      throw new Error("Shopify cartLinesRemove returned no cart.");
    return toCart(result.cart);
  },
};

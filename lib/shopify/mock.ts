import { productMatchesQuery, rankBySearchRelevance } from "@/lib/search/match";
import { mockCollections } from "./mock-data/collections";
import { mockProducts, type MockProduct } from "./mock-data/products";
import type {
  Cart,
  CartLine,
  CartLineInput,
  CartLineUpdateInput,
  Collection,
  Money,
  PredictiveSearchResult,
  Product,
  ProductListParams,
  ProductVariant,
  ShopifyDataSource,
} from "./types";

/**
 * In-memory mock adapter. Data resets on server restart — fine for local
 * development and previews. Swapped out automatically for `live.ts` once
 * SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN are set; see
 * `lib/shopify/index.ts`.
 */

const cartStore = new Map<string, Cart>();
let cartCounter = 0;

function stripMockFields(product: MockProduct): Product {
  const { collectionHandles, ...rest } = product;
  void collectionHandles;
  return rest;
}

function findVariant(variantId: string): {
  product: MockProduct;
  variant: ProductVariant;
} | null {
  for (const product of mockProducts) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

function addMoney(a: Money, b: Money): Money {
  return {
    amount: (Number(a.amount) + Number(b.amount)).toFixed(2),
    currencyCode: a.currencyCode,
  };
}

function zeroMoney(currencyCode = "USD"): Money {
  return { amount: "0.00", currencyCode };
}

function recomputeCartTotals(cart: Cart): Cart {
  const currencyCode = cart.lines[0]?.cost.totalAmount.currencyCode ?? "USD";
  const subtotalAmount = cart.lines.reduce(
    (sum, line) => addMoney(sum, line.cost.totalAmount),
    zeroMoney(currencyCode),
  );
  const totalTaxAmount = {
    amount: (Number(subtotalAmount.amount) * 0.0).toFixed(2),
    currencyCode,
  };
  const totalAmount = addMoney(subtotalAmount, totalTaxAmount);
  const totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    ...cart,
    totalQuantity,
    cost: { subtotalAmount, totalAmount, totalTaxAmount },
  };
}

function buildLine(
  lineId: string,
  product: MockProduct,
  variant: ProductVariant,
  quantity: number,
): CartLine {
  return {
    id: lineId,
    quantity,
    cost: {
      totalAmount: {
        amount: (Number(variant.price.amount) * quantity).toFixed(2),
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      quantityAvailable: variant.quantityAvailable,
      image: variant.image ?? product.featuredImage,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
      },
    },
  };
}

/** Clamp a requested quantity to the variant's available stock (if tracked). */
function clampQuantity(variant: ProductVariant, requested: number): number {
  if (variant.quantityAvailable === null) return Math.max(0, requested);
  return Math.max(0, Math.min(requested, variant.quantityAvailable));
}

export const mockDataSource: ShopifyDataSource = {
  async getProducts(params: ProductListParams = {}): Promise<Product[]> {
    let results = [...mockProducts];

    if (params.collectionHandle) {
      results = results.filter((p) =>
        p.collectionHandles.includes(params.collectionHandle as string),
      );
    }

    if (params.gender) {
      const gender = params.gender.toLowerCase();
      results = results.filter((p) => p.gender.includes(gender));
    }

    if (params.query) {
      results = results.filter((p) => productMatchesQuery(p, params.query!));
    }

    const sortKey = params.sortKey ?? "RELEVANCE";
    if (sortKey === "PRICE") {
      results.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount),
      );
    } else if (sortKey === "TITLE") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortKey === "CREATED") {
      results.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }
    if (params.reverse) results.reverse();
    if (params.first) results = results.slice(0, params.first);

    return results.map(stripMockFields);
  },

  async getProduct(handle: string): Promise<Product | null> {
    const product = mockProducts.find((p) => p.handle === handle);
    return product ? stripMockFields(product) : null;
  },

  async getRelatedProducts(handle: string, limit = 4): Promise<Product[]> {
    const current = mockProducts.find((p) => p.handle === handle);
    if (!current) return [];

    // Prefer products sharing a collection, then same productType; exclude self.
    const scored = mockProducts
      .filter((p) => p.handle !== handle)
      .map((p) => {
        const sharedCollections = p.collectionHandles.filter((c) =>
          current.collectionHandles.includes(c),
        ).length;
        const sameType = p.productType === current.productType ? 1 : 0;
        return { product: p, score: sharedCollections * 2 + sameType };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => stripMockFields(s.product));
  },

  async predictiveSearch(
    query: string,
    limit = 6,
  ): Promise<PredictiveSearchResult> {
    const trimmed = query.trim();
    if (!trimmed) return { products: [], collections: [] };

    const matched = mockProducts.filter((p) => productMatchesQuery(p, trimmed));
    const products = rankBySearchRelevance(
      matched.map(stripMockFields),
      trimmed,
    ).slice(0, limit);

    const q = trimmed.toLowerCase();
    const collections = mockCollections
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      )
      .slice(0, 4);

    return { products, collections };
  },

  async getCollections(): Promise<Collection[]> {
    return [...mockCollections];
  },

  async getCollection(handle: string): Promise<Collection | null> {
    return mockCollections.find((c) => c.handle === handle) ?? null;
  },

  async createCart(): Promise<Cart> {
    cartCounter += 1;
    const cart: Cart = {
      id: `gid://mock/Cart/${cartCounter}-${Date.now()}`,
      checkoutUrl: "/cart",
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: zeroMoney(),
        totalAmount: zeroMoney(),
        totalTaxAmount: zeroMoney(),
      },
    };
    cartStore.set(cart.id, cart);
    return cart;
  },

  async getCart(cartId: string): Promise<Cart | null> {
    return cartStore.get(cartId) ?? null;
  },

  async addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
    const cart = cartStore.get(cartId);
    if (!cart) throw new Error(`Mock cart not found: ${cartId}`);

    for (const input of lines) {
      const found = findVariant(input.merchandiseId);
      if (!found) throw new Error(`Unknown variant: ${input.merchandiseId}`);
      const { product, variant } = found;

      if (!variant.availableForSale) {
        throw new Error(`This variant is sold out.`);
      }

      const existing = cart.lines.find(
        (l) => l.merchandise.id === variant.id,
      );
      if (existing) {
        const newQuantity = clampQuantity(
          variant,
          existing.quantity + input.quantity,
        );
        const updated = buildLine(existing.id, product, variant, newQuantity);
        cart.lines = cart.lines.map((l) =>
          l.id === existing.id ? updated : l,
        );
      } else {
        const lineId = `gid://mock/CartLine/${variant.id}`;
        const quantity = clampQuantity(variant, input.quantity);
        cart.lines.push(buildLine(lineId, product, variant, quantity));
      }
    }

    const updatedCart = recomputeCartTotals(cart);
    cartStore.set(cartId, updatedCart);
    return updatedCart;
  },

  async updateCartLines(
    cartId: string,
    lines: CartLineUpdateInput[],
  ): Promise<Cart> {
    const cart = cartStore.get(cartId);
    if (!cart) throw new Error(`Mock cart not found: ${cartId}`);

    for (const update of lines) {
      const existing = cart.lines.find((l) => l.id === update.lineId);
      if (!existing) continue;

      if (update.quantity <= 0) {
        cart.lines = cart.lines.filter((l) => l.id !== update.lineId);
        continue;
      }

      const found = findVariant(existing.merchandise.id);
      if (!found) continue;
      const { product, variant } = found;
      const quantity = clampQuantity(variant, update.quantity);
      const updatedLine = buildLine(existing.id, product, variant, quantity);
      cart.lines = cart.lines.map((l) =>
        l.id === existing.id ? updatedLine : l,
      );
    }

    const updatedCart = recomputeCartTotals(cart);
    cartStore.set(cartId, updatedCart);
    return updatedCart;
  },

  async removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
    const cart = cartStore.get(cartId);
    if (!cart) throw new Error(`Mock cart not found: ${cartId}`);

    cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id));

    const updatedCart = recomputeCartTotals(cart);
    cartStore.set(cartId, updatedCart);
    return updatedCart;
  },
};

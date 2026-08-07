import type {
  Cart,
  CartLine,
  Collection,
  Image,
  Money,
  Product,
  ProductVariant,
  SEO,
} from "./types";

/**
 * Reshapes raw Shopify Storefront API GraphQL nodes (edges/node connections,
 * nullable fields) into the normalized types the rest of the app consumes.
 * These input types describe only the fields selected in `lib/shopify/fragments.ts`.
 */

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

interface ShopifySeo {
  title: string | null;
  description: string | null;
}

interface ShopifyEdges<TNode> {
  edges: Array<{ node: TNode }>;
}

interface ShopifyProductVariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  sku: string | null;
  selectedOptions: Array<{ name: string; value: string }>;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image: ShopifyImage | null;
}

export interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  updatedAt: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyEdges<ShopifyImage>;
  options: Array<{ id: string; name: string; values: string[] }>;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: ShopifyEdges<ShopifyProductVariantNode>;
  seo: ShopifySeo;
}

export interface ShopifyCollectionNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  updatedAt: string;
  image: ShopifyImage | null;
  seo: ShopifySeo;
}

interface ShopifyCartLineNode {
  id: string;
  quantity: number;
  cost: { totalAmount: ShopifyMoney };
  merchandise: {
    id: string;
    title: string;
    quantityAvailable: number | null;
    selectedOptions: Array<{ name: string; value: string }>;
    image: ShopifyImage | null;
    product: { id: string; handle: string; title: string };
  };
}

export interface ShopifyCartNode {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
  };
  lines: ShopifyEdges<ShopifyCartLineNode>;
}

function toMoney(money: ShopifyMoney): Money {
  return { amount: money.amount, currencyCode: money.currencyCode };
}

function toImage(image: ShopifyImage | null): Image | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText,
    width: image.width ?? 0,
    height: image.height ?? 0,
  };
}

function toSeo(seo: ShopifySeo | null | undefined): SEO {
  return { title: seo?.title ?? null, description: seo?.description ?? null };
}

function toVariant(node: ShopifyProductVariantNode): ProductVariant {
  return {
    id: node.id,
    title: node.title,
    availableForSale: node.availableForSale,
    quantityAvailable: node.quantityAvailable,
    sku: node.sku,
    selectedOptions: node.selectedOptions,
    price: toMoney(node.price),
    compareAtPrice: node.compareAtPrice ? toMoney(node.compareAtPrice) : null,
    image: toImage(node.image),
  };
}

const GENDER_TAGS = ["men", "women", "unisex"];

export function toProduct(node: ShopifyProductNode): Product {
  const lowerTags = node.tags.map((t) => t.toLowerCase());
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    productType: node.productType ?? "",
    vendor: node.vendor,
    tags: node.tags,
    gender: GENDER_TAGS.filter((g) => lowerTags.includes(g)),
    // Badge/metafields are wired from Shopify metafields in a later phase.
    badge: null,
    availableForSale: node.availableForSale,
    featuredImage: toImage(node.featuredImage),
    images: node.images.edges.map((e) => toImage(e.node)).filter(
      (i): i is Image => i !== null,
    ),
    options: node.options,
    variants: node.variants.edges.map((e) => toVariant(e.node)),
    priceRange: {
      minVariantPrice: toMoney(node.priceRange.minVariantPrice),
      maxVariantPrice: toMoney(node.priceRange.maxVariantPrice),
    },
    details: {
      fit: null,
      fabric: null,
      care: null,
      story: null,
      modelInfo: null,
      sizeGuideHref: null,
      launchDate: null,
      limitedEdition: false,
    },
    seo: toSeo(node.seo),
    updatedAt: node.updatedAt,
  };
}

export function toCollection(node: ShopifyCollectionNode): Collection {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    image: toImage(node.image),
    seo: toSeo(node.seo),
    updatedAt: node.updatedAt,
  };
}

function toCartLine(node: ShopifyCartLineNode): CartLine {
  return {
    id: node.id,
    quantity: node.quantity,
    cost: { totalAmount: toMoney(node.cost.totalAmount) },
    merchandise: {
      id: node.merchandise.id,
      title: node.merchandise.title,
      selectedOptions: node.merchandise.selectedOptions,
      quantityAvailable: node.merchandise.quantityAvailable,
      image: toImage(node.merchandise.image),
      product: node.merchandise.product,
    },
  };
}

export function toCart(node: ShopifyCartNode): Cart {
  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    lines: node.lines.edges.map((e) => toCartLine(e.node)),
    cost: {
      subtotalAmount: toMoney(node.cost.subtotalAmount),
      totalAmount: toMoney(node.cost.totalAmount),
      totalTaxAmount: node.cost.totalTaxAmount
        ? toMoney(node.cost.totalTaxAmount)
        : null,
    },
  };
}

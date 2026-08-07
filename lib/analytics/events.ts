/**
 * Typed analytics event catalogue for The Pitlane Collective.
 *
 * PII policy: none of these payloads carry email, phone, full address, or other
 * personal data — only product/UI identifiers and non-identifying values. The
 * dispatch layer (`lib/analytics/client.ts`) additionally strips undefined
 * values before sending.
 *
 * Sourcing:
 * - All events below are fired CLIENT-SIDE from the storefront UI.
 * - `purchase` is intentionally NOT client-fired. With Shopify-hosted checkout
 *   the reliable purchase signal comes from Shopify's own analytics / Order
 *   webhooks (server-side). Firing it from the client would be inaccurate, so
 *   it's omitted here and documented for a future server/webhook integration.
 * - `begin_checkout` fires client-side when the shopper proceeds to checkout.
 */

export interface AnalyticsEventMap {
  page_view: { path: string };
  view_home: Record<string, never>;
  view_collection: { handle: string; title: string };
  view_item: {
    id: string;
    handle: string;
    title: string;
    price?: number;
    currency?: string;
    category?: string;
  };
  search: { query: string; results?: number };
  select_item: { id: string; handle: string; title: string };
  select_size: { handle: string; size: string };
  select_colour: { handle: string; colour: string };
  add_to_cart: {
    id: string;
    title: string;
    price?: number;
    currency?: string;
    quantity: number;
  };
  remove_from_cart: { id: string; title?: string };
  view_cart: { value?: number; currency?: string; items?: number };
  begin_checkout: { value?: number; currency?: string; items?: number };
  add_to_wishlist: { handle: string; title?: string };
  remove_from_wishlist: { handle: string };
  newsletter_signup: Record<string, never>;
  filter_applied: { type: string; value: string };
  sort_changed: { sort: string };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEvent = {
  [K in AnalyticsEventName]: { name: K; params: AnalyticsEventMap[K] };
}[AnalyticsEventName];

/**
 * Maps our event names to Meta Pixel standard events where one exists; other
 * events are sent to Pixel as custom events (trackCustom).
 */
export const META_STANDARD_EVENTS: Partial<Record<AnalyticsEventName, string>> = {
  page_view: "PageView",
  view_item: "ViewContent",
  search: "Search",
  add_to_cart: "AddToCart",
  add_to_wishlist: "AddToWishlist",
  begin_checkout: "InitiateCheckout",
};

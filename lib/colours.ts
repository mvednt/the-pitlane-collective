/**
 * Approximate hex values for the mock colour option names, used only to render
 * small swatches in the filter UI. In live mode, colour swatches would come
 * from a Shopify colour metafield/metaobject rather than this lookup.
 */
const COLOUR_HEX: Record<string, string> = {
  Silver: "#C7CBD1",
  Black: "#111111",
  White: "#F4F1EA",
  Cream: "#EAE3D6",
  "Rosso Red": "#B11414",
  "Racing Red": "#C81414",
  Papaya: "#FF8000",
  "Racing Green": "#154734",
  Midnight: "#1A1A2E",
  Maroon: "#6E1414",
  "Steel Blue": "#3A5A78",
  Graphite: "#2B2B2E",
  Charcoal: "#333338",
  "Black/White": "#555555",
  Green: "#1F7A4D",
};

export function colourHex(name: string): string {
  return COLOUR_HEX[name] ?? "#9A9A9F";
}

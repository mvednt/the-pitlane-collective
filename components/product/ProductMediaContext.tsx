"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/**
 * Bridges the two halves of the product page: the purchase column (which owns
 * variant selection) publishes the selected variant's image URL here, and the
 * gallery — a sibling in a separate grid column — subscribes so it can jump to
 * that image when the shopper switches colour.
 *
 * Kept as context rather than lifting the whole layout into one client
 * component so the page's server-rendered structure stays intact.
 */
interface ProductMediaValue {
  activeImageUrl: string | null;
  setActiveImageUrl: (url: string | null) => void;
}

const ProductMediaContext = createContext<ProductMediaValue | null>(null);

export function ProductMediaProvider({ children }: { children: ReactNode }) {
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  return (
    <ProductMediaContext.Provider value={{ activeImageUrl, setActiveImageUrl }}>
      {children}
    </ProductMediaContext.Provider>
  );
}

/** Optional — returns null outside a provider so components stay usable alone. */
export function useProductMedia(): ProductMediaValue | null {
  return useContext(ProductMediaContext);
}

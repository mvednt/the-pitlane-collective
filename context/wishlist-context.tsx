"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { track } from "@/lib/analytics/client";

/**
 * Wishlist stores only Shopify references (product id + handle) — never product
 * or inventory data, which stays the source of truth in Shopify. The wishlist
 * page re-fetches fresh product data for these handles. Persisted in
 * localStorage only (device-local); no server persistence.
 */

export interface WishlistItem {
  productId: string;
  handle: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  hydrated: boolean;
  has: (handle: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (handle: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const KEY = "tpc:wishlist";

function read(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: WishlistItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore quota / privacy-mode failures
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  // `null` until hydrated from localStorage after mount (avoids SSR mismatch).
  const [stored, setStored] = useState<WishlistItem[] | null>(null);
  const items = stored ?? [];
  const hydrated = stored !== null;

  useEffect(() => {
    // localStorage is only available after mount — a legitimate effect read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(read());
  }, []);

  // Persist once hydrated.
  useEffect(() => {
    if (stored === null) return;
    write(stored);
  }, [stored]);

  // Sync across tabs (setState here runs from an event, not the effect body).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setStored(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function has(handle: string) {
    return items.some((i) => i.handle === handle);
  }

  function toggle(item: WishlistItem) {
    setStored((prev) => {
      const list = prev ?? [];
      if (list.some((i) => i.handle === item.handle)) {
        track("remove_from_wishlist", { handle: item.handle });
        return list.filter((i) => i.handle !== item.handle);
      }
      track("add_to_wishlist", { handle: item.handle });
      return [item, ...list];
    });
  }

  function remove(handle: string) {
    track("remove_from_wishlist", { handle });
    setStored((prev) => (prev ?? []).filter((i) => i.handle !== handle));
  }

  return (
    <WishlistContext.Provider
      value={{ items, count: items.length, hydrated, has, toggle, remove }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}

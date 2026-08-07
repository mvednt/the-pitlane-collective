/**
 * Recent search terms, persisted client-side in localStorage. Pure UX state —
 * never touches Shopify. Device-local only.
 */
const KEY = "tpc:recent-searches";
const MAX = 6;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(term: string): string[] {
  if (typeof window === "undefined") return [];
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();
  const existing = getRecentSearches().filter(
    (t) => t.toLowerCase() !== trimmed.toLowerCase(),
  );
  const next = [trimmed, ...existing].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota / privacy-mode failures
  }
  return next;
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

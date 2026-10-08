/**
 * A small localStorage-backed cache for data fetched from an API, so repeat
 * visits (or navigating between pages that render the same data — like the
 * tutoring schedule, which sits on both the home page and the tutoring page)
 * don't re-fetch when a recent copy is already on hand. Every key is
 * namespaced so it can't collide with anything else the site keeps in
 * localStorage (like the sign-in session token).
 */

const PREFIX = "ieee-utd-cache:";

interface CacheEntry<T> {
  value: T;
  fetchedAt: number;
}

/** Reads a cached value if it exists and is younger than maxAgeMs. */
export function readCache<T>(key: string, maxAgeMs: number): T | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.fetchedAt > maxAgeMs) return null;
    return entry.value;
  } catch {
    // Private browsing, storage disabled, a corrupted entry, etc. — the
    // cache is an optimization, not a requirement, so just skip it rather
    // than breaking the page over it.
    return null;
  }
}

/** Writes a value to the cache, timestamped now. */
export function writeCache<T>(key: string, value: T): void {
  try {
    const entry: CacheEntry<T> = { value, fetchedAt: Date.now() };
    window.localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // Quota exceeded, storage disabled, etc. — safe to ignore.
  }
}

/** Removes one cached entry (used to force a fresh fetch on manual retry). */
export function clearCache(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

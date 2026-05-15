/**
 * Lightweight client-side cache with stale-while-revalidate semantics.
 *
 * Backed by sessionStorage so it survives page navigation inside the admin
 * shell but resets when the tab is closed. Used by /admin/service-area to
 * make the tree + area lists feel instant — first render reads cached data
 * synchronously, then a background refetch updates if the cache is stale.
 *
 * Not a general-purpose cache. Errors are swallowed so a quota-exceeded or
 * disabled storage never breaks the page.
 */

const NS = 'kyg:cache:';
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

type Entry<T> = {
  data: T;
  at: number; // ms epoch when written
  ttl: number; // ms — how long until stale
};

function full(key: string): string {
  return NS + key;
}

export function read<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(full(key));
    if (!raw) return null;
    const entry = JSON.parse(raw) as Entry<T>;
    return entry.data;
  } catch {
    return null;
  }
}

export function isStale(key: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = sessionStorage.getItem(full(key));
    if (!raw) return true;
    const entry = JSON.parse(raw) as Entry<unknown>;
    return Date.now() - entry.at >= entry.ttl;
  } catch {
    return true;
  }
}

export function write<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: Entry<T> = { data, at: Date.now(), ttl: ttlMs };
    sessionStorage.setItem(full(key), JSON.stringify(entry));
  } catch {
    // Quota exceeded or storage disabled — silently ignore. Caller falls
    // back to a fresh fetch and the UI still works, just slower.
  }
}

export function remove(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(full(key));
  } catch {
    /* ignore */
  }
}

/**
 * Removes every cached entry whose key starts with `prefix`. Used by
 * mutation handlers to invalidate a family of related entries.
 *   clearPrefix('sa:areas:Delhi|') → drops every cached area list under Delhi
 *   clearPrefix('sa:')              → drops every service-area cache entry
 */
export function clearPrefix(prefix: string): void {
  if (typeof window === 'undefined') return;
  const fullPrefix = full(prefix);
  try {
    // Collect keys first; mutating sessionStorage while iterating is undefined.
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(fullPrefix)) keys.push(k);
    }
    for (const k of keys) sessionStorage.removeItem(k);
  } catch {
    /* ignore */
  }
}

/**
 * Wipes the entire cache namespace. Used by the admin "Refresh" button when
 * the operator wants to force a clean slate.
 */
export function clearAll(): void {
  clearPrefix('');
}

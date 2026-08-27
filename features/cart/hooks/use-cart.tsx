'use client';

// =============================================================================
// features/cart - the browser-side basket
// -----------------------------------------------------------------------------
// Holds slugs + quantities in localStorage and asks the server what they cost.
// It never computes money itself: every total on screen comes back from
// POST /api/cart, which is the same priceCart() the checkout route bills with.
//
// The basket lives in a MODULE-LEVEL STORE read through useSyncExternalStore,
// not in component state. Three reasons:
//   - localStorage cannot be read during SSR, and useSyncExternalStore's
//     server snapshot gives us a defined "empty" first paint with no hydration
//     mismatch and no setState-in-effect.
//   - Every <CartLink/> and cart page shares one source of truth.
//   - The `storage` event makes the cart follow the user across tabs.
//
// Two things stay authoritative on the server: the server's answer rewrites
// local quantities if it clamps to stock or drops a de-listed test, so the
// basket can never drift back into asking for something that is gone.
// =============================================================================

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import type { CartLineInput, PricedCart } from '../types';

const STORAGE_KEY = 'kyg_cart_v1';

/**
 * The last server-priced cart, kept so the basket can paint before the network
 * answers. Separate key from the cart itself: the cart is what we ASK for and
 * must survive anything, while this is a disposable convenience that can be
 * dropped whenever it stops matching.
 */
const PRICED_CACHE_KEY = 'kyg_cart_priced_v1';

/**
 * How long a cached price may be shown before it is treated as too old to paint.
 *
 * Twenty minutes is well inside the window where a catalogue price is unlikely
 * to have moved, and it is only ever DISPLAYED - the server reprices every time
 * and checkout refuses to submit a cached total, so the cost of being wrong here
 * is a number that corrects itself a second later, not a wrong charge.
 */
const PRICED_CACHE_TTL_MS = 20 * 60 * 1000;

/** Wait this long after the last edit before re-pricing, so holding "+" is one call. */
const REPRICE_DEBOUNCE_MS = 250;

interface CachedPrice {
  at: number;
  /** The exact request this was the answer to. */
  lines: CartLineInput[];
  couponCode: string | null;
  cart: PricedCart;
}

/**
 * Reads the cache, and returns it only if it still answers the question being
 * asked. A cached price for a different basket is worse than no price - it would
 * show someone the cost of a cart they no longer have.
 */
function readPricedCache(lines: CartLineInput[], couponCode: string | null): PricedCart | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PRICED_CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<CachedPrice>;
    if (!c?.cart || !Array.isArray(c.lines) || typeof c.at !== 'number') return null;
    if (Date.now() - c.at > PRICED_CACHE_TTL_MS) return null;
    if ((c.couponCode ?? null) !== couponCode) return null;
    if (!sameLines(c.lines, lines)) return null;
    return c.cart;
  } catch {
    return null;
  }
}

function writePricedCache(lines: CartLineInput[], couponCode: string | null, cart: PricedCart): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedPrice = { at: Date.now(), lines, couponCode, cart };
    window.localStorage.setItem(PRICED_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // A full or blocked storage must never break the basket. The cache is an
    // optimisation; losing it costs a spinner, not a sale.
  }
}

function clearPricedCache(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PRICED_CACHE_KEY);
  } catch {
    /* see above */
  }
}

interface StoredCart {
  lines: CartLineInput[];
  couponCode: string | null;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

/** Frozen so the server snapshot is referentially stable across renders. */
const EMPTY: StoredCart = Object.freeze({ lines: [] as CartLineInput[], couponCode: null });

let state: StoredCart = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function parse(raw: string | null): StoredCart {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredCart>;
    const lines = Array.isArray(parsed.lines)
      ? parsed.lines
          .filter((l): l is CartLineInput => typeof l?.slug === 'string' && Number.isFinite(l?.quantity))
          .map((l) => ({ slug: l.slug, quantity: Math.max(1, Math.floor(l.quantity)) }))
      : [];
    return { lines, couponCode: typeof parsed.couponCode === 'string' ? parsed.couponCode : null };
  } catch {
    // A corrupt cart must never break the site - start fresh.
    return EMPTY;
  }
}

/**
 * Called during client render. Must return a STABLE reference between writes,
 * or useSyncExternalStore re-renders forever - hence the `loaded` latch and the
 * cached `state`.
 */
function getSnapshot(): StoredCart {
  if (!loaded) {
    state = parse(typeof window === 'undefined' ? null : window.localStorage.getItem(STORAGE_KEY));
    loaded = true;
  }
  return state;
}

function getServerSnapshot(): StoredCart {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function write(next: StoredCart) {
  state = next;
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / quota. The in-memory cart still works for this session.
  }
  emit();
}

/** Another tab changed the cart - adopt it. */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    state = parse(e.newValue);
    loaded = true;
    emit();
  });
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CartContextValue {
  /** What the browser is asking for. Use `priced.lines` to render money. */
  lines: CartLineInput[];
  /** Server verdict: prices, totals, rejections. Null until the first response. */
  priced: PricedCart | null;
  /** False during SSR and hydration - render skeletons, not "empty". */
  hydrated: boolean;
  pricing: boolean;
  /**
   * True when `priced` came from the local cache and the server has not yet
   * confirmed it. Fine to render; NOT fine to charge. Checkout must wait for
   * this to clear before it will submit.
   */
  stale: boolean;
  couponCode: string | null;

  itemCount: number;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  applyCoupon: (code: string | null) => void;
  /**
   * REPLACE the basket with exactly these reports, one of each.
   *
   * This is what the kit configurator commits: the page is a set of tick boxes,
   * so unticking one there must remove it here. Appending (`add`) would leave
   * behind reports the customer had just deselected.
   */
  setSelection: (slugs: string[]) => void;

  /**
   * ADD these reports to whatever is already in the basket, one of each.
   *
   * The counterpart to `setSelection`. Used by the configurator's "Add to cart",
   * where the label promises addition and silently discarding a basket the
   * customer built earlier would be a bug.
   *
   * Merging is also the honest model for this product: one kit, one sample, and
   * every ticked report is read from that same sample. There is no such thing as
   * buying one report "separately", so a union is what the physical thing does.
   */
  addSelection: (slugs: string[]) => void;

  /* ---- drawer ----------------------------------------------------------
     The slide-over basket. Kept on the cart context rather than in its own
     provider because everything that opens it (the header button, "Add to
     cart") already consumes this hook, and a second provider would have to be
     mounted in exactly the same place for no gain. */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Same slug set and same quantities, order-insensitive. */
function sameLines(a: CartLineInput[], b: CartLineInput[]): boolean {
  if (a.length !== b.length) return false;
  const map = new Map(a.map((l) => [l.slug, l.quantity]));
  return b.every((l) => map.get(l.slug) === l.quantity);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const { lines, couponCode } = stored;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pricedRaw, setPricedRaw] = useState<PricedCart | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  // Warnings are toasted once per pricing round, not once per render.
  const lastNoticeRef = useRef('');

  useEffect(() => {
    if (!hydrated || lines.length === 0) {
      abortRef.current?.abort();
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lines, couponCode }),
          signal: controller.signal,
        });
        const json = (await res.json()) as { ok: boolean; data?: PricedCart; error?: string };
        if (!json.ok || !json.data) throw new Error(json.error ?? 'Could not price your cart');

        const cart = json.data;
        setPricedRaw(cart);
        writePricedCache(lines, couponCode, cart);

        // Tell the user once about anything the server changed, then reconcile
        // local state so the next round does not re-ask for it.
        const notices = [...cart.rejected.map((r) => r.message), ...cart.adjusted.map((a) => a.message)];
        const key = notices.join('|');
        if (notices.length > 0 && key !== lastNoticeRef.current) {
          lastNoticeRef.current = key;
          for (const message of notices) toast.warning(message);
        }
        if (notices.length === 0) lastNoticeRef.current = '';

        const authoritative = cart.lines.map((l) => ({ slug: l.slug, quantity: l.quantity }));
        if (!sameLines(lines, authoritative)) write({ lines: authoritative, couponCode });
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        toast.error(err instanceof Error ? err.message : 'Could not price your cart');
      }
    }, REPRICE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [lines, couponCode, hydrated]);

  /**
   * The last priced answer for THIS basket, if the browser still has one.
   *
   * Derived during render rather than loaded in an effect: an effect that seeds
   * state is a second render before paint - which is both what
   * react-hooks/set-state-in-effect exists to stop and, here, exactly the
   * flicker the cache is meant to remove. Reading localStorage is a pure read,
   * and `hydrated` guarantees there is a window to read from.
   */
  const cachedFallback =
    hydrated && lines.length > 0 && pricedRaw === null ? readPricedCache(lines, couponCode) : null;

  /** A cached price is on screen and the server has not confirmed it yet. */
  const stale = pricedRaw === null && cachedFallback !== null;

  const effectivePriced = pricedRaw ?? cachedFallback;

  const pricedDescribesLines =
    effectivePriced !== null &&
    sameLines(
      lines,
      effectivePriced.lines.map((l) => ({ slug: l.slug, quantity: l.quantity }))
    );


  // Derived, not stored: an emptied cart has no prices, and deriving avoids a
  // synchronous setState inside the effect above.
  const priced = lines.length === 0 ? null : effectivePriced;

  /**
   * Show a skeleton only when there is nothing that describes this basket.
   *
   * `priced === null` used to mean two different things and every cart surface
   * read it as the wrong one: null for a genuinely empty cart, and null again on
   * every mount before the first price returned - so a full basket rendered
   * "Your cart is empty" beside a header badge showing the real count.
   *
   * `lines` is read from storage synchronously at hydration, so it knows the
   * cart is not empty well before any price does.
   */
  // WHAT WE HOLD DESCRIBES THE BASKET WE HAVE. That is the only question a
  // skeleton should answer, and it is not the same as "a request is in flight".
  //
  // Keying on `pricing` was fine when the only price we could ever have was a
  // fresh one. With a cache, a background refresh of a basket we can already
  // draw would flip `pricing` true and snap the skeleton back over content the
  // customer was mid-read of - a worse flicker than the wait it replaced.
  //
  // Comparing the lines instead gets both cases right: a cache hit matches and
  // renders immediately, and an added item does not match, so it waits rather
  // than showing a total for a basket that no longer exists.
  // There is deliberately no separate in-flight flag any more. One existed and
  // fed this, which meant a background refresh of a basket already on screen
  // snapped the skeleton back over content mid-read. Whether a request is open
  // is not the question; whether we can draw the basket is.
  const awaitingPrice = hydrated && lines.length > 0 && !pricedDescribesLines;

  const add = useCallback((slug: string, quantity = 1) => {
    const current = getSnapshot();
    const existing = current.lines.find((l) => l.slug === slug);
    write({
      ...current,
      lines: existing
        ? current.lines.map((l) => (l.slug === slug ? { ...l, quantity: l.quantity + quantity } : l))
        : [...current.lines, { slug, quantity }],
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const current = getSnapshot();
    write({
      ...current,
      lines:
        quantity < 1
          ? current.lines.filter((l) => l.slug !== slug)
          : current.lines.map((l) => (l.slug === slug ? { ...l, quantity } : l)),
    });
  }, []);

  const remove = useCallback((slug: string) => {
    const current = getSnapshot();
    write({ ...current, lines: current.lines.filter((l) => l.slug !== slug) });
  }, []);

  const clear = useCallback(() => {
    write({ lines: [], couponCode: null });
    setPricedRaw(null);
    // The cache outlives the cart unless it is told not to. Leaving it would let
    // a paid-for basket reappear, priced, the next time this browser opened one.
    clearPricedCache();
  }, []);

  const setSelection = useCallback((slugs: string[]) => {
    const current = getSnapshot();
    // Dedupe but keep the order the customer ticked them in.
    const unique = [...new Set(slugs)];
    write({ ...current, lines: unique.map((slug) => ({ slug, quantity: 1 })) });
  }, []);

  const addSelection = useCallback((slugs: string[]) => {
    const current = getSnapshot();
    const have = new Set(current.lines.map((l) => l.slug));
    // Only genuinely new slugs are appended: re-adding a report that is already
    // on the kit must not bump it to quantity 2. One kit reads each report once.
    const fresh = [...new Set(slugs)].filter((slug) => !have.has(slug));
    if (fresh.length === 0) return;
    write({ ...current, lines: [...current.lines, ...fresh.map((slug) => ({ slug, quantity: 1 }))] });
  }, []);

  const applyCoupon = useCallback((code: string | null) => {
    const current = getSnapshot();
    write({ ...current, couponCode: code ? code.trim().toUpperCase() : null });
  }, []);

  // Before the first server response, fall back to the local count so the header
  // badge updates the instant something is added.
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const itemCount = priced?.itemCount ?? lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        priced,
        pricing: awaitingPrice,
        stale,
        hydrated,
        couponCode,
        itemCount,
        add,
        setQuantity,
        remove,
        clear,
        applyCoupon,
        setSelection,
        addSelection,
        drawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider> (mounted in components/Providers.tsx)');
  return ctx;
}

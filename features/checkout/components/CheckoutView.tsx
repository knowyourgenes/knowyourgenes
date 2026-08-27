'use client';

// =============================================================================
// features/checkout - the pay screen
// -----------------------------------------------------------------------------
// One page, three blocks: address, (optional) collection slot, summary + pay.
// Not a wizard - every field is on screen at once, because a checkout that
// hides the total behind a "next" button is a checkout people abandon.
//
// The money shown here is whatever POST /api/cart returned. The Pay button then
// posts SLUGS AND QUANTITIES to /api/checkout, which re-prices from the database
// and refuses with 409 if anything moved. So the worst case is "your cart
// changed, look again" - never a silent charge of a different amount.
// =============================================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatPaise } from '@/lib/catalog';
import { useCart } from '@/features/cart/hooks/use-cart';
import type { PricedCart } from '@/features/cart/types';
import { AddressFields, EMPTY_ADDRESS, type AddressDraft } from './AddressFields';

const CARD = 'rounded-sm border border-zeus/[0.09] bg-white shadow-kyg-card';
const SLOT_WINDOWS = [
  { value: 'MORNING', label: 'Morning · 8AM–12PM' },
  { value: 'AFTERNOON', label: 'Afternoon · 12PM–4PM' },
  { value: 'EVENING', label: 'Evening · 4PM–7PM' },
] as const;

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  area: string;
  city: string;
  pincode: string;
  landmark: string | null;
  isDefault: boolean;
}

interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
  total: number;
  razorpay: { keyId: string; orderId: string; amount: number; currency: string; mock: boolean };
}

/** Injects Razorpay's checkout.js once, on demand. */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ('Razorpay' in window) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Fake payment id for mock mode. Module scope, not inline in the component:
 * Date.now() inside a component body trips the React Compiler purity rule even
 * when it only ever runs inside an event handler.
 */
function mockPaymentId(): string {
  return `pay_MOCK${Date.now().toString().slice(-10)}`;
}

/** Human labels for the address fields, so a 422 can name what is wrong. */
const FIELD_LABELS: Record<string, string> = {
  email: 'Email',
  fullName: 'Full name',
  phone: 'Phone',
  line1: 'Flat / house / building',
  area: 'Area',
  city: 'City',
  pincode: 'PIN code',
  slotDate: 'Collection date',
  slotWindow: 'Collection time',
};

/**
 * Turns a Zod issue list into "City, PIN code".
 *
 * The API already returns `issues` on a 422 (see zodFail in server/api.ts); the
 * checkout screen used to drop them and show the bare word "Validation failed",
 * which tells the buyer nothing about which box to go and fill in. Only the last
 * path segment matters - guest payloads nest as ['guest','address','city'].
 */
function describeIssues(issues: { path?: (string | number)[]; message?: string }[] | undefined): string | null {
  if (!issues?.length) return null;
  const names = [
    ...new Set(
      issues.map((i) => {
        const key = String(i.path?.[i.path.length - 1] ?? '');
        return FIELD_LABELS[key] ?? key;
      })
    ),
  ].filter(Boolean);
  return names.length ? `Please check: ${names.join(', ')}` : null;
}

/** Tomorrow, as YYYY-MM-DD - the earliest slot we offer. */
function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function CheckoutView({
  addresses,
  customerName,
  guest = false,
  knownEmail = '',
}: {
  addresses: SavedAddress[];
  customerName: string;
  /** No session. Collect an email and post the address inline. */
  guest?: boolean;
  /** Prefill for signed-in buyers; never used to identify a guest. */
  knownEmail?: string;
}) {
  const router = useRouter();
  const { lines, priced, hydrated, pricing, couponCode, clear, openDrawer } = useCart();

  const [addressId, setAddressId] = useState<string | null>(addresses.find((a) => a.isDefault)?.id ?? null);
  // A guest has nothing saved, so the form is the only option and cannot be
  // toggled away from.
  const [showNewAddress, setShowNewAddress] = useState(guest || addresses.length === 0);
  const [email, setEmail] = useState(knownEmail);
  const [draft, setDraft] = useState<AddressDraft>({ ...EMPTY_ADDRESS, fullName: customerName });
  const [slotDate, setSlotDate] = useState(tomorrowISO());
  const [slotWindow, setSlotWindow] = useState<string>('MORNING');
  const [busy, setBusy] = useState(false);

  // Same as the cart: "not priced yet" is not "empty". Telling someone their
  // cart is empty on the checkout page is the worst place to say it.
  if (!hydrated || pricing) {
    return <div className={`${CARD} mt-9 h-64 animate-pulse bg-white/60`} aria-busy="true" />;
  }

  if (!priced || priced.lines.length === 0) {
    return (
      <div className={`${CARD} mt-9 flex flex-col items-center gap-3 px-6 py-16 text-center`}>
        <p className="text-[19px] font-semibold">Nothing to check out</p>
        <p className="max-w-[380px] text-[14.5px] text-cape">Your cart is empty.</p>
        <Link
          href="/categories/wellness"
          className="mt-1 rounded-sm bg-eden px-5 py-2.5 text-[13.5px] font-bold text-spring hover:bg-eden2"
        >
          Browse tests
        </Link>
      </div>
    );
  }

  /**
   * Saves the typed address and returns its id, or null if it was rejected.
   *
   * GUESTS NEVER GET HERE: /api/addresses requires a session, and a guest has
   * no user to hang an address off yet. Their address travels inside the
   * checkout body instead, and the route creates the user and the address
   * together - see the guest branch in app/api/checkout/route.ts.
   */
  async function ensureAddressId(): Promise<string | null> {
    if (!showNewAddress && addressId) return addressId;

    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...draft,
        line2: draft.line2 || null,
        landmark: draft.landmark || null,
        isDefault: addresses.length === 0,
      }),
    });
    const json = (await res.json()) as {
      ok: boolean;
      data?: { id: string };
      error?: string;
      issues?: { path?: (string | number)[]; message?: string }[];
    };
    if (!json.ok || !json.data) {
      toast.error(json.error ?? 'Please check the address fields', {
        description: describeIssues(json.issues) ?? undefined,
      });
      return null;
    }
    return json.data.id;
  }

  async function pay() {
    setBusy(true);
    try {
      // A guest sends { guest: { email, address } }; a signed-in buyer sends an
      // addressId. The SERVER decides which branch runs, from the session - the
      // body only offers what it has.
      let identity: Record<string, unknown>;
      if (guest) {
        identity = {
          guest: {
            email: email.trim().toLowerCase(),
            address: { ...draft, line2: draft.line2 || null, landmark: draft.landmark || null },
          },
        };
      } else {
        const finalAddressId = await ensureAddressId();
        if (!finalAddressId) return;
        identity = { addressId: finalAddressId };
      }

      // ---- create the order --------------------------------------------
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines,
          ...identity,
          couponCode,
          // The total this screen actually displayed. The server still computes
          // the real one - this is only so it can REFUSE if the two differ,
          // rather than quietly booking an order at a price nobody was shown.
          // The commonest cause needs no concurrency at all: a coupon crossing
          // its expiry while the address form is open.
          expectedTotal: priced!.total,
          ...(priced!.requiresSlot ? { slotDate, slotWindow } : {}),
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        data?: CheckoutResponse;
        error?: string;
        cart?: PricedCart;
        issues?: { path?: (string | number)[]; message?: string }[];
      };

      if (!json.ok || !json.data) {
        // 409: the re-price disagreed with what was on screen.
        if (json.cart) {
          // Open the basket over the checkout rather than navigating away. The
          // customer has an address typed in; sending them to another page to
          // review a price change would throw that away.
          toast.error(json.error ?? 'Your cart changed', { description: 'Please review your cart and try again.' });
          openDrawer();
          return;
        }
        toast.error(json.error ?? 'Could not start checkout', {
          description: describeIssues(json.issues) ?? undefined,
        });
        return;
      }

      const { orderId, orderNumber, razorpay } = json.data;

      // ---- take the payment ---------------------------------------------
      // Mock mode (no Razorpay keys configured) skips the modal entirely so the
      // whole journey stays testable end to end, including in CI.
      if (razorpay.mock) {
        await verify(orderId, orderNumber, {
          razorpay_order_id: razorpay.orderId,
          razorpay_payment_id: mockPaymentId(),
          razorpay_signature: 'mock_signature',
        });
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Could not reach the payment provider', {
          description: `Your order ${orderNumber} is saved - retry from your orders page.`,
        });
        return;
      }

      const RazorpayCtor = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
      const rzp = new RazorpayCtor({
        key: razorpay.keyId,
        order_id: razorpay.orderId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: 'Know Your Genes',
        description: `Order ${orderNumber}`,
        prefill: {
          name: draft.fullName || customerName,
          // Razorpay emails its own receipt to this address, and it is the same
          // one the order is filed under, so the two never disagree.
          ...(email ? { email: email.trim().toLowerCase() } : {}),
          ...(draft.phone ? { contact: draft.phone } : {}),
        },
        handler: (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // CATCH IT. This used to be a bare `void verify(...)`, called from a
          // Razorpay callback that runs outside pay()'s try/catch - so if the
          // network dropped between the card being charged and our confirming
          // it, the rejection was unhandled: no toast, no redirect, no order
          // number, cart still full. The buyer sat on this page with a charged
          // card and nothing at all to go on.
          //
          // The payment is not lost when this happens - the webhook captures it
          // server-side regardless - so the message says exactly that instead of
          // implying they should pay again.
          void verify(orderId, orderNumber, r).catch(() => {
            setBusy(false);
            toast.error('We could not confirm your payment on screen', {
              description: `Your payment went through and order ${orderNumber} is safe. Open your orders page in a moment to see it - do not pay again.`,
              duration: 15000,
            });
          });
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            toast.info('Payment cancelled', { description: `Order ${orderNumber} is saved if you want to retry.` });
          },
        },
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setBusy(false);
    }
  }

  async function verify(
    orderId: string,
    orderNumber: string,
    r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
  ) {
    const res = await fetch('/api/checkout/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        razorpayOrderId: r.razorpay_order_id,
        razorpayPaymentId: r.razorpay_payment_id,
        razorpaySignature: r.razorpay_signature,
      }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (!json.ok) {
      // The webhook is the authoritative path and will reconcile - never tell
      // someone whose card was charged that their payment failed.
      toast.warning('We are still confirming your payment', {
        description: `Order ${orderNumber} - check your orders in a minute.`,
      });
      router.push(`/dashboard/orders/${orderNumber}`);
      return;
    }
    clear();
    router.push(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
  }

  const canPay =
    !busy &&
    // A guest with no email would place an order nobody can be reached about,
    // and which they could never find again once the tab closes.
    (!guest || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) &&
    // Every field addressCreate marks required must appear here. `city` was
    // missing, so the button enabled with it blank, the request went out, and
    // the server answered 422 - a dead end the buyer could not act on because
    // nothing on screen said which field was wrong.
    (showNewAddress
      ? draft.fullName && draft.phone && draft.line1 && draft.area && draft.city && draft.pincode
      : addressId);

  return (
    <div className="mt-9 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4">
        {/* ---- address ---- */}
        <section className={`${CARD} p-6`}>
          {guest && (
            <div className="mb-5">
              <label htmlFor="guest-email" className="block text-[13.5px] font-semibold text-mine">
                Email
              </label>
              <p className="mt-0.5 text-[12.5px] leading-[1.5] text-cape">
                Your order confirmation goes here, and your report when it is ready. Sign in with this address later to
                track it - there is nothing to create now.
              </p>
              <input
                id="guest-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-[46px] w-full rounded-sm border border-zeus/[0.14] bg-white px-3.5 text-[14.5px] text-mine outline-none transition focus:border-eden focus:ring-2 focus:ring-eden/15 disabled:opacity-60"
              />
            </div>
          )}

          <h2 className="text-[17px] font-semibold tracking-[-0.015em]">Delivery address</h2>
          <p className="mt-1 text-[13.5px] text-cord">We courier the kit here, and collect the sample from here.</p>

          {addresses.length > 0 && (
            <div className="mt-4 space-y-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer gap-3 rounded-sm border p-3.5 transition ${
                    !showNewAddress && addressId === a.id
                      ? 'border-eden/45 bg-eden/[0.05]'
                      : 'border-zeus/[0.1] hover:border-eden/25'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1 accent-[#0E4D4B]"
                    checked={!showNewAddress && addressId === a.id}
                    onChange={() => {
                      setAddressId(a.id);
                      setShowNewAddress(false);
                    }}
                  />
                  <span className="text-[14px] leading-[1.55]">
                    <b className="font-semibold">{a.fullName}</b> · {a.phone}
                    <br />
                    <span className="text-cape">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ''}, {a.area}, {a.city} {a.pincode}
                    </span>
                  </span>
                </label>
              ))}

              <button
                type="button"
                onClick={() => setShowNewAddress((s) => !s)}
                className="text-[13.5px] font-bold text-eden underline-offset-2 hover:underline"
              >
                {showNewAddress ? '← Use a saved address' : '+ Deliver somewhere else'}
              </button>
            </div>
          )}

          {showNewAddress && (
            <div className="mt-4">
              <AddressFields value={draft} onChange={setDraft} disabled={busy} />
            </div>
          )}
        </section>

        {/* ---- slot: only when someone actually has to visit ---- */}
        {priced.requiresSlot ? (
          <section className={`${CARD} p-6`}>
            <h2 className="text-[17px] font-semibold tracking-[-0.015em]">Collection slot</h2>
            <p className="mt-1 text-[13.5px] text-cord">A phlebotomist will visit you in this window.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-[0.07em] text-cord" htmlFor="slot-date">
                  Date
                </label>
                <input
                  id="slot-date"
                  type="date"
                  min={tomorrowISO()}
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="h-11 rounded-sm border border-zeus/[0.12] bg-white px-3.5 text-[14.5px] outline-none focus:border-eden/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold uppercase tracking-[0.07em] text-cord" htmlFor="slot-window">
                  Time
                </label>
                <select
                  id="slot-window"
                  value={slotWindow}
                  onChange={(e) => setSlotWindow(e.target.value)}
                  className="h-11 rounded-sm border border-zeus/[0.12] bg-white px-3.5 text-[14.5px] outline-none focus:border-eden/40"
                >
                  {SLOT_WINDOWS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        ) : (
          <section className={`${CARD} p-6`}>
            <h2 className="text-[17px] font-semibold tracking-[-0.015em]">How collection works</h2>
            <p className="mt-1 text-[14px] leading-[1.6] text-cape">
              Our delivery partner brings one saliva kit to the address above. Spit in the tube, seal it, and hand it
              back to the courier with the prepaid label inside - no needles, no clinic visit, no appointment to keep.
              That single sample is read for every report in this order, and the results arrive online in your
              dashboard.
            </p>
          </section>
        )}
      </div>

      {/* ---- summary ---- */}
      <aside className={`${CARD} space-y-4 p-6 lg:sticky lg:top-24`}>
        <h2 className="text-[17px] font-semibold tracking-[-0.015em]">Order summary</h2>

        <ul className="space-y-2 text-[14px]">
          {priced.lines.map((l) => (
            <li key={l.slug} className="flex justify-between gap-3">
              <span className="min-w-0 text-cape">
                {l.name}
                {l.quantity > 1 && <span className="text-cord"> × {l.quantity}</span>}
              </span>
              <span className="shrink-0 tabular-nums">{formatPaise(l.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t border-zeus/[0.09] pt-3 text-[14.5px]">
          <div className="flex justify-between">
            <span className="text-cape">Subtotal</span>
            <span className="tabular-nums">{formatPaise(priced.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cape">Kit shipping</span>
            <span className="tabular-nums">
              {priced.shipping ? formatPaise(priced.shipping) : <span className="text-eden">Free</span>}
            </span>
          </div>
          {priced.discount > 0 && (
            <div className="flex justify-between font-semibold text-eden">
              <span>Discount{priced.coupon?.code ? ` (${priced.coupon.code})` : ''}</span>
              <span className="tabular-nums">−{formatPaise(priced.discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-zeus/[0.09] pt-2.5 text-[18px] font-bold">
            <span>Total</span>
            <span className="tabular-nums">{formatPaise(priced.total)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={pay}
          disabled={!canPay}
          className="flex h-[52px] w-full items-center justify-center rounded-sm bg-eden text-[15px] font-bold text-spring transition hover:bg-eden2 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {busy ? 'Working…' : `Pay ${formatPaise(priced.total)}`}
        </button>

        <p className="text-center text-[12px] leading-[1.5] text-cord">
          Payments are handled by Razorpay. We never see your card details.
        </p>
        <button
          type="button"
          onClick={openDrawer}
          className="block w-full text-center text-[13px] font-semibold text-cord transition hover:text-eden"
        >
          ← Review your cart
        </button>
      </aside>
    </div>
  );
}

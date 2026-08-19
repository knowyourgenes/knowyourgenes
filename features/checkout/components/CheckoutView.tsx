'use client';

// =============================================================================
// features/checkout — the pay screen
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

const CARD = 'rounded-[20px] border border-zeus/[0.09] bg-white shadow-kyg-card';
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

/** Tomorrow, as YYYY-MM-DD - the earliest slot we offer. */
function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function CheckoutView({ addresses, customerName }: { addresses: SavedAddress[]; customerName: string }) {
  const router = useRouter();
  const { lines, priced, hydrated, couponCode, clear } = useCart();

  const [addressId, setAddressId] = useState<string | null>(addresses.find((a) => a.isDefault)?.id ?? null);
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);
  const [draft, setDraft] = useState<AddressDraft>({ ...EMPTY_ADDRESS, fullName: customerName });
  const [slotDate, setSlotDate] = useState(tomorrowISO());
  const [slotWindow, setSlotWindow] = useState<string>('MORNING');
  const [busy, setBusy] = useState(false);

  if (!hydrated) {
    return <div className={`${CARD} mt-9 h-64 animate-pulse bg-white/60`} aria-busy="true" />;
  }

  if (!priced || priced.lines.length === 0) {
    return (
      <div className={`${CARD} mt-9 flex flex-col items-center gap-3 px-6 py-16 text-center`}>
        <p className="text-[19px] font-semibold">Nothing to check out</p>
        <p className="max-w-[380px] text-[14.5px] text-cape">Your cart is empty.</p>
        <Link
          href="/categories/wellness"
          className="mt-1 rounded-full bg-eden px-5 py-2.5 text-[13.5px] font-bold text-spring hover:bg-eden2"
        >
          Browse tests
        </Link>
      </div>
    );
  }

  /** Saves the typed address and returns its id, or null if it was rejected. */
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
    const json = (await res.json()) as { ok: boolean; data?: { id: string }; error?: string; issues?: unknown[] };
    if (!json.ok || !json.data) {
      toast.error(json.error ?? 'Please check the address fields');
      return null;
    }
    return json.data.id;
  }

  async function pay() {
    setBusy(true);
    try {
      const finalAddressId = await ensureAddressId();
      if (!finalAddressId) return;

      // ---- create the order --------------------------------------------
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines,
          addressId: finalAddressId,
          couponCode,
          ...(priced!.requiresSlot ? { slotDate, slotWindow } : {}),
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        data?: CheckoutResponse;
        error?: string;
        cart?: PricedCart;
      };

      if (!json.ok || !json.data) {
        // 409: the re-price disagreed with what was on screen.
        if (json.cart) {
          toast.error(json.error ?? 'Your cart changed', { description: 'Please review your cart and try again.' });
          router.push('/cart');
          return;
        }
        toast.error(json.error ?? 'Could not start checkout');
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
        prefill: { name: draft.fullName || customerName },
        handler: (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          void verify(orderId, orderNumber, r);
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
    !busy && (showNewAddress ? draft.fullName && draft.phone && draft.line1 && draft.area && draft.pincode : addressId);

  return (
    <div className="mt-9 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4">
        {/* ---- address ---- */}
        <section className={`${CARD} p-6`}>
          <h2 className="text-[17px] font-semibold tracking-[-0.015em]">Delivery address</h2>
          <p className="mt-1 text-[13.5px] text-cord">We courier the kit here, and collect the sample from here.</p>

          {addresses.length > 0 && (
            <div className="mt-4 space-y-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition ${
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
                  className="h-11 rounded-xl border border-zeus/[0.12] bg-white px-3.5 text-[14.5px] outline-none focus:border-eden/40"
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
                  className="h-11 rounded-xl border border-zeus/[0.12] bg-white px-3.5 text-[14.5px] outline-none focus:border-eden/40"
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
          className="flex h-[52px] w-full items-center justify-center rounded-full bg-eden text-[15px] font-bold text-spring transition hover:bg-eden2 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {busy ? 'Working…' : `Pay ${formatPaise(priced.total)}`}
        </button>

        <p className="text-center text-[12px] leading-[1.5] text-cord">
          Payments are handled by Razorpay. We never see your card details.
        </p>
        <Link href="/cart" className="block text-center text-[13px] font-semibold text-cord hover:text-eden">
          ← Back to cart
        </Link>
      </aside>
    </div>
  );
}

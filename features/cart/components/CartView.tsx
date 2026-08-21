'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatPaise } from '@/lib/catalog';
import { useCart } from '../hooks/use-cart';

const CARD = 'rounded-sm border border-zeus/[0.09] bg-white shadow-kyg-card';

function QtyStepper({ value, max, onChange }: { value: number; max: number; onChange: (next: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-sm border border-zeus/[0.12] bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        className="grid h-9 w-9 place-items-center rounded-l-sm text-lg text-cape transition hover:bg-zeus/[0.05]"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid h-9 w-9 place-items-center rounded-r-sm text-lg text-cape transition hover:bg-zeus/[0.05] disabled:cursor-not-allowed disabled:opacity-35"
      >
        +
      </button>
    </div>
  );
}

export function CartView() {
  const { priced, hydrated, pricing, itemCount, setQuantity, remove, applyCoupon, couponCode } = useCart();
  const [couponDraft, setCouponDraft] = useState('');

  const lines = priced?.lines ?? [];

  // Before localStorage is read we genuinely do not know if the cart is empty,
  // so show a skeleton rather than flashing "your cart is empty" at someone who
  // has ten thousand rupees of kits in it.
  if (!hydrated) {
    return (
      <div className="mt-10 space-y-3" aria-busy="true">
        {[0, 1].map((i) => (
          <div key={i} className={`${CARD} h-28 animate-pulse bg-white/60`} />
        ))}
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className={`${CARD} mt-10 flex flex-col items-center gap-3 px-6 py-16 text-center`}>
        <p className="text-[19px] font-semibold tracking-[-0.01em]">Your cart is empty</p>
        <p className="max-w-[400px] text-[14.5px] leading-[1.55] text-cape">
          Every KYG test starts with one at-home saliva kit. Pick the answers you actually want.
        </p>
        <Link
          href="/categories/wellness"
          className="mt-1 rounded-sm bg-eden px-5 py-2.5 text-[13.5px] font-bold text-spring transition hover:bg-eden2"
        >
          Browse all tests
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-9 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* ---- lines ---- */}
      <ul className="space-y-3">
        {lines.map((line) => (
          <li key={line.slug} className={`${CARD} flex gap-4 p-4 sm:p-5`}>
            <Link
              href={line.href}
              className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-sm bg-eden/[0.06]"
            >
              {line.coverImageUrl ? (
                <Image src={line.coverImageUrl} alt="" fill sizes="88px" className="object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-[11px] font-bold uppercase tracking-[0.08em] text-eden/50">
                  KYG
                </span>
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={line.href} className="text-[16.5px] font-semibold tracking-[-0.015em] hover:text-eden">
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-[13px] text-cord">{line.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(line.slug)}
                  className="shrink-0 text-[12.5px] font-semibold text-cord underline-offset-2 transition hover:text-eden hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1.5">
                <QtyStepper
                  value={line.quantity}
                  max={line.maxQuantity}
                  onChange={(next) => setQuantity(line.slug, next)}
                />
                <div className="text-right">
                  <span className="text-[16px] font-bold tabular-nums">{formatPaise(line.lineTotal)}</span>
                  {line.quantity > 1 && (
                    <span className="ml-2 text-[12.5px] text-cord">{formatPaise(line.unitPrice)} each</span>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ---- summary ---- */}
      <aside className={`${CARD} space-y-4 p-6 lg:sticky lg:top-24`}>
        <h2 className="text-[17px] font-semibold tracking-[-0.015em]">Order summary</h2>

        <div className="space-y-2 text-[14.5px]">
          <div className="flex justify-between">
            <span className="text-cape">
              Subtotal{' '}
              <span className="text-cord">
                ({itemCount} report{itemCount === 1 ? '' : 's'})
              </span>
            </span>
            <span className="tabular-nums">{formatPaise(priced?.subtotal ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cape">Kit shipping</span>
            <span className="tabular-nums">
              {priced?.shipping ? formatPaise(priced.shipping) : <span className="text-eden">Free</span>}
            </span>
          </div>
          {(priced?.discount ?? 0) > 0 && (
            <div className="flex justify-between font-semibold text-eden">
              <span>Discount{priced?.coupon?.code ? ` (${priced.coupon.code})` : ''}</span>
              <span className="tabular-nums">−{formatPaise(priced!.discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-zeus/[0.09] pt-2.5 text-[18px] font-bold">
            <span>Total</span>
            <span className="tabular-nums">{formatPaise(priced?.total ?? 0)}</span>
          </div>
          <p className="text-[12px] leading-[1.5] text-cord">
            One saliva kit covers every report in this order - so shipping is charged once, and you only give a sample
            once.
          </p>
        </div>

        {/* ---- coupon ---- */}
        <div className="border-t border-zeus/[0.09] pt-4">
          {couponCode && priced?.coupon?.applied ? (
            <div className="flex items-center justify-between rounded-sm bg-eden/[0.07] px-3.5 py-2.5">
              <span className="text-[13.5px] font-bold text-eden">{couponCode} applied</span>
              <button
                type="button"
                onClick={() => {
                  applyCoupon(null);
                  setCouponDraft('');
                }}
                className="text-[12.5px] font-semibold text-cord hover:text-eden"
              >
                Remove
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyCoupon(couponDraft || null);
              }}
              className="flex gap-2"
            >
              <label htmlFor="coupon" className="sr-only">
                Coupon code
              </label>
              <input
                id="coupon"
                value={couponDraft}
                onChange={(e) => setCouponDraft(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="h-11 min-w-0 flex-1 rounded-sm border border-zeus/[0.12] bg-white px-4 text-[14px] uppercase tracking-[0.04em] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-cord/70 focus:border-eden/40"
              />
              <button
                type="submit"
                className="shrink-0 rounded-sm border border-eden/30 px-4 text-[13.5px] font-bold text-eden transition hover:bg-eden/[0.06]"
              >
                Apply
              </button>
            </form>
          )}
          {priced?.coupon?.error && <p className="mt-2 text-[12.5px] text-[#9A2855]">{priced.coupon.error}</p>}
        </div>

        <Link
          href="/checkout"
          aria-disabled={pricing}
          className="flex h-[52px] items-center justify-center rounded-sm bg-eden text-[15px] font-bold text-spring transition hover:bg-eden2 aria-disabled:pointer-events-none aria-disabled:opacity-60"
        >
          {pricing ? 'Updating…' : 'Proceed to checkout'}
        </Link>

        <p className="text-center text-[12px] text-cord">Saliva kit · No needles · NABL-accredited lab</p>
      </aside>
    </div>
  );
}

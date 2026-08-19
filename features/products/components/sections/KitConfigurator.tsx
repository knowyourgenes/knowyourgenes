'use client';

// =============================================================================
// features/products — pick the reports that go on one kit
// -----------------------------------------------------------------------------
// The whole shop funnels through here. A visitor arrives from a test page with
// ?select=<slug>, that report is already ticked, and they add whatever else they
// want before ordering. One kit ships either way - the sample it brings back is
// read for every report on the list, which is why shipping is charged once and
// the customer only spits once.
//
// Committing REPLACES the cart with exactly what is ticked (see setSelection),
// so unticking here really does mean "not this one".
// =============================================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { discountPercent, formatPaise } from '@/lib/catalog';
import { useCart } from '@/features/cart/hooks/use-cart';
import type { SelectableReport } from '../../server/reports';
import Icon from '../ui/Icon';

export function KitConfigurator({
  reports,
  preselect,
  shippingFee,
}: {
  reports: SelectableReport[];
  /** Slugs ticked on arrival, from ?select= on the URL. */
  preselect: string[];
  shippingFee: number;
}) {
  const router = useRouter();
  const { addSelection, openDrawer } = useCart();
  const [busy, setBusy] = useState(false);
  const listId = useId();

  // The tick list starts COLLAPSED. It is the longest thing on the page, and a
  // visitor arriving from a test page already has the report they came for
  // ticked - so opening to a wall of ten checkboxes buries the price and the
  // buttons below the fold. The trigger always states what is selected, so
  // nothing is hidden, only folded.
  const [listOpen, setListOpen] = useState(false);

  const [selected, setSelected] = useState<string[]>(() =>
    preselect.filter((slug) => reports.some((r) => r.slug === slug && r.inStock))
  );

  const toggle = (slug: string) =>
    setSelected((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));

  const chosen = reports.filter((r) => selected.includes(r.slug));
  const reportsTotal = chosen.reduce((sum, r) => sum + r.price, 0);
  const total = chosen.length > 0 ? reportsTotal + shippingFee : 0;
  const saved = chosen.reduce((sum, r) => sum + Math.max(0, (r.compareAtPrice ?? r.price) - r.price), 0);

  /**
   * ADD keeps whatever is already in the basket and merges these into it.
   *
   * That is what the label promises, and it is also what the product is: one
   * kit, one sample, every ticked report read from that same sample. There is
   * no way to buy one report "separately", so a union is what the physical
   * thing actually does. `addSelection` skips slugs already present, so
   * pressing this twice cannot order the same report twice.
   */
  function addToCart() {
    if (chosen.length === 0) return;
    addSelection(chosen.map((r) => r.slug));
    openDrawer();
  }

  /**
   * BUY NOW merges too, then goes straight to payment.
   *
   * Deliberately NOT the old setSelection (which replaced the basket): quietly
   * dropping reports the customer added earlier, on their way to pay, would be
   * the worst possible moment to lose them. Checkout itemises every line before
   * the Razorpay modal opens, so nothing is charged that they have not seen.
   */
  function buyNow() {
    if (chosen.length === 0) return;
    setBusy(true);
    addSelection(chosen.map((r) => r.slug));
    router.push('/checkout');
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-boulder">Choose your reports</h2>
        {chosen.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected([])}
            className="text-[12.5px] font-semibold text-greenpea underline-offset-2 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <p className="-mt-1 text-[13px] leading-[1.55] text-fusc">
        One saliva kit, one sample. Every report you tick is read from it - so pick as many as you want and you still
        only give a sample once.
      </p>

      {/* ---- the tick list, behind a disclosure ----
          A real button with aria-expanded/aria-controls rather than
          details/summary: the chevron animates, and Safari still forces
          display:block on an open summary's sibling, which fights any
          transition on the panel. */}
      <button
        type="button"
        onClick={() => setListOpen((o) => !o)}
        aria-expanded={listOpen}
        aria-controls={listId}
        className="flex w-full items-center justify-between gap-3 rounded-[14px] border border-heavy/12 bg-white px-4 py-3 text-left transition hover:border-sea/45"
      >
        <span className="min-w-0">
          <span className="block text-[14px] font-extrabold text-heavy">
            {chosen.length === 0
              ? 'Choose your reports'
              : `${chosen.length} report${chosen.length === 1 ? '' : 's'} selected`}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-fusc">
            {chosen.length === 0
              ? `${reports.length} available - tap to see them all`
              : chosen.map((r) => r.name).join(', ')}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-heavy/[0.06] text-heavy transition-transform duration-300 ${
            listOpen ? 'rotate-180' : ''
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-[15px] w-[15px]">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* `hidden` rather than unmounting: the checkboxes keep their DOM state,
          and a collapsed list stays out of the tab order for free. */}
      <ul id={listId} hidden={!listOpen} className="flex flex-col gap-2">
        {reports.map((r) => {
          const isOn = selected.includes(r.slug);
          const off = discountPercent(r.price, r.compareAtPrice);
          return (
            <li key={r.slug}>
              <label
                className={`flex cursor-pointer gap-3 rounded-[14px] border p-[14px] transition ${
                  isOn ? 'border-sea bg-gin' : 'border-heavy/12 bg-white hover:border-sea/45'
                } ${r.inStock ? '' : 'cursor-not-allowed opacity-50'}`}
              >
                <input
                  type="checkbox"
                  checked={isOn}
                  disabled={!r.inStock}
                  onChange={() => toggle(r.slug)}
                  className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-[#0E4D4B]"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className="text-[14.5px] font-extrabold text-heavy">{r.name}</span>
                    <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                      <span className="text-[14.5px] font-extrabold text-heavy">{formatPaise(r.price)}</span>
                      {r.compareAtPrice && (
                        <span className="text-[12px] text-boulder line-through">{formatPaise(r.compareAtPrice)}</span>
                      )}
                      {off !== null && <span className="text-[11.5px] font-bold text-greenpea">{off}% off</span>}
                    </span>
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {r.meta && <span className="text-[11.5px] font-bold text-greenpea">{r.meta}</span>}
                    <Link
                      href={r.href}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11.5px] font-semibold text-boulder underline-offset-2 hover:text-greenpea hover:underline"
                    >
                      What&apos;s inside →
                    </Link>
                  </span>
                  {!r.inStock && (
                    <span className="mt-1 block text-[11.5px] font-bold text-[#9A2855]">Out of stock</span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {/* ---- running total ---- */}
      <div className="mt-1 rounded-[14px] border border-heavy/12 bg-white p-4">
        {chosen.length === 0 ? (
          <p className="text-[13.5px] leading-[1.55] text-fusc">
            Tick at least one report to see your total. The kit itself costs nothing extra - you pay for the answers.
          </p>
        ) : (
          <dl className="flex flex-col gap-1.5 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-fusc">
                {chosen.length} report{chosen.length === 1 ? '' : 's'}
              </dt>
              <dd className="tabular-nums text-heavy">{formatPaise(reportsTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fusc">Saliva kit + delivery</dt>
              <dd className="tabular-nums text-heavy">
                {shippingFee ? formatPaise(shippingFee) : <span className="text-greenpea">Free</span>}
              </dd>
            </div>
            {saved > 0 && (
              <div className="flex justify-between font-bold text-greenpea">
                <dt>You save</dt>
                <dd className="tabular-nums">{formatPaise(saved)}</dd>
              </div>
            )}
            <div className="mt-1 flex justify-between border-t border-heavy/10 pt-2 text-[18px] font-extrabold text-heavy">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPaise(total)}</dd>
            </div>
          </dl>
        )}
      </div>

      {/* Buy now is filled and sits first: it is the action this page exists
          for. Add to cart is outlined, so the pair reads as primary/secondary
          rather than as two equal choices the customer has to weigh. */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={buyNow}
          disabled={chosen.length === 0 || busy}
          className="flex h-[57.75px] flex-1 items-center justify-center gap-[9px] rounded-full bg-eden text-[14.5px] font-bold text-white shadow-pdp-cta transition-[transform,background] duration-200 hover:-translate-y-px hover:bg-eden2 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
        >
          {chosen.length === 0
            ? 'Select a report to continue'
            : `Buy now · ${chosen.length} report${chosen.length === 1 ? '' : 's'}`}
        </button>

        <button
          type="button"
          onClick={addToCart}
          disabled={chosen.length === 0 || busy}
          className="flex h-[57.75px] items-center justify-center gap-[9px] rounded-full border-[1.5px] border-eden/30 bg-white px-6 text-[14.5px] font-bold text-eden transition-[transform,background,border-color] duration-200 hover:-translate-y-px hover:border-eden/60 hover:bg-gin disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
        >
          <Icon name="cart" className="h-[19px] w-[16px] text-eden" />
          Add to cart
        </button>
      </div>
    </div>
  );
}

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
import { useState } from 'react';
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
  const { setSelection } = useCart();
  const [busy, setBusy] = useState(false);

  const [selected, setSelected] = useState<string[]>(() =>
    preselect.filter((slug) => reports.some((r) => r.slug === slug && r.inStock))
  );

  const toggle = (slug: string) =>
    setSelected((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));

  const chosen = reports.filter((r) => selected.includes(r.slug));
  const reportsTotal = chosen.reduce((sum, r) => sum + r.price, 0);
  const total = chosen.length > 0 ? reportsTotal + shippingFee : 0;
  const saved = chosen.reduce((sum, r) => sum + Math.max(0, (r.compareAtPrice ?? r.price) - r.price), 0);

  function order() {
    if (chosen.length === 0) return;
    setBusy(true);
    setSelection(chosen.map((r) => r.slug));
    router.push('/cart');
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

      {/* ---- the tick list ---- */}
      <ul className="flex flex-col gap-2">
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

      <button
        type="button"
        onClick={order}
        disabled={chosen.length === 0 || busy}
        className="flex h-[57.75px] items-center justify-center gap-[9px] rounded-full bg-eden text-[14.5px] font-bold text-white shadow-pdp-cta transition-[transform,background] duration-200 hover:-translate-y-px hover:bg-eden2 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
      >
        <Icon name="cart" className="h-[19px] w-[16px] text-white" />
        {chosen.length === 0
          ? 'Select a report to continue'
          : `Order my kit · ${chosen.length} report${chosen.length === 1 ? '' : 's'}`}
      </button>
    </div>
  );
}

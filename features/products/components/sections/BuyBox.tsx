'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { ProductKit } from '../../types';
import Stars from '../ui/Stars';
import Accordion from '../ui/Accordion';
import Icon, { type IconName } from '../ui/Icon';

const TRUST_ICON: Record<string, IconName> = {
  saliva: 'trust-saliva',
  clock: 'trust-clock',
  shield: 'trust-shield',
  chat: 'trust-chat',
};

// Right column of the PDP - exact Figma typography + downloaded design icons.
export default function BuyBox({ kit }: { kit: ProductKit }) {
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(kit.variants[0]?.value ?? '');

  return (
    <div className="flex flex-col gap-3 lg:self-start">
      {/* pills - Figtree Bold 12 / Green Pea */}
      <div className="flex flex-wrap gap-2">
        {kit.pills.map((p) => (
          <span
            key={p.label}
            className="inline-flex items-center rounded-full border border-sea/20 bg-gin px-[13px] py-[6px] text-[12px] font-bold text-greenpea"
          >
            {p.label}
          </span>
        ))}
      </div>

      {/* title */}
      <h1 className="pt-[3px] text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-heavy break-words sm:text-[32px] md:text-[36px]">
        {kit.title}
      </h1>

      {/* rating */}
      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-1">
        <span className="inline-flex items-center gap-[6px]">
          <Stars count={5} className="text-[15px]" />
          <b className="text-[13.5px] font-bold text-heavy">{kit.rating.toFixed(2)}</b>
        </span>
        <span className="text-[13.5px] text-boulder">·</span>
        <a href="#reviews" className="text-[13.5px] font-medium text-greenpea underline-offset-2 hover:underline">
          {kit.reviewCount} customer reviews
        </a>
      </div>

      {/* price */}
      <div className="pt-1 text-[30px] font-extrabold leading-[1.5] text-heavy">{kit.price}</div>

      {/* variant select */}
      <div className="flex flex-col gap-2 pt-[7px]">
        <label htmlFor="report-select" className="text-[11px] font-bold uppercase tracking-[0.08em] text-boulder">
          {kit.variantLabel}
        </label>
        <div className="relative">
          <select
            id="report-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            className="w-full appearance-none rounded-[12px] border border-heavy/20 bg-white px-[15px] py-[13px] pr-[44px] text-[14.5px] font-semibold text-heavy outline-none transition-colors focus:border-sea"
          >
            {kit.variants.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            className="pointer-events-none absolute right-[15px] top-1/2 size-[18px] -translate-y-1/2 text-heavy"
          />
        </div>
      </div>

      {/* qty + add to cart */}
      <div className="flex items-stretch gap-3 pt-2">
        <div className="flex items-center rounded-[12px] border border-heavy/15 bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-12 w-11 place-items-center text-[20px] font-normal text-heavy"
          >
            −
          </button>
          <span className="w-11 text-center text-[15px] font-bold text-heavy tabular-nums">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-12 w-11 place-items-center text-[20px] font-normal text-heavy"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => toast.success('Added to cart', { description: `${kit.title} × ${qty}` })}
          className="flex h-[57.75px] flex-1 items-center justify-center gap-[9px] rounded-full bg-eden text-[14.5px] font-bold text-white shadow-pdp-cta transition-[transform,background] duration-200 hover:-translate-y-px hover:bg-eden2"
        >
          <Icon name="cart" className="h-[19px] w-[16px] text-white" />
          Add to cart
        </button>
      </div>

      {/* upsell link */}
      <a
        href="#upgrade"
        className="inline-flex items-center gap-[6px] text-[12.5px] font-semibold text-greenpea hover:underline"
      >
        {kit.upsellLinkLabel}
        <Icon name="arrow-right" className="h-[16px] w-[13px] text-greenpea" />
      </a>

      {/* trust chips 2x2 - SemiBold single line, Sea icons */}
      <div className="grid grid-cols-2 gap-[10px] py-3">
        {kit.trustChips.map((c) => (
          <div
            key={c.line1}
            className="flex h-[41px] items-center gap-[10px] rounded-[12px] border border-heavy/10 bg-white/70 px-[14px]"
          >
            <Icon name={TRUST_ICON[c.icon]} className="h-[19px] w-[16px] text-sea" />
            <span className="text-[12.5px] font-semibold leading-tight text-[#2a2e28]">
              {c.line1}
              {c.line2 && ` · ${c.line2}`}
            </span>
          </div>
        ))}
      </div>

      {/* category line */}
      <div className="border-t border-heavy/10 pt-4 text-[14px] leading-[1.5] text-fusc">
        Category: <span className="font-bold text-heavy">{kit.category}</span>
      </div>

      {/* accordions */}
      <div className="pt-4">
        <Accordion title={kit.included.title} defaultOpen emphasis>
          <div className="flex flex-col gap-[10px] pt-0.5">
            {kit.included.items.map((it) => (
              <div key={it.name} className="rounded-[14px] border border-heavy/10 bg-white px-4 py-[14px]">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <span className="text-[14.5px] font-extrabold text-heavy">{it.name}</span>
                  <span className="mt-0.5 shrink-0 rounded-full border border-sea/20 bg-gin px-[10px] py-[3px] text-[11px] font-bold text-greenpea">
                    {it.traits}
                  </span>
                </div>
                <p className="text-[13px] leading-[1.6] text-fusc">{it.desc}</p>
              </div>
            ))}
          </div>
        </Accordion>

        {kit.specs.map((s) => (
          <Accordion key={s.title} title={s.title}>
            <p className="text-[13px] leading-[1.6] text-fusc">{s.body}</p>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

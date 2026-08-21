'use client';

import type { ProductKit } from '../../types';
import type { SelectableReport } from '../../server/reports';
import Stars from '../ui/Stars';
import Accordion from '../ui/Accordion';
import Icon, { type IconName } from '../ui/Icon';
import { KitConfigurator } from './KitConfigurator';

const TRUST_ICON: Record<string, IconName> = {
  saliva: 'trust-saliva',
  clock: 'trust-clock',
  shield: 'trust-shield',
  chat: 'trust-chat',
};

/**
 * Right column of the PDP - Figma typography + the design's own icons.
 *
 * The kit has NO price of its own. It is the vehicle: what you pay for is the
 * set of reports read from the sample it brings back, so the old fixed price /
 * variant dropdown / quantity stepper are gone and <KitConfigurator/> carries
 * the money. `kit.price` and `kit.variants` remain in the content file but are
 * no longer rendered - they describe packs that were never wired to a Package.
 */
export default function BuyBox({
  kit,
  reports,
  preselect,
  shippingFee,
}: {
  kit: ProductKit;
  reports: SelectableReport[];
  preselect: string[];
  shippingFee: number;
}) {
  return (
    <div className="flex flex-col gap-3 lg:self-start">
      {/* pills - Figtree Bold 12 / Green Pea */}
      <div className="flex flex-wrap gap-2">
        {kit.pills.map((p) => (
          <span
            key={p.label}
            className="inline-flex items-center rounded-sm border border-sea/20 bg-gin px-[13px] py-[6px] text-[12px] font-bold text-greenpea"
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

      {/* The kit's price IS the reports the customer picks, so the configurator
          replaces the old fixed price, variant dropdown and quantity stepper. */}
      <div className="pt-2">
        <KitConfigurator reports={reports} preselect={preselect} shippingFee={shippingFee} />
      </div>

      {/* The old "see Complete & Total Pack options" link pointed at #upgrade,
          a section that no longer renders - the tick list above IS the way to
          get more from one sample, so the link had nowhere left to go. */}

      {/* trust chips 2x2 - SemiBold single line, Sea icons */}
      <div className="grid grid-cols-2 gap-[10px] py-3">
        {kit.trustChips.map((c) => (
          <div
            key={c.line1}
            className="flex h-[41px] items-center gap-[10px] rounded-sm border border-heavy/10 bg-white/70 px-[14px]"
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
              <div key={it.name} className="rounded-sm border border-heavy/10 bg-white px-4 py-[14px]">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <span className="text-[14.5px] font-extrabold text-heavy">{it.name}</span>
                  <span className="mt-0.5 shrink-0 rounded-sm border border-sea/20 bg-gin px-[10px] py-[3px] text-[11px] font-bold text-greenpea">
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

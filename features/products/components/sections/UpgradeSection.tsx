'use client';

import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ProductKit, UpgradeCard } from '../../types';
import SectionHeader from '../ui/SectionHeader';

function Card({ card }: { card: UpgradeCard }) {
  const [prefix, price] = card.totalLabel.split('₹');
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-[24px] p-6 sm:p-8',
        card.highlighted
          ? 'border-2 border-sea bg-gin/60 shadow-pdp-card'
          : 'border border-heavy/10 bg-white shadow-pdp-soft'
      )}
    >
      {card.badge && (
        <span className="absolute -top-[10px] left-[34px] rounded-full bg-sea px-4 py-[6px] text-[10.5px] font-bold uppercase tracking-[0.08em] text-white">
          {card.badge}
        </span>
      )}

      <span className="pb-2 pt-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-greenpea">{card.kicker}</span>
      <h3 className="text-[20px] font-extrabold leading-[1.25] tracking-[-0.018em] text-heavy">{card.title}</h3>
      <p className="mt-[10px] text-[14px] leading-[1.62] text-fusc">{card.desc}</p>

      <div className="mt-4 pb-5 pt-4">
        <span className="text-[13.5px] text-fusc">{prefix}</span>
        {price !== undefined && <span className="text-[19px] font-extrabold text-heavy">₹{price}</span>}
      </div>

      <button
        type="button"
        onClick={() => toast.success('Order upgraded', { description: card.kicker })}
        className="mt-auto w-full rounded-full bg-heavy px-[26px] py-[15px] text-[14.5px] font-bold text-white shadow-[0_10px_26px_0_rgba(29,35,30,0.22)] transition-[transform,opacity] duration-200 hover:-translate-y-px hover:opacity-95"
      >
        {card.ctaLabel}
      </button>
    </div>
  );
}

// "One sample, more answers" — upsell to Complete / Total pack, above the FAQ.
export default function UpgradeSection({ upgrade }: { upgrade: ProductKit['upgrade'] }) {
  return (
    <section id="upgrade" className="scroll-mt-24 border-t border-heavy/10 py-14 md:py-[72px]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center gap-11 px-6 md:px-8">
        <SectionHeader
          eyebrow={upgrade.eyebrow}
          eyebrowIcon="eyebrow-upgrade"
          heading={upgrade.heading}
          accent={upgrade.headingAccent}
          sub={upgrade.sub}
          tone="eden"
          headingClassName="text-[clamp(30px,4vw,38px)]"
        />
        <div className="grid w-full max-w-[940px] items-stretch gap-5 md:grid-cols-2">
          {upgrade.cards.map((c) => (
            <Card key={c.kicker} card={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

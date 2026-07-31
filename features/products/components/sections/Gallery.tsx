'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ProductKit } from '../../types';
import Icon, { type IconName } from '../ui/Icon';

const THUMBS: IconName[] = ['thumb-1', 'thumb-2', 'thumb-3', 'thumb-4'];

// Left column of the PDP: a large on-brand kit render inside a gradient slot,
// plus a row of ~square thumbnails. Sticky on desktop.
export default function Gallery({ gallery }: { gallery: ProductKit['gallery'] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-[88px] lg:self-start">
      {/* image slot */}
      <div
        className="grid place-items-center rounded-[26px] border border-heavy/10 px-4 py-12 shadow-pdp-card sm:px-8 sm:py-[73px]"
        style={{ background: 'linear-gradient(138deg, rgba(14,77,75,0.05) 0%, rgba(46,125,91,0.08) 100%)' }}
      >
        <div
          className="flex min-h-[352px] w-full max-w-[320px] flex-col items-center justify-center gap-[10px] rounded-[22px] border border-edge px-8 text-center shadow-pdp-card"
          style={{ background: 'linear-gradient(130deg, #e9f3ec 0%, #faf6ef 100%)' }}
        >
          <div className="text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-greenpea">
            {gallery.brandLabel}
          </div>
          <h3 className="text-[20px] font-extrabold leading-[1.25] tracking-[-0.018em] text-heavy">{gallery.title}</h3>
          <span className="my-1 block h-px w-12 bg-sea/40" />
          <div className="text-[12.5px] leading-[1.62] text-fusc">{gallery.subtitle}</div>
          <Icon name="kit-glyph" className="mt-1 h-9 w-[30px] text-sea" />
        </div>
      </div>

      {/* thumbnails — ~square, first active */}
      <div className="flex justify-center gap-3">
        {Array.from({ length: gallery.thumbCount }).map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                'grid aspect-[130/128] flex-1 place-items-center rounded-[14px] border transition-colors',
                isActive ? 'border-sea shadow-[0_6px_18px_0_rgba(46,125,91,0.16)]' : 'border-heavy/10 opacity-60'
              )}
              style={{ background: 'linear-gradient(135deg, rgba(14,77,75,0.05) 0%, rgba(46,125,91,0.08) 100%)' }}
            >
              <Icon name={THUMBS[i % THUMBS.length]} className="h-10 w-[34px] text-greenpea opacity-50" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

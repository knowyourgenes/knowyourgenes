'use client';

// =============================================================================
// BUY PDP - the gallery column
// -----------------------------------------------------------------------------
// Figma `01 · Buy · PDP` @ node 727:581. Every number here is the frame's own,
// scaled by 1.40625 (the file's 1024 artboards are a 1440 design).
//
//   image slot   542 x 462   -> aspect 542/462, so it holds at any rail width
//   badge        @ 14.5,19.5 -> 20/27       carousel  25.7 sq -> 36
//   insights     208.6 wide  -> 293         overlay   @ 238,389 -> 44% / 84.2%
//   thumbs       84.1 tall   -> 118, gap 9.5 -> 13.4
//
// THE OVERLAYS SCALE WITH THE SLOT, NOT THE VIEWPORT.
//
// They are positioned in percentages but were sized in fixed px, which is right
// at the 762px slot the frame draws and wrong everywhere else. The worst case
// is not the phone - it is the 1024-1280 band, where the two-column grid has
// just kicked in and the slot is only ~434px. There the insights card covered
// the badge and truncated its own labels, and the caption ran off the edge.
//
// So the gallery is a `@container` and the overlays are sized in `cqw` - 1% of
// the gallery's width. Every divisor below is just the frame's value over 762
// (the badge's 14px label is 14/762 = 1.84cqw), and every one is clamped, so a
// phone gets a legible floor and 1440 lands back on the frame's number.
//
// `vw` cannot do this: the slot is 100% of the rail on a phone and ~56% of it
// on a desktop, so one viewport width means two very different slots.
//
// The GLYPHS stay at their exported px sizes. They are 10-21px already, and
// they carry `preserveAspectRatio="none"`, so they need both dimensions set
// outright - a single scaled dimension would stretch them.
//
// IT IS PINNED, AND IT IS CAPPED SO THAT PINNING IS WORTH SOMETHING.
//
// `lg:sticky lg:top-[81px] lg:self-start` holds the gallery while the buy box -
// which is roughly twice its height once the accordions are open - scrolls past
// it, and lets go when the grid row ends. `self-start` is load-bearing: a grid
// item stretches to the row by default, and a full-height item has nowhere to
// stick to.
//
// The cap is the part that is easy to miss. This column is about 1.05x as tall
// as it is wide (slot 0.852 + thumbs 0.155 + gap 0.041), so on a 1535x713
// window it stands 768px tall in a 616px gap and the THUMBNAILS SIT BELOW THE
// FOLD FOR AS LONG AS IT IS PINNED - i.e. permanently unreachable, which is a
// worse gallery than an unpinned one. `max-w: (100svh - 97px)/1.05` bounds the
// width by the height available, so the whole column always fits the window it
// is pinned in. It only binds when the window is short: at 1440x800 and above
// it never engages and the gallery keeps its full track width.
//
// This is also the only part of the section that needs browser state (which
// slide is showing), so it is the only part that is a client component.
// =============================================================================

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { BuyPdpSection } from '../../types';
import { PdpIcon } from '../FigmaIcon';

/**
 * Each glyph's own box, in design px. NOT one shared size: these vectors are
 * different shapes (venus is tall and narrow, bone and joint are square and
 * larger), and the Figma exports carry `preserveAspectRatio="none"`, so a
 * single size would stretch four of the five.
 */
const ROW_GLYPH: Record<string, [number, number]> = {
  venus: [10.4, 18.3],
  leaf: [14.6, 14.6],
  smile: [17.7, 17.7],
  bone: [20.8, 20.8],
  joint: [20.8, 20.8],
};

const DOT: Record<string, string> = {
  good: 'bg-[#2e7d5b]',
  avg: 'bg-[#d4a72c]',
  poor: 'bg-[#d4a72c]',
  neutral: 'bg-boulder',
};

export default function BuyPdpGallery({ gallery, title }: { gallery: BuyPdpSection['gallery']; title: string }) {
  const [active, setActive] = useState(0);
  const slides = gallery.slides;
  const slide = slides[active] ?? slides[0];
  const step = (d: number) => setActive((i) => (i + d + slides.length) % slides.length);

  return (
    <div className="@container flex flex-col gap-[clamp(14px,4.07cqw,31px)] lg:sticky lg:top-[81px] lg:max-w-[calc((100svh-97px)/1.05)] lg:self-start">
      {/* ---------------- image slot ---------------- */}
      <div className="relative isolate aspect-[542/462] w-full overflow-hidden rounded-sm border border-heavy/10 bg-gin shadow-[0_4px_16px_0_rgba(20,27,26,0.06),0_18px_50px_0_rgba(20,27,26,0.08)]">
        {slide && (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            className={cn(slide.fit === 'contain' ? 'object-contain' : 'object-cover', 'object-center')}
          />
        )}

        {/* wash - transparent to 62%, then down to 42% ink, so the overlay
            lines below have something to sit on without dimming the subject */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,35,30,0)_0%,rgba(29,35,30,0)_62%,rgba(29,35,30,0.42)_100%)]"
        />

        {gallery.badge && (
          <span className="absolute left-[clamp(10px,2.62cqw,20px)] top-[clamp(10px,3.54cqw,27px)] inline-flex items-center gap-[clamp(5px,1.05cqw,8px)] rounded-sm bg-white/[0.97] py-[clamp(5px,1.18cqw,9px)] pl-[clamp(9px,1.97cqw,15px)] pr-[clamp(11px,2.36cqw,18px)] shadow-[0_3px_4px_0_rgba(20,27,26,0.08)]">
            <PdpIcon name="flame" width={13.2} height={15.5} />
            <span className="whitespace-nowrap font-kyg text-[clamp(9px,1.84cqw,14px)] font-bold leading-none tracking-[0.03em] text-heavy">
              {gallery.badge}
            </span>
          </span>
        )}

        {slides.length > 1 && (
          <div className="absolute right-[clamp(8px,3.41cqw,26px)] top-[clamp(10px,3.67cqw,28px)] flex gap-[clamp(7px,2.49cqw,19px)]">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => step(d)}
                aria-label={d < 0 ? 'Previous image' : 'Next image'}
                className="grid size-[clamp(30px,4.72cqw,36px)] place-items-center rounded-full bg-white/90 text-heavy shadow-[0_2px_8px_0_rgba(20,27,26,0.12)] transition-colors hover:bg-white"
              >
                <svg viewBox="0 0 10 16" className="h-[clamp(10px,1.57cqw,12px)] w-auto" fill="none" aria-hidden>
                  <path
                    d={d < 0 ? 'M8 1 2 8l6 7' : 'M2 1l6 7-6 7'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Key insights - the sample report, read at a glance.
            `min(62%,293px)` is the whole trick: the frame's 293 wherever there
            is room, a proportion of the slot below that. A 434px slot gets a
            269px card that still fits its labels instead of a 293px one that
            does not fit the slot. */}
        <div className="absolute bottom-[3.2%] left-[2.3%] hidden w-[min(62%,293px)] rounded-sm bg-white/95 px-[clamp(10px,2.23cqw,17px)] pb-[clamp(4px,0.92cqw,7px)] pt-[clamp(9px,1.97cqw,15px)] shadow-[0_11px_31px_0_rgba(46,33,18,0.14)] sm:block">
          <div className="flex items-center gap-[clamp(5px,1.05cqw,8px)]">
            <PdpIcon name="insights" width={13.4} height={13.4} />
            <span className="truncate font-kyg text-[clamp(9px,1.55cqw,11.8px)] font-bold uppercase leading-none tracking-[0.065em] text-boulder">
              {gallery.insights.title}
            </span>
          </div>
          <ul className="mt-[clamp(6px,1.31cqw,10px)] list-none">
            {gallery.insights.rows.map((r, i) => {
              const box = ROW_GLYPH[r.glyph] ?? [17.7, 17.7];
              return (
                <li
                  key={r.label}
                  className={cn(
                    'flex items-center gap-[clamp(6px,1.44cqw,11px)] py-[clamp(6px,2.23cqw,17px)]',
                    i > 0 && 'border-t border-heavy/[0.08]'
                  )}
                >
                  <PdpIcon name={r.glyph} width={box[0]} height={box[1]} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate font-kyg text-[clamp(10px,1.84cqw,14px)] font-medium text-heavy">
                    {r.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn('size-[clamp(5px,0.96cqw,7.3px)] shrink-0 rounded-full', DOT[r.tone] ?? DOT.neutral)}
                  />
                  <span className="shrink-0 whitespace-nowrap font-kyg text-[clamp(9.5px,1.71cqw,13px)] font-medium text-heavy">
                    {r.value}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Headline overlay. Only from a 620px slot: any narrower and it runs
            into the insights card, and it is decorative. */}
        <p className="absolute left-[44%] top-[84.2%] hidden font-kyg text-[clamp(15px,3.23cqw,24.6px)] font-medium leading-[1.46] text-white @[620px]:block">
          {gallery.overlay.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </p>
      </div>

      {/* ---------------- thumbnails ---------------- */}
      <div className="flex gap-[clamp(6px,1.76cqw,13.4px)]">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1} of ${title}`}
            aria-current={i === active}
            className={cn(
              'relative h-[clamp(52px,15.49cqw,118px)] min-w-0 flex-1 overflow-hidden rounded-sm bg-gin transition-opacity',
              i === active
                ? 'border-2 border-eden shadow-[0_6px_18px_0_rgba(46,125,91,0.16)]'
                : 'border border-heavy/10 opacity-65 hover:opacity-90'
            )}
          >
            <Image
              src={s.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 12vw, 20vw"
              className={s.fit === 'contain' ? 'object-contain' : 'object-cover'}
            />
          </button>
        ))}

        {gallery.video && (
          <span
            className="relative grid h-[clamp(52px,15.49cqw,118px)] min-w-0 flex-1 place-items-center rounded-sm border border-heavy/10 bg-[#edeae5]"
            title={gallery.video.label}
          >
            <span className="grid size-[clamp(26px,5.46cqw,41.6px)] place-items-center rounded-full bg-white/90 shadow-[0_2px_8px_0_rgba(20,27,26,0.12)]">
              <PdpIcon name="play-tri" width={13.2} height={15.2} className="ml-[3px]" />
            </span>
            <span className="sr-only">{gallery.video.label}</span>
          </span>
        )}
      </div>
    </div>
  );
}

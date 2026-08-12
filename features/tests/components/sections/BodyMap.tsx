'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BodyMapSection, Ground, HotspotGeom, PanelKey } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Heading, Section } from '../ui';

// =============================================================================
// BODY MAP — frame 'BODY MAP' @ 1440 × 935, pad 88/80.
// -----------------------------------------------------------------------------
// The diagram is NOT a percentage overlay: the frame draws five hand-placed
// leader lines, each running from a text block to the edge of its dot, and no
// two share a slope. So the geometry below is the frame's own numbers, rebased
// to the diagram box's origin (the frame puts it at 360,355 — 720 × 492).
//
//   figure box   720 × 492
//   ground blur  ellipse 162 × 21 @ (279,457), #0e4d4b, layer blur 14
//   anatomy      299 × 449 @ (208,34), scale=FILL
//   dot          39 unfilled hit box · 18 ring · 16 core · 6 white pip, one centre
//   leader       1.756px solid, text end → dot end
//
// Desktop is exact at >= 1440; below `lg` the 720px box cannot fit the inner
// rail, so the figure and a plain label list are stacked instead.
// =============================================================================

/** Tooltip width — the build caps #bodyTip at 270px. */
const TIP_W = 270;

const FIG_W = 720;
const FIG_H = 492;

// `HotspotGeom` (types.ts) is this shape — it lives there because a page whose
// panels are not the Women's Health five has to author its own numbers, and the
// data file cannot import from a 'use client' component.
type Geom = HotspotGeom;

const GEOM: Record<string, Geom | undefined> = {
  mood: {
    box: [18, 50, 361, 41],
    dot: [360, 73],
    line: [218, 72, 350, 72],
    text: { side: 'left', x: 207, y: 50 },
    ring: '#0e4d4b',
    core: '#0e4d4b',
  },
  bones: {
    box: [378, 98, 231, 55],
    dot: [397, 134],
    line: [513, 120, 409, 132],
    text: { side: 'right', x: 523, y: 98 },
    ring: '#15605d',
    core: '#15605d',
  },
  pcos: {
    box: [46, 207, 320, 41],
    dot: [346, 229],
    line: [218, 220, 334, 227],
    text: { side: 'left', x: 207, y: 207 },
    ring: '#c73c70',
    core: '#c73c70',
  },
  pregnancy: {
    box: [355, 222, 306, 60],
    dot: [374, 241],
    line: [512, 264, 386, 243],
    text: { side: 'right', x: 523, y: 242 },
    ring: '#25b5ab',
    core: '#0e7c77',
  },
  joints: {
    box: [79, 331, 288, 44],
    dot: [348, 350],
    line: [218, 359, 336, 352],
    text: { side: 'left', x: 207, y: 335 },
    ring: '#25b5ab',
    core: '#0e7c77',
  },
};

/** Label — Figtree 700 18.44/22.1 #222222. Caption — Figtree 400 14.05/16.9 #5b564e. */
const LABEL = 'block font-kyg text-[18.44px] font-bold leading-[22.1px] text-mine';
const CAPTION = 'block font-kyg text-[14.05px] font-normal leading-[16.9px] text-fusc';

/**
 * The 5-stop teal ramp already lives on `.tst-em-teal` in globals.css (@layer
 * components), so a section must NOT re-declare it. The one thing that global
 * rule cannot know is that THIS accent wraps — "saliva" closes line 1 and
 * "sample." is line 2 — and the frame fills each run with its own full ramp.
 * That is `box-decoration-break: clone`, so that is all this adds.
 */
const EM_WRAP = '[&_.tst-em-teal]:box-decoration-clone';

type Hotspot = BodyMapSection['hotspots'][number];
/** A hotspot that knows where it sits — either from its own `geom` or from GEOM. */
type Placed = Hotspot & { g: Geom };

export default function BodyMap({ data, ground }: { data: BodyMapSection; ground?: Ground }) {
  const [active, setActive] = useState<PanelKey | null>(null);
  const eyebrow = data.head.eyebrow;

  // A hotspot with neither its own geometry nor an entry in GEOM has nowhere to
  // be drawn, so it is dropped rather than crashing the section.
  const spots: Placed[] = data.hotspots.flatMap((h) => {
    const g = h.geom ?? GEOM[h.key];
    return g ? [{ ...h, g }] : [];
  });

  return (
    <Section
      ground={ground ?? 'sage'}
      id="the-five-tests"
      // frame fill: linear #e9f4f3 -> #faf6ef
      className="bg-gradient-to-b from-sage2 to-linenw"
      // frame pad 88 top/bottom (the shared rail's default is 92)
      innerClassName="py-[clamp(56px,6.2vw,88px)]"
    >
      {/* ---- head — 680 rail, 14px gaps ------------------------------------ */}
      <div className="mx-auto flex max-w-[680px] flex-col items-center gap-[14px] text-center">
        {eyebrow ? (
          // pill: r999, #c73c70@10 ground, 1px #c73c70@24, 0 6 18 rgba(199,60,112,.1)
          <span className="inline-flex min-h-[47px] items-center gap-[10px] rounded-full border border-crimson/24 bg-crimson/10 pb-[11px] pl-[17px] pr-[22px] pt-[10px] shadow-tst-crimson">
            {/* The glyph is 22x26, so forcing it square squashed it ~15%. Render
                it at its true ratio and pull the overhang back to the frame's
                22px msym slot. `min-h-47` pins the frame's height (1 + 10 + 24 +
                11 + 1) because the 23.2px line box is 0.8 short of the 24 content
                row; below `lg` the label wraps and the pill grows past it. */}
            <FigmaIcon id="4199-529" className="-my-0.5 block h-[26px] w-[22px] shrink-0" />
            <span className="font-kyg text-[15.5px] font-extrabold leading-[23.2px] tracking-[0.08em] text-crimson-deep">
              {eyebrow.label}
            </span>
          </span>
        ) : null}

        {/* Figtree 700 51/55 ls -0.02em — the shared Heading's leading-[1.08] is
            already the frame's ramp, so this only sets the 680 measure. (The h2
            box reads 116 in the frame; that is Figma's font-box overshoot on the
            last line, which the CSS line-box model does not reproduce.) */}
        <Heading html={data.head.titleHtml} className={cn('max-w-[680px]', EM_WRAP)} />

        {/* Figtree 400 18.5/27.8 #5b564e — half a pixel under the shared Lead, so it is local */}
        {data.head.leadHtml ? (
          <p
            className="max-w-[680px] font-kyg text-[clamp(15px,1.3vw,18.5px)] font-normal leading-[1.503] text-fusc"
            dangerouslySetInnerHTML={{ __html: data.head.leadHtml }}
          />
        ) : null}
      </div>

      {/* ---- diagram — 1216 row, 720 × 492 box centred, gap 48 -------------- */}
      <div className="mt-[clamp(32px,3.4vw,48px)] hidden items-center justify-center lg:flex">
        {/* `shrink-0`: every child below is absolutely placed off this box's own
            720 × 492 origin, so it must never be flex-shrunk. The lg rail is 800
            at its narrowest (1024 - 160 gutter - 64 inner), so this never fires
            at or above 1440 — it is only insurance for the 1024–1439 band. */}
        <div className="relative shrink-0" style={{ width: FIG_W, height: FIG_H }}>
          {/* ground shadow: 162 × 21 ellipse, #0e4d4b at full alpha (the frame
              lists no fill alpha here, unlike the eyebrow's '#c73c70@0.1'),
              LAYER_BLUR 14 -> CSS blur(7px) */}
          <span
            aria-hidden
            className="absolute rounded-[50%] bg-eden blur-[7px]"
            style={{ left: 279, top: 457, width: 162, height: 21 }}
          />

          {/* anatomy — 299 × 449, scale=FILL */}
          <div className="absolute" style={{ left: 208, top: 34, width: 299, height: 449 }}>
            <Image src={data.image.src} alt={data.image.alt} fill sizes="299px" className="object-cover" />
          </div>

          {/* leader lines — 1.756px solid, one per hotspot */}
          <svg
            aria-hidden
            fill="none"
            viewBox={`0 0 ${FIG_W} ${FIG_H}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {spots.map((h) => {
              const g = h.g;
              const [x1, y1, x2, y2] = g.line;
              return (
                <line
                  key={h.key}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={g.core}
                  strokeWidth={1.756}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* hotspots — dot + label, one button per group bbox */}
          {spots.map((h) => {
            const g = h.g;
            const [bx, by, bw, bh] = g.box;
            const [cx, cy] = g.dot;
            const right = g.text.side === 'left';
            return (
              <button
                key={h.key}
                type="button"
                aria-label={`${h.label} — ${h.caption}`}
                // the lead reads "Tap any part of the body", so the button has to
                // do something on a real tap, where there is no hover to enter
                onClick={() => setActive((k) => (k === h.key ? null : h.key))}
                onMouseEnter={() => setActive(h.key)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(h.key)}
                onBlur={() => setActive(null)}
                className="hot pointer-events-none absolute cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-java"
                style={{ left: bx, top: by, width: bw, height: bh }}
              >
                {/* dot stack: 39 hit area · 18 ring · 16 core · 6 pip, one centre */}
                <span
                  className="pin pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: cx - bx, top: cy - by }}
                >
                  {/* The frame's outer 39px vector carries NO fill — only the
                      18 / 16 / 6 discs are painted — so this one is transparent
                      and exists purely to widen the pointer target. */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 size-[39px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  />
                  <span aria-hidden className="block size-[18px] rounded-full" style={{ backgroundColor: g.ring }} />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 size-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: g.core }}
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                  />
                </span>

                {/* label block */}
                <span
                  className={cn(
                    'pointer-events-auto absolute block whitespace-nowrap',
                    right ? 'text-right' : 'text-left'
                  )}
                  style={{
                    top: g.text.y - by,
                    ...(right ? { right: bx + bw - g.text.x } : { left: g.text.x - bx }),
                  }}
                >
                  <span className={cn(LABEL)}>{h.label}</span>
                  <span className={cn('mt-[0.9px]', CAPTION)}>{h.caption}</span>
                </span>
              </button>
            );
          })}

          {/* ---- tooltip ----------------------------------------------------
              Ported from the reference build (#bodyTip). It is positioned from
              the hotspot's KNOWN box in GEOM rather than a getBoundingClientRect
              on hover, so there is no layout read in the pointer path.

              Two behaviours from the build:
                • it flips below the hotspot when the group sits within 150px of
                  the figure top (otherwise there is no room above);
                • its centre is clamped to the figure box so it never bleeds out
                  of the diagram — half the 270px max-width, plus 4px.        */}
          {(() => {
            const h = spots.find((x) => x.key === active);
            if (!h) return null;
            const [bx, by, bw, bh] = h.g.box;
            const half = TIP_W / 2;
            const cx = Math.max(half + 4, Math.min(bx + bw / 2, FIG_W - half - 4));
            const below = by < 150;
            return (
              <div
                role="tooltip"
                className="pointer-events-none absolute z-30 w-[270px] max-w-[270px] transition-opacity duration-200"
                style={{
                  left: cx,
                  top: below ? by + bh + 12 : by - 12,
                  transform: below ? 'translate(-50%,0)' : 'translate(-50%,-100%)',
                }}
              >
                <div className="rounded-[16px] border border-mine/10 bg-white p-4 shadow-tst-float">
                  <div className="mb-1.5 font-kyg text-[12px] font-bold uppercase tracking-[0.07em] text-eden2">
                    {h.tipTitle}
                  </div>
                  <div className="font-kyg text-[14px] leading-snug text-fusc">{h.tipBody}</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ---- below lg: figure, then the same labels as a list ---------------
          The 720 × 492 diagram above cannot compress — its five leader lines are
          hand-placed, not a percentage overlay — so below `lg` the figure is
          shown on its own and the five groups become a card list.

          The list rows are BUTTONS, not static text: the lead reads "Tap any
          part of the body to see what we check there", and without the pinned
          dots there is nothing else on a phone that can honour that. Tapping a
          row discloses the same tipTitle/tipBody the desktop tooltip shows, off
          the same `active` key, so touch users are not silently shown half the
          section. Everything here is `lg:hidden`, so >=1440 is untouched. */}
      <div className="mt-[clamp(32px,3.4vw,48px)] lg:hidden">
        <div className="relative mx-auto aspect-[299/449] w-[min(299px,68vw)]">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            fill
            // 68vw until the 299px cap takes over at ~440px wide, so a phone is
            // not served the full-size desktop render
            sizes="(min-width: 440px) 299px, 68vw"
            className="object-cover"
          />
        </div>
        <ul className="mx-auto mt-7 grid max-w-[680px] gap-2.5 sm:grid-cols-2">
          {spots.map((h) => {
            const g = h.g;
            const open = active === h.key;
            return (
              // `self-start` so an open card grows on its own instead of
              // stretching its 2-up neighbour to match at sm/md
              <li
                key={h.key}
                className="self-start overflow-hidden rounded-[16px] border border-mine/10 bg-white shadow-tst-soft"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`bodymap-tip-${h.key}`}
                  onClick={() => setActive((k) => (k === h.key ? null : h.key))}
                  className="flex min-h-[44px] w-full cursor-pointer items-center gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-java"
                >
                  <span
                    aria-hidden
                    className="relative grid size-[18px] shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: g.ring }}
                  >
                    <span className="absolute size-[16px] rounded-full" style={{ backgroundColor: g.core }} />
                    <span className="absolute size-[6px] rounded-full bg-white" />
                  </span>
                  {/* min-w-0 so a caption that runs past the column wraps rather
                      than forcing the card wider than its grid track */}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={cn(LABEL, 'break-words')}>{h.label}</span>
                    <span className={cn('mt-[0.9px] break-words', CAPTION)}>{h.caption}</span>
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn('size-4 shrink-0 text-fusc transition-transform duration-300', open && 'rotate-180')}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {open ? (
                  <div id={`bodymap-tip-${h.key}`} className="border-t border-mine/10 px-4 pb-3.5 pt-3">
                    <div className="mb-1.5 break-words font-kyg text-[12px] font-bold uppercase tracking-[0.07em] text-eden2">
                      {h.tipTitle}
                    </div>
                    <div className="break-words font-kyg text-[14px] leading-snug text-fusc">{h.tipBody}</div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

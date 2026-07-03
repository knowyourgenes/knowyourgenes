'use client';

import { useEffect, useRef, useState, type ElementType, type RefObject } from 'react';
import Image from 'next/image';
import type { Bundle, ReportCard, TestPage } from '@/features/tests/types';
import { Arrow, Alert, CheckCircle, Package, SignDot } from './icons';

const IC = '/tests/mens-health/icons';

// ---- shared class recipes (composition of utilities, not @apply) ----
const BTN =
  'sheen relative inline-flex items-center gap-[9px] whitespace-nowrap rounded-full font-bold transition duration-200 hover:-translate-y-px [&_svg]:size-[17px] [&_img]:size-[17px]';
const BTN_EDEN = `${BTN} bg-eden px-[18px] py-[11px] text-[13px] text-spring shadow-[0_10px_26px_-8px_rgba(14,77,75,0.5)]`;
const BTN_JAVA = `${BTN} bg-java px-7 py-[15px] text-[15.5px] text-bottle shadow-[0_14px_34px_-10px_rgba(37,181,171,0.5)]`;
const BTN_JAVA_SM = `${BTN} bg-java px-5 py-3 text-[13.5px] text-bottle`;
const BTN_JAVA_LG = `${BTN} bg-java px-8 py-[18px] text-[16px] text-bottle shadow-[0_14px_34px_-10px_rgba(37,181,171,0.5)]`;
const BTN_EDEN_LG = `${BTN} bg-eden px-7 py-[15.5px] text-[15.5px] text-spring shadow-[0_14px_34px_-10px_rgba(14,77,75,0.45)]`;
const EYEBROW = 'text-[12.5px] font-bold uppercase tracking-[0.14em] text-eden2';
const SEC_H2 = 'text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.1] tracking-[-0.022em] text-mine';
const SEC_HEAD = 'flex flex-col gap-3.5 reveal';
const LEAD = 'max-w-[760px] text-base leading-[1.62] text-cape';
const SEC_PAD =
  'px-[clamp(24px,3.6vw,48px)] py-[clamp(56px,6vw,84px)] max-[620px]:px-[clamp(16px,5vw,24px)] max-[620px]:py-[46px]';
const SEC_ALT = 'border-y border-zeus/[0.09] bg-pearl/40';
const RING_JAVA = 'shadow-[0_0_0_1px_rgba(37,181,171,0.5),0_24px_60px_-30px_rgba(14,77,75,0.5)]';

// Per-accent styling for a pain card. `rightBg` tints the right column so the two
// halves read as distinct panels; `sign` colours the "signs to watch for" bullets
// (teal for Good accents, clay/red for Poor accents).
type PainStyle = {
  bar: string;
  ico: string;
  label: string;
  callout: string;
  testcard: string;
  rightBg: string;
  sign: string;
};
const TEAL_PAIN: PainStyle = {
  bar: 'bg-surfie',
  ico: 'bg-swans',
  label: 'text-surfie',
  callout: 'bg-surfie/[0.06] border border-surfie/[0.15]',
  testcard: 'bg-white',
  rightBg: 'bg-swans/40',
  sign: 'text-surfie',
};
const EDEN_PAIN: PainStyle = {
  bar: 'bg-eden',
  ico: 'bg-eden/[0.08]',
  label: 'text-eden',
  callout: 'bg-eden/5 border border-athens',
  testcard: 'bg-white',
  rightBg: 'bg-harp/40',
  sign: 'text-eden',
};
const RED_PAIN: PainStyle = {
  bar: 'bg-mojo',
  ico: 'bg-linen',
  label: 'text-mojo',
  callout: 'bg-mojo/[0.06] border border-mojo/[0.15]',
  testcard: 'bg-white',
  rightBg: 'bg-oldlace/40',
  sign: 'text-mojo',
};
const PAIN: Record<string, PainStyle> = {
  fertility: TEAL_PAIN,
  hormones: EDEN_PAIN,
  hairloss: RED_PAIN,
  // Women's Health accents (teal/eden read as "Good", clay/red as "Poor").
  pcos: TEAL_PAIN,
  pregnancy: EDEN_PAIN,
  depression: RED_PAIN,
  bones: RED_PAIN,
  joints: TEAL_PAIN,
};
const BADGE_TONE: Record<string, string> = {
  good: 'bg-harp text-sea',
  avg: 'bg-lusta text-mandalay',
  poor: 'bg-poppy text-white shadow-[0_4px_12px_-2px_rgba(192,62,44,0.5)]',
};
const LEGEND_BG: Record<string, string> = { good: 'bg-harp', avg: 'bg-lusta', poor: 'bg-oldlace' };
const LEGEND_ICO: Record<string, string> = { good: 'bg-sea', avg: 'bg-mandalay', poor: 'bg-poppy' };
const LEGEND_FG: Record<string, string> = { good: 'text-sea', avg: 'text-mandalay', poor: 'text-poppy' };
const CARE_ICONS = ['care-what', 'care-how', 'care-get'];

// Bundles aren't ready yet, so the bundles sidebar, the collapsed rail, and the
// "Or bundle & save" section are hidden on every test page. Flip to `true` to
// bring them back once the bundle products/pricing exist.
const SHOW_BUNDLES = false;

// Only the Hero CTA ("Check my risk" etc.) is shown for now. The secondary CTAs
// (Stat, How-it-works, Gift, Final) are hidden until checkout is ready. Flip to
// `true` to bring them all back.
const SHOW_CTAS = false;

// Ancestry discovery-layer accents: teal / blue / amber / navy. Blue + navy have
// no theme token, so use arbitrary hex; teal + amber reuse existing tokens.
const LAYER: Record<string, { bar: string; chip: string; label: string; card: string; pill: string }> = {
  primary: {
    bar: 'bg-surfie',
    chip: 'bg-surfie/[0.10] text-surfie',
    label: 'text-surfie',
    card: 'bg-swans/40',
    pill: 'border border-surfie/25 bg-surfie/[0.07] text-surfie',
  },
  secondary: {
    bar: 'bg-[#1e5f9e]',
    chip: 'bg-[#1e5f9e]/[0.10] text-[#1e5f9e]',
    label: 'text-[#1e5f9e]',
    card: 'bg-[#1e5f9e]/[0.05]',
    pill: 'border border-[#1e5f9e]/25 bg-[#1e5f9e]/[0.07] text-[#1e5f9e]',
  },
  trace: {
    bar: 'bg-mandalay',
    chip: 'bg-lusta text-mandalay',
    label: 'text-mandalay',
    card: 'bg-lusta/50',
    pill: 'border border-mandalay/25 bg-lusta text-mandalay',
  },
  journey: {
    bar: 'bg-[#1a2f4b]',
    chip: 'bg-[#1a2f4b]/[0.10] text-[#1a2f4b]',
    label: 'text-[#1a2f4b]',
    card: 'bg-[#1a2f4b]/[0.04]',
    pill: 'border border-[#1a2f4b]/25 bg-[#1a2f4b]/[0.07] text-[#1a2f4b]',
  },
  // My Wellness sub-report accents: diet=green, weight=blue, fitness=amber, detox=teal.
  diet: {
    bar: 'bg-sea',
    chip: 'bg-sea/[0.10] text-sea',
    label: 'text-sea',
    card: 'bg-harp/50',
    pill: 'border border-sea/25 bg-sea/[0.07] text-sea',
  },
  weight: {
    bar: 'bg-[#1e5f9e]',
    chip: 'bg-[#1e5f9e]/[0.10] text-[#1e5f9e]',
    label: 'text-[#1e5f9e]',
    card: 'bg-[#1e5f9e]/[0.05]',
    pill: 'border border-[#1e5f9e]/25 bg-[#1e5f9e]/[0.07] text-[#1e5f9e]',
  },
  fitness: {
    bar: 'bg-mandalay',
    chip: 'bg-lusta text-mandalay',
    label: 'text-mandalay',
    card: 'bg-lusta/50',
    pill: 'border border-mandalay/25 bg-lusta text-mandalay',
  },
  detox: {
    bar: 'bg-surfie',
    chip: 'bg-swans text-surfie',
    label: 'text-surfie',
    card: 'bg-swans/40',
    pill: 'border border-surfie/25 bg-surfie/[0.07] text-surfie',
  },
};

/** Self-contained reveal-on-scroll (no shared-hook dependency). */
function useReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('.reveal, .reveal-r');
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

/** Render trusted inline HTML authored in lib/testsdata.ts. */
function H({ html, as: Tag = 'span', className }: { html: string; as?: ElementType; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Exact Figma icon exported to /public. */
function Ico({ name, className, alt = '' }: { name: string; className?: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${IC}/${name}.svg`} alt={alt} className={className} />;
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReportCardView({ c }: { c: ReportCard }) {
  const good = c.tone !== 'poor';
  return (
    <div className="reveal relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl border border-zeus/[0.09] bg-white p-6 pt-7 shadow-kyg-card">
      <span
        className={`absolute inset-x-0 top-0 h-[5px] ${good ? 'bg-sea' : 'bg-poppy shadow-[0_0_0_1px_rgba(192,62,44,0.15)]'}`}
      />
      <div className="flex items-center gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-[12px] [&_img]:h-[22px] [&_img]:w-auto ${good ? 'bg-sea/[0.12]' : 'bg-poppy/10'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.icon} alt="" />
        </span>
        <h4 className="text-[19px] font-semibold tracking-[-0.02em] text-mine">{c.title}</h4>
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-cord">{c.whatLabel}</span>
      <H html={c.desc} className="text-sm leading-[1.55] text-cape" as="p" />
      <div
        className={`mt-auto flex flex-col gap-2 rounded-[12px] px-3.5 py-3 ${good ? 'border border-sea/20 bg-harp' : 'border border-poppy/25 bg-oldlace'}`}
      >
        <span
          className={`flex items-center justify-between gap-2 font-bold [&_svg]:size-[18px] ${good ? 'text-sea' : 'text-poppy'}`}
        >
          <span className="flex items-center gap-2">
            {good ? <CheckCircle /> : <Alert />} <span className="text-[15px] tracking-[0.02em]">{c.result}</span>
          </span>
          <span className="text-[12.5px] font-semibold opacity-85">{c.resultLabel}</span>
        </span>
        <H html={c.noteHtml} className="text-[13px] italic leading-[1.5] text-cape" as="span" />
      </div>
    </div>
  );
}

/** Sample-report cards: a static grid for <=3 cards; a snap-scroll carousel with
 *  arrow controls when there are more than 3. */
function ReportCards({ cards }: { cards: ReportCard[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (cards.length <= 3) {
    return (
      <div className="mt-[34px] grid grid-cols-3 gap-5 max-[1180px]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] max-[760px]:grid-cols-1">
        {cards.map((c, i) => (
          <ReportCardView key={i} c={c} />
        ))}
      </div>
    );
  }

  const scroll = (dir: number) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="relative mt-[34px]">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((c, i) => (
          <div key={i} className="w-[calc((100%-40px)/3)] min-w-[300px] shrink-0 snap-start">
            <ReportCardView c={c} />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous"
        className="absolute -left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-zeus/[0.09] bg-white text-eden shadow-kyg-card transition hover:bg-eden/[0.06] [&_svg]:size-[18px]"
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next"
        className="absolute -right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-zeus/[0.09] bg-white text-eden shadow-kyg-card transition hover:bg-eden/[0.06] [&_svg]:size-[18px]"
      >
        <Chevron dir="right" />
      </button>
    </div>
  );
}

function BundleCard({ b, full }: { b: Bundle; full?: boolean }) {
  const rec = b.theme === 'recommended';
  if (!full) {
    return (
      <a
        href={b.href}
        className={`flex flex-col gap-2 rounded-[20px] p-[18px] ${
          rec
            ? `bg-[linear-gradient(154deg,#0E4D4B,#0A3B39)] text-spring ${RING_JAVA}`
            : 'border border-zeus/[0.09] bg-white'
        }`}
      >
        {b.badge && (
          <span className="self-start rounded-full bg-java px-2.5 py-[3px] text-[10.5px] font-bold text-bottle">
            {b.badge}
          </span>
        )}
        <div className="flex items-center gap-2.5">
          <span className="grid shrink-0 place-items-center [&_img]:h-[22px] [&_img]:w-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.icon} alt="" />
          </span>
          <div>
            <h4 className="text-base font-semibold tracking-[-0.01em]">{b.title}</h4>
            <span className="text-xs font-semibold opacity-70">{b.subtitle}</span>
          </div>
        </div>
        <H html={b.desc} className={`text-[12.5px] leading-[1.45] ${rec ? 'text-spring/80' : 'opacity-90'}`} />
        <span
          className={`mt-0.5 inline-flex items-center gap-[5px] text-[12.5px] font-bold [&_svg]:size-[13px] ${
            rec ? 'text-bermuda' : 'text-eden'
          }`}
        >
          {b.ctaLabel} <Arrow />
        </span>
      </a>
    );
  }
  return (
    <div
      className={`relative flex flex-col gap-3 overflow-hidden rounded-[26px] p-[26px] ${
        rec
          ? `bg-[linear-gradient(130deg,#0E4D4B_0%,#0A3B39_100%)] text-spring ${RING_JAVA}`
          : 'border border-zeus/[0.09] bg-white shadow-kyg-card'
      }`}
    >
      {!rec && (
        <span
          className={`absolute inset-x-0 top-0 h-[5px] ${
            b.theme === 'complete'
              ? 'bg-[linear-gradient(90deg,#25B5AB,#2AC3A2)]'
              : 'bg-[linear-gradient(90deg,#0E7C77,#C0432F)]'
          }`}
        />
      )}
      {b.badge && (
        <span className="self-start rounded-full bg-java px-3 py-[5px] text-[11.5px] font-bold text-bottle">
          {rec ? 'Recommended' : b.badge}
        </span>
      )}
      <div className="flex items-center gap-3">
        <span className="grid shrink-0 place-items-center [&_img]:h-[26px] [&_img]:w-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.icon} alt="" />
        </span>
        <div>
          <h4 className="text-[20px] font-semibold tracking-[-0.02em]">{b.title}</h4>
          <span className="text-[13px] font-semibold opacity-70">{b.subtitle}</span>
        </div>
      </div>
      <H html={b.desc} className={`text-sm leading-[1.55] ${rec ? 'text-spring/85' : 'opacity-[0.92]'}`} />
      {b.bestFor && (
        <H
          html={b.bestFor}
          className={`mt-auto rounded-[12px] px-3 py-2.5 text-[12.5px] leading-[1.45] ${
            rec ? 'border border-white/15 bg-white/[0.04] text-spring/85' : 'bg-pearl/70'
          }`}
        />
      )}
      <a href={b.href} className={`mt-1 self-start ${rec ? BTN_JAVA_SM : BTN_EDEN}`}>
        {b.ctaLabel} <Arrow />
      </a>
    </div>
  );
}

export default function TestPageView({ test }: { test: TestPage }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);
  const [collapsed, setCollapsed] = useState(false);

  const painBadge = (tone: string) => <Ico name={tone === 'poor' ? 'badge-poor' : 'icon-badge-check'} />;

  return (
    <div ref={rootRef} className="kyg-tests bg-spring font-kyg text-mine antialiased [overflow-x:clip]">
      <div className="flex flex-col items-center" id="top">
        <div className="mx-auto flex w-full max-w-[1530px] gap-[clamp(20px,2vw,32px)] px-[clamp(18px,3vw,40px)] max-[1024px]:gap-0">
          {SHOW_BUNDLES && collapsed && (
            <div className="sticky top-16 z-30 flex max-h-[calc(100vh-64px)] w-[68px] flex-none flex-col items-center gap-3.5 self-start rounded-2xl bg-pearl/50 py-5 max-[1024px]:hidden">
              <button
                type="button"
                className="tip grid size-[38px] place-items-center rounded-[11px] border border-zeus/[0.09] bg-white text-eden shadow-kyg-card hover:bg-eden/[0.06] [&_svg]:size-4"
                data-tip="Show bundles"
                onClick={() => setCollapsed(false)}
                aria-label="Show bundles"
              >
                <Chevron dir="right" />
              </button>
              <span className="my-1 rotate-180 text-[11px] font-bold uppercase tracking-[0.18em] text-eden2 [text-orientation:mixed] [writing-mode:vertical-rl]">
                {test.sidebar.eyebrow}
              </span>
              {test.sidebar.bundles.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  className={`tip relative grid size-11 place-items-center rounded-[13px] border transition-transform duration-150 hover:-translate-y-0.5 [&_svg]:size-[20px] ${
                    b.theme === 'recommended'
                      ? 'border-transparent bg-[linear-gradient(154deg,#0E4D4B,#0A3B39)] text-spring shadow-[0_0_0_1px_rgba(37,181,171,0.5)]'
                      : 'border-zeus/[0.09] bg-white text-eden'
                  }`}
                  data-tip={b.title}
                  onClick={() => setCollapsed(false)}
                  aria-label={b.title}
                >
                  <Package />
                </button>
              ))}
            </div>
          )}

          {/* SIDEBAR (bundles only) - hidden until bundles are ready (SHOW_BUNDLES) */}
          {SHOW_BUNDLES && (
            <aside
              className={`kyg-scroll sticky top-16 max-h-[calc(100vh-64px)] w-80 flex-none flex-col gap-5 self-start overflow-y-auto rounded-2xl bg-pearl/50 px-5 py-6 max-[1024px]:hidden ${
                collapsed ? 'hidden' : 'flex'
              }`}
            >
              <div className="flex items-center justify-between gap-2.5">
                <span className={EYEBROW}>{test.sidebar.eyebrow}</span>
                <button
                  type="button"
                  className="grid size-[30px] shrink-0 place-items-center rounded-[9px] border border-zeus/[0.09] bg-white text-eden transition hover:bg-eden/[0.06] [&_svg]:size-4"
                  onClick={() => setCollapsed(true)}
                  aria-label="Collapse bundles"
                  title="Collapse"
                >
                  <Chevron dir="left" />
                </button>
              </div>
              <H html={test.sidebar.introHtml} className="text-[13px] leading-[1.5] text-cord" />
              {test.sidebar.bundles.map((b) => (
                <BundleCard key={b.key} b={b} />
              ))}
              <H
                html={test.sidebar.noteHtml}
                className="rounded-[18px] bg-eden/5 px-4 py-3.5 text-[12.5px] leading-[1.5] text-cape [&_b]:text-eden"
              />
            </aside>
          )}

          <main className="min-w-0 flex-1">
            {/* 1 · HERO */}
            <section className={`relative overflow-hidden bg-bottlehero text-spring ${SEC_PAD}`} id="order">
              <span className="pointer-events-none absolute -left-[120px] -top-[140px] size-[520px] rounded-full bg-eden/50 blur-[32px]" />
              <span className="pointer-events-none absolute -bottom-[160px] -right-[100px] size-[460px] rounded-full bg-java/10 blur-[32px]" />
              <div className="relative grid grid-cols-[1.05fr_0.95fr] items-start gap-[clamp(32px,3.5vw,56px)] max-[1180px]:grid-cols-1 max-[1180px]:gap-[clamp(28px,4vw,44px)]">
                <div className="reveal flex flex-col gap-6">
                  <div className="flex flex-wrap gap-2">
                    {test.hero.badges.map((b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.1em] [&_img]:size-4 [&_img]:object-contain"
                      >
                        {b.img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.img} alt={b.imgAlt ?? ''} />
                        )}
                        {b.label}
                      </span>
                    ))}
                  </div>
                  <H
                    html={test.hero.titleHtml}
                    as="h1"
                    className="text-[clamp(34px,4.6vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em] [&_.hl]:text-[#5FC9BC]"
                  />
                  <div>
                    <div className="w-fit bg-[linear-gradient(135deg,#F6F3ED_0%,#DBF1EE_30%,#86DAD0_55%,#25B5AB_100%)] bg-clip-text text-[clamp(30px,3.4vw,40px)] font-semibold leading-none tracking-[-0.025em] text-transparent">
                      {test.hero.anchorWord}
                    </div>
                    <span className="mt-2 block h-[3px] w-12 rounded bg-java" />
                  </div>
                  <H
                    html={test.hero.bodyHtml}
                    className="text-[16.5px] leading-[1.6] text-spring/80 [&_b]:font-bold [&_b]:text-spring"
                  />
                  <a href={test.hero.ctaHref} className={`${BTN_JAVA} self-start`}>
                    {test.hero.ctaLabel} <Arrow />
                  </a>
                  {test.hero.ctaNoteHtml && (
                    <H html={test.hero.ctaNoteHtml} className="-mt-2 text-[13px] font-medium text-spring/70" as="p" />
                  )}
                  <div className="grid grid-cols-2 gap-2.5 max-[620px]:grid-cols-1">
                    {test.hero.trust.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-[11px] rounded-2xl border border-white/[0.14] bg-white/[0.07] px-3.5 py-[11px]"
                      >
                        <span className="grid size-[34px] shrink-0 place-items-center rounded-[12px] bg-java/20 [&_img]:h-5 [&_img]:w-auto">
                          <Ico name={`trust-${t.icon}`} />
                        </span>
                        <div>
                          <H html={t.line1} className="text-[13px] font-semibold text-spring" as="div" />
                          <H html={t.line2} className="text-[11.5px] text-spring/60" as="div" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="reveal-r flex flex-col gap-3 max-[1180px]:mx-auto max-[1180px]:w-full max-[1180px]:max-w-[560px]">
                  <div className="relative aspect-[46/41] overflow-hidden rounded-[28px] shadow-kyg-deep">
                    <Image
                      src={test.hero.image}
                      alt={test.hero.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1180px) 100vw, 480px"
                      className="object-cover"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(5,36,34,0.7)_100%)]" />
                    <span className="absolute bottom-3.5 left-4 flex items-center gap-2 text-[13px] font-medium text-spring/90 [&_img]:h-[15px] [&_img]:w-auto">
                      <Ico name="caption-eye" /> {test.hero.imageCaption}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5 max-[620px]:grid-cols-2 max-[380px]:grid-cols-1">
                    {test.hero.stats.map((s, i) => {
                      const pureNum = /^\d+$/.test(s.num.replace(/<[^>]*>/g, '').trim());
                      return (
                        <div
                          key={i}
                          className="rounded-2xl border border-white/[0.14] bg-white/[0.06] px-2.5 py-3.5 text-center"
                        >
                          <H
                            html={s.num}
                            className={`font-kyg-num font-semibold text-bermuda ${pureNum ? 'text-[20px]' : 'text-[18px]'}`}
                            as="div"
                          />
                          <div className="mt-0.5 text-[10.5px] text-spring/60">{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* 2 · PAINS (health pages) */}
            {test.pains && (
              <section id="pains" className={SEC_PAD}>
                <div className={SEC_HEAD}>
                  <span className={EYEBROW}>{test.pains.eyebrow}</span>
                  <H html={test.pains.titleHtml} as="h2" className={SEC_H2} />
                </div>
                <div className="mt-12 flex flex-col gap-12">
                  {test.pains.items.map((p) => {
                    const a = PAIN[p.accent];
                    return (
                      <article
                        key={p.key}
                        className="reveal relative overflow-hidden rounded-[26px] border border-zeus/[0.09] bg-white shadow-kyg-card"
                      >
                        <span className={`absolute inset-y-0 left-0 w-1.5 max-[620px]:w-1 ${a.bar}`} />
                        <div className="grid grid-cols-[1.1fr_0.9fr] max-[1180px]:grid-cols-1">
                          <div className="p-[34px_clamp(28px,3vw,40px)_34px_40px] max-[620px]:p-[24px_20px]">
                            <div className="mb-3.5 flex items-center gap-3">
                              <span
                                className={`grid size-[46px] shrink-0 place-items-center rounded-[13px] [&_img]:h-[26px] [&_img]:w-auto ${a.ico}`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.icon} alt="" />
                              </span>
                              <H
                                html={p.label}
                                className={`text-[12px] font-bold uppercase tracking-[0.09em] ${a.label}`}
                              />
                            </div>
                            <H
                              html={p.question}
                              as="h3"
                              className="mb-3.5 text-[clamp(20px,2.2vw,26px)] font-semibold leading-[1.25] tracking-[-0.025em] text-mine"
                            />
                            <H
                              html={p.answerHtml}
                              className="text-[15px] leading-[1.5] text-cape [&_b]:text-mine"
                              as="p"
                            />
                            <div
                              className={`mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3.5 text-[13.5px] leading-[1.5] text-cape [&_img]:h-5 [&_img]:w-auto ${a.callout}`}
                            >
                              <Ico name="icon-info" />
                              <H html={p.calloutHtml} />
                            </div>
                          </div>
                          <div
                            className={`border-l border-zeus/[0.09] p-[34px_36px_34px_clamp(28px,3vw,40px)] max-[1180px]:border-l-0 max-[1180px]:border-t max-[620px]:p-[24px_20px] ${a.rightBg}`}
                          >
                            <div
                              className={`flex flex-col gap-3 rounded-2xl border border-zeus/[0.09] p-[18px] shadow-kyg-card ${a.testcard}`}
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-cord">
                                  {p.checksLabel}
                                </span>
                                <span
                                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-[5px] text-[12.5px] font-bold [&_img]:size-[14px] [&_svg]:size-[14px] ${BADGE_TONE[p.badgeTone]}`}
                                >
                                  {painBadge(p.badgeTone)} {p.badge}
                                </span>
                              </div>
                              <H html={p.checksBodyHtml} className="text-sm leading-[1.55] text-cape" as="p" />
                              <span className="h-px bg-zeus/[0.09]" />
                              <H html={p.sampleHtml} className="text-[13.5px] italic leading-[1.5] text-cord" as="p" />
                            </div>
                            <div className="mt-[18px]">
                              <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-cord">
                                {p.signsTitle}
                              </div>
                              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 max-[620px]:grid-cols-1">
                                {p.signs.map((s, i) => (
                                  <li
                                    key={i}
                                    className="flex list-none items-start gap-2 text-[13.5px] leading-[1.4] text-cape"
                                  >
                                    <SignDot className={`mt-px size-[15px] shrink-0 ${a.sign}`} /> <H html={s} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2 · DISCOVERY LAYERS (ancestry) */}
            {test.discoveryLayers && (
              <section id="pains" className={SEC_PAD}>
                <div className={SEC_HEAD}>
                  <span className={EYEBROW}>{test.discoveryLayers.eyebrow}</span>
                  <H html={test.discoveryLayers.titleHtml} as="h2" className={SEC_H2} />
                </div>
                <div className="mt-12 flex flex-col gap-12">
                  {test.discoveryLayers.items.map((l, li) => {
                    const a = LAYER[l.accent];
                    return (
                      <article
                        key={l.key}
                        className="reveal relative overflow-hidden rounded-[26px] border border-zeus/[0.09] bg-white shadow-kyg-card"
                      >
                        <span className={`absolute inset-y-0 left-0 w-1.5 max-[620px]:w-1 ${a.bar}`} />
                        <div className="grid grid-cols-[1.1fr_0.9fr] gap-0 p-[34px_36px_34px_40px] max-[1180px]:grid-cols-1 max-[620px]:p-[24px_20px]">
                          <div className="pr-[clamp(28px,3vw,40px)] max-[1180px]:pr-0">
                            <div className="mb-3.5 flex items-center gap-3">
                              <span
                                className={`grid size-[46px] shrink-0 place-items-center rounded-[13px] font-kyg-num text-[19px] font-semibold ${a.chip}`}
                              >
                                {li + 1}
                              </span>
                              <H
                                html={l.label}
                                className={`text-[12px] font-bold uppercase tracking-[0.09em] ${a.label}`}
                              />
                            </div>
                            <H
                              html={l.question}
                              as="h3"
                              className="mb-3.5 text-[clamp(20px,2.2vw,26px)] font-semibold leading-[1.25] tracking-[-0.025em] text-mine"
                            />
                            <div className="flex flex-col gap-3">
                              {l.bodyHtml.map((p, pi) => (
                                <H
                                  key={pi}
                                  html={p}
                                  className="text-[15px] leading-[1.5] text-cape [&_b]:text-mine"
                                  as="p"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="border-l border-zeus/[0.09] pl-[clamp(28px,3vw,40px)] max-[1180px]:border-l-0 max-[1180px]:pl-0 max-[1180px]:pt-8">
                            <div
                              className={`flex flex-col gap-3 rounded-2xl border border-zeus/[0.09] p-[18px] shadow-kyg-card ${a.card}`}
                            >
                              <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-cord">
                                {l.cardTitle}
                              </span>
                              {l.shows && (
                                <ul className="flex flex-col gap-2">
                                  {l.shows.map((s, si) => (
                                    <li
                                      key={si}
                                      className="flex list-none gap-2 text-[13.5px] leading-[1.45] text-cape [&_img]:mt-0.5 [&_img]:h-[15px] [&_img]:w-auto"
                                    >
                                      <Ico name="icon-sign" /> <H html={s} />
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {l.chips && (
                                <div className="flex flex-wrap gap-1.5">
                                  {l.chips.map((c, ci) => (
                                    <span
                                      key={ci}
                                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${a.pill}`}
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {l.quoteHtml && (
                                <H
                                  html={l.quoteHtml}
                                  as="blockquote"
                                  className="border-l-2 border-zeus/15 pl-3.5 text-[14px] italic leading-[1.6] text-cape"
                                />
                              )}
                              {l.noteHtml && (
                                <>
                                  {(l.shows || l.chips || l.quoteHtml) && <span className="h-px bg-zeus/[0.09]" />}
                                  <H html={l.noteHtml} className="text-[13px] italic leading-[1.5] text-cord" as="p" />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2 · FOUR TESTS (My Wellness) */}
            {test.traitReports && (
              <section id="pains" className={SEC_PAD}>
                <div className={SEC_HEAD}>
                  <span className={EYEBROW}>{test.traitReports.eyebrow}</span>
                  <H html={test.traitReports.titleHtml} as="h2" className={SEC_H2} />
                </div>
                <div className="mt-12 flex flex-col gap-12">
                  {test.traitReports.items.map((r, ri) => {
                    const a = LAYER[r.accent];
                    return (
                      <article
                        key={r.key}
                        className="reveal relative overflow-hidden rounded-[26px] border border-zeus/[0.09] bg-white shadow-kyg-card"
                      >
                        <span className={`absolute inset-y-0 left-0 w-1.5 max-[620px]:w-1 ${a.bar}`} />
                        <div className="grid grid-cols-[1.1fr_0.9fr] gap-0 p-[34px_36px_34px_40px] max-[1180px]:grid-cols-1 max-[620px]:p-[24px_20px]">
                          <div className="pr-[clamp(28px,3vw,40px)] max-[1180px]:pr-0">
                            <div className="mb-3.5 flex items-center gap-3">
                              <span
                                className={`grid size-[46px] shrink-0 place-items-center rounded-[13px] font-kyg-num text-[19px] font-semibold ${a.chip}`}
                              >
                                {ri + 1}
                              </span>
                              <H
                                html={r.label}
                                className={`text-[12px] font-bold uppercase tracking-[0.09em] ${a.label}`}
                              />
                            </div>
                            <H
                              html={r.question}
                              as="h3"
                              className="mb-3.5 text-[clamp(20px,2.2vw,26px)] font-semibold leading-[1.25] tracking-[-0.025em] text-mine"
                            />
                            <div className="flex flex-col gap-3">
                              {r.bodyHtml.map((p, pi) => (
                                <H
                                  key={pi}
                                  html={p}
                                  className="text-[15px] leading-[1.5] text-cape [&_b]:text-mine"
                                  as="p"
                                />
                              ))}
                            </div>
                            {r.calloutHtml && (
                              <div
                                className={`mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3.5 text-[13.5px] leading-[1.5] text-cape [&_b]:text-mine [&_img]:h-5 [&_img]:w-auto ${a.pill}`}
                              >
                                <Ico name="icon-info" />
                                <H html={r.calloutHtml} />
                              </div>
                            )}
                          </div>
                          <div className="border-l border-zeus/[0.09] pl-[clamp(28px,3vw,40px)] max-[1180px]:border-l-0 max-[1180px]:pl-0 max-[1180px]:pt-8">
                            <div
                              className={`flex flex-col gap-3 rounded-2xl border border-zeus/[0.09] p-[18px] shadow-kyg-card ${a.card}`}
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-cord">
                                  {r.testsLabel}
                                </span>
                                <span className="inline-flex w-fit items-center rounded-full bg-eden/[0.08] px-3 py-[5px] text-[12px] font-bold text-eden">
                                  {r.count}
                                </span>
                              </div>
                              <ul className="flex flex-col gap-2">
                                {r.groups.map((g, gi) => (
                                  <li
                                    key={gi}
                                    className="flex list-none gap-2 text-[13.5px] leading-[1.5] text-cape [&_b]:text-mine [&_img]:mt-0.5 [&_img]:h-[15px] [&_img]:w-auto"
                                  >
                                    <Ico name="icon-sign" /> <H html={g} />
                                  </li>
                                ))}
                              </ul>
                              <span className="h-px bg-zeus/[0.09]" />
                              <H html={r.sampleHtml} className="text-[13.5px] italic leading-[1.5] text-cord" as="p" />
                            </div>
                            <div className="mt-[18px]">
                              <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-cord">
                                {r.signsTitle}
                              </div>
                              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 max-[620px]:grid-cols-1">
                                {r.signs.map((s, i) => (
                                  <li
                                    key={i}
                                    className="flex list-none gap-2 text-[13.5px] leading-[1.4] text-cape [&_img]:mt-0.5 [&_img]:h-[15px] [&_img]:w-auto"
                                  >
                                    <Ico name="icon-sign" /> <H html={s} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3 · THE STAT */}
            <section className="p-[clamp(28px,4vw,48px)] max-[620px]:px-3.5 max-[620px]:py-5">
              <div className="reveal relative overflow-hidden rounded-[32px] bg-[linear-gradient(163deg,#0E4D4B_0%,#0A3B39_55%,#052422_100%)] p-[clamp(36px,4.5vw,56px)] text-spring shadow-kyg-deep max-[620px]:p-[30px_22px]">
                <div className="relative grid grid-cols-[1.15fr_0.85fr] items-center gap-10 max-[1180px]:grid-cols-1 max-[1180px]:gap-[clamp(28px,4vw,44px)]">
                  <div>
                    <Ico name="icon-quote" className="size-10" />
                    <H
                      html={test.stat.quoteHtml}
                      className="text-[clamp(30px,3.6vw,42px)] font-semibold leading-[1.12] tracking-[-0.02em]"
                      as="div"
                    />
                    <H
                      html={test.stat.subQuoteHtml}
                      className="mt-3.5 text-[clamp(18px,2vw,24px)] font-medium leading-[1.35] [&_b]:text-bermuda"
                      as="div"
                    />
                    <H html={test.stat.emphasisHtml} className="mt-2.5 text-[22px] italic text-bermuda" as="div" />
                    <H html={test.stat.bodyHtml} className="mt-5 text-[15.5px] leading-[1.6] text-spring/80" as="p" />
                  </div>
                  <div className="flex flex-col items-stretch gap-3.5 rounded-3xl border border-white/[0.16] bg-white/[0.07] p-7 backdrop-blur-[6px]">
                    <div className="flex items-end gap-3 max-[620px]:flex-wrap max-[620px]:gap-x-3 max-[620px]:gap-y-2">
                      <H
                        html={test.stat.bigNum}
                        className="font-kyg-num text-[clamp(48px,6vw,64px)] font-semibold leading-none text-java"
                        as="div"
                      />
                      <H html={test.stat.bigNumLabel} className="text-[13px] leading-[1.25] text-spring/70" as="div" />
                    </div>
                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-white/12"
                      role="progressbar"
                      aria-valuenow={50}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span className="flow-bar block h-full w-1/2 rounded-full" />
                    </div>
                    {SHOW_CTAS && (
                      <a href={test.stat.ctaHref} className={`${BTN_JAVA} w-full justify-center`}>
                        {test.stat.ctaLabel} <Arrow />
                      </a>
                    )}
                    <H
                      html={test.stat.fineprint}
                      className="text-center text-[13.5px] font-semibold text-bermuda"
                      as="div"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 4 · SAMPLE REPORT (health pages) */}
            {test.sampleReport && (
              <section id="sample" className={`${SEC_ALT} ${SEC_PAD}`}>
                <div className={SEC_HEAD}>
                  <span className={EYEBROW}>{test.sampleReport.eyebrow}</span>
                  <H html={test.sampleReport.titleHtml} as="h2" className={SEC_H2} />
                  <H html={test.sampleReport.introHtml} className={LEAD} as="p" />
                </div>
                <ReportCards cards={test.sampleReport.cards} />
                <div className="mt-[34px]">
                  <h3 className="mb-4 text-[20px] font-semibold tracking-[-0.02em]">{test.sampleReport.legendTitle}</h3>
                  <div className="grid grid-cols-3 gap-4 max-[1180px]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] max-[760px]:grid-cols-1">
                    {test.sampleReport.legend.map((l, i) => (
                      <div key={i} className={`rounded-2xl p-[18px] ${LEGEND_BG[l.tone]}`}>
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`grid size-[26px] shrink-0 place-items-center rounded-[8px] [&_img]:h-[15px] [&_img]:w-auto ${LEGEND_ICO[l.tone]}`}
                          >
                            <Ico name={`legend-${l.tone}`} />
                          </span>
                          <span className={`text-base font-bold ${LEGEND_FG[l.tone]}`}>{l.label}</span>
                          <span className={`text-[12.5px] font-semibold opacity-80 ${LEGEND_FG[l.tone]}`}>{l.sub}</span>
                        </div>
                        <H html={l.descHtml} className="text-[13.5px] leading-[1.5] text-cape" as="p" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 4 · THE 10 GLOBAL REGIONS (ancestry) */}
            {test.regionsTable && (
              <section id="sample" className={`${SEC_ALT} ${SEC_PAD}`}>
                <div className={SEC_HEAD}>
                  <span className={EYEBROW}>{test.regionsTable.eyebrow}</span>
                  <H html={test.regionsTable.titleHtml} as="h2" className={SEC_H2} />
                  <H html={test.regionsTable.introHtml} className={LEAD} as="p" />
                </div>
                <div className="reveal mt-[34px] overflow-x-auto rounded-3xl border border-zeus/[0.09] bg-white shadow-kyg-card">
                  <table className="w-full min-w-[640px] border-collapse text-left">
                    <thead>
                      <tr className="bg-[linear-gradient(120deg,#0E4D4B,#0A3B39)] text-spring">
                        <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em]">
                          {test.regionsTable.headers[0]}
                        </th>
                        <th className="px-3 py-4 text-[12px] font-bold uppercase tracking-[0.1em]">
                          {test.regionsTable.headers[1]}
                        </th>
                        <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em]">
                          {test.regionsTable.headers[2]}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zeus/[0.09]">
                      {test.regionsTable.rows.map((r, i) => (
                        <tr key={i} className="align-top">
                          <th className="px-5 py-4 text-[14.5px] font-semibold text-mine">{r.region}</th>
                          <td className="whitespace-nowrap px-3 py-4 font-kyg-num text-[15px] font-semibold text-eden">
                            {r.pct}
                          </td>
                          <td className="px-5 py-4 text-[13.5px] leading-[1.55] text-cape">
                            <H html={r.connectsHtml} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <H
                  html={test.regionsTable.footnote}
                  className="reveal mt-4 text-[13px] leading-[1.55] text-cord"
                  as="p"
                />
              </section>
            )}

            {/* 4 · WHAT YOU GET - 52 TRAITS (My Wellness) */}
            {test.traitsCatalog && (
              <section id="sample" className={`${SEC_ALT} ${SEC_PAD}`}>
                <div className={SEC_HEAD}>
                  <span className={EYEBROW}>{test.traitsCatalog.eyebrow}</span>
                  <H html={test.traitsCatalog.titleHtml} as="h2" className={SEC_H2} />
                  <H html={test.traitsCatalog.introHtml} className={LEAD} as="p" />
                </div>
                <div className="reveal mt-[34px] overflow-hidden rounded-3xl border border-zeus/[0.09] bg-white shadow-kyg-card">
                  {test.traitsCatalog.categories.map((c, i) => {
                    const a = LAYER[c.accent];
                    return (
                      <div
                        key={i}
                        className="grid grid-cols-[220px_1fr] gap-6 border-b border-zeus/[0.09] p-[22px_26px] max-[760px]:grid-cols-1 max-[760px]:gap-2.5"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className={`mt-1 size-3 shrink-0 rounded-full ${a.bar}`} />
                          <div>
                            <div className="text-[16px] font-semibold text-mine">{c.name}</div>
                            <div className={`font-kyg-num text-[13px] font-semibold ${a.label}`}>{c.count}</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {c.groups.map((g, gi) => (
                            <H
                              key={gi}
                              html={g}
                              className="text-[13.5px] leading-[1.5] text-cape [&_b]:text-mine"
                              as="p"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div className="grid grid-cols-[220px_1fr] items-center gap-6 bg-eden/[0.05] p-[22px_26px] max-[760px]:grid-cols-1 max-[760px]:gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-kyg-num text-[28px] font-semibold text-eden">
                        {test.traitsCatalog.totalNum}
                      </span>
                      <div className="text-[16px] font-semibold text-mine">{test.traitsCatalog.totalLabel}</div>
                    </div>
                    <H html={test.traitsCatalog.totalSub} className="text-[13.5px] font-medium text-cord" as="div" />
                  </div>
                </div>
                <div className="mt-[34px]">
                  <h3 className="mb-4 text-[20px] font-semibold tracking-[-0.02em]">
                    {test.traitsCatalog.legendTitle}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 max-[1180px]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] max-[760px]:grid-cols-1">
                    {test.traitsCatalog.legend.map((l, i) => (
                      <div key={i} className={`rounded-2xl p-[18px] ${LEGEND_BG[l.tone]}`}>
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`grid size-[26px] shrink-0 place-items-center rounded-[8px] [&_img]:h-[15px] [&_img]:w-auto ${LEGEND_ICO[l.tone]}`}
                          >
                            <Ico name={`legend-${l.tone}`} />
                          </span>
                          <span className={`text-base font-bold ${LEGEND_FG[l.tone]}`}>{l.label}</span>
                          <span className={`text-[12.5px] font-semibold opacity-80 ${LEGEND_FG[l.tone]}`}>{l.sub}</span>
                        </div>
                        <H html={l.descHtml} className="text-[13.5px] leading-[1.5] text-cape" as="p" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 5 · HOW IT WORKS */}
            <section id="how" className={SEC_PAD}>
              <div className={SEC_HEAD}>
                <span className={EYEBROW}>{test.howItWorks.eyebrow}</span>
                <H html={test.howItWorks.titleHtml} as="h2" className={SEC_H2} />
                <H html={test.howItWorks.introHtml} className={LEAD} as="p" />
              </div>
              <div className="reveal relative my-7 h-[clamp(280px,33vw,479px)] w-full overflow-hidden rounded-[31px] shadow-kyg-card">
                <Image
                  src={test.howItWorks.image}
                  alt={test.howItWorks.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-4">
                {test.howItWorks.steps.map((s) => {
                  const dark = !!s.dark;
                  return (
                    <div
                      key={s.num}
                      className={`reveal grid grid-cols-[auto_1fr] items-start gap-5 rounded-[22px] p-[24px_28px] max-[620px]:p-[18px] ${
                        dark
                          ? 'bg-[linear-gradient(178deg,#0E4D4B_0%,#0A3B39_100%)] text-spring shadow-kyg-dark'
                          : 'border border-zeus/[0.09] bg-white shadow-kyg-card'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2.5">
                        <span
                          className={`grid size-11 place-items-center rounded-[13px] font-kyg-num text-[22px] font-semibold leading-none ${dark ? 'bg-bermuda text-bottle' : 'bg-zeus/[0.05] text-eden'}`}
                        >
                          {s.num}
                        </span>
                        <span
                          className={`grid size-11 place-items-center [&_img]:h-7 [&_img]:w-[25px] ${dark ? 'text-bermuda' : 'text-java'}`}
                        >
                          {s.icon.includes('/') ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.icon} alt="" />
                          ) : (
                            <span className="material-symbols-outlined text-[28px] leading-none">{s.icon}</span>
                          )}
                        </span>
                      </div>
                      <div>
                        <H
                          html={s.title}
                          as="h3"
                          className="mb-1 text-[18px] font-semibold leading-[1.35] tracking-[-0.025em]"
                        />
                        <H
                          html={s.subHtml}
                          className={`mb-2 text-[13.5px] font-semibold ${dark ? 'text-bermuda' : 'text-java'}`}
                          as="div"
                        />
                        <H
                          html={s.bodyHtml}
                          className={`text-[14.5px] leading-[1.6] ${dark ? 'text-spring/80' : 'text-cape'}`}
                          as="div"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-7 flex flex-col items-start gap-3">
                {SHOW_CTAS && (
                  <a href={test.howItWorks.ctaHref} className={BTN_EDEN_LG}>
                    {test.howItWorks.ctaLabel} <Arrow />
                  </a>
                )}
                <H html={test.howItWorks.fineprint} className="text-[13px] text-cord" as="div" />
              </div>
            </section>

            {/* 6 · GENEous CARE */}
            <section id="care" className={`${SEC_ALT} ${SEC_PAD}`}>
              <div className="grid grid-cols-[1.05fr_0.95fr] items-start gap-14 max-[1180px]:grid-cols-1 max-[1180px]:gap-[clamp(28px,4vw,44px)]">
                <div className="reveal">
                  <div className="flex flex-col gap-3.5">
                    <span className={EYEBROW}>{test.care.eyebrow}</span>
                    <H html={test.care.titleHtml} as="h2" className={SEC_H2} />
                  </div>
                  <H
                    html={test.care.leadHtml}
                    className="mt-1.5 text-[19px] font-medium leading-[1.5] text-eden"
                    as="p"
                  />
                  <H html={test.care.bodyHtml} className="mt-3.5 text-base leading-[1.62] text-cape" as="p" />
                  <div className="mt-6 grid grid-cols-3 gap-3.5 max-[480px]:grid-cols-1">
                    {test.care.minis.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-zeus/[0.09] bg-white px-4 pb-8 pt-4 shadow-kyg-card"
                      >
                        <span className="mb-2.5 grid size-10 place-items-center rounded-[12px] bg-eden/[0.07] [&_img]:h-[22px] [&_img]:w-auto">
                          <Ico name={CARE_ICONS[i] ?? 'care-what'} />
                        </span>
                        <h4 className="mb-1.5 text-sm font-semibold text-mine">{m.title}</h4>
                        <H html={m.bodyHtml} className="text-[13.5px] leading-[1.55] text-cord" as="p" />
                      </div>
                    ))}
                  </div>
                  <H
                    html={test.care.pullQuoteHtml}
                    className="mt-7 text-[clamp(22px,2.6vw,28px)] font-semibold italic leading-[1.5] tracking-[-0.025em] text-eden"
                    as="div"
                  />
                </div>
                <div className="reveal-r flex flex-col gap-4">
                  {/* Chat mock card */}
                  <div className="overflow-hidden rounded-[26px] bg-white shadow-kyg-dark">
                    <div className="flex items-center gap-3 bg-eden px-5 py-4 text-spring">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sea/90 [&_img]:h-5 [&_img]:w-auto">
                        <Ico name="chat-avatar" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold">{test.care.chatTitle}</span>
                        <span className="text-[12px] text-bermuda">{test.care.chatStatus}</span>
                      </div>
                      <span className="ml-auto opacity-90 [&_img]:h-[18px] [&_img]:w-auto">
                        <Ico name="chat-video" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 bg-pearl/50 p-5">
                      {test.care.chat.map((c, i) => (
                        <H
                          key={i}
                          html={c.textHtml}
                          className={`max-w-[82%] px-3.5 py-3 text-[13.5px] leading-[1.5] shadow-kyg-card ${
                            c.from === 'me'
                              ? 'self-end rounded-[16px_6px_16px_16px] bg-eden text-spring'
                              : 'self-start rounded-[6px_16px_16px_16px] bg-white text-cape'
                          }`}
                          as="div"
                        />
                      ))}
                    </div>
                  </div>
                  {/* Separate "what your counsellor covers" card */}
                  <div className="rounded-[22px] border border-zeus/[0.09] bg-eden/5 px-5 py-[18px]">
                    <h4 className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.1em] text-eden2">
                      {test.care.coversTitle}
                    </h4>
                    <ul>
                      {test.care.covers.map((c, i) => (
                        <li
                          key={i}
                          className="mb-2.5 flex list-none gap-2.5 text-[13.5px] leading-[1.5] text-cape last:mb-0 [&_b]:text-mine [&_img]:mt-px [&_img]:h-[18px] [&_img]:w-auto"
                        >
                          <Ico name={`covers-${(i % 4) + 1}`} />
                          <H html={c} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 7 · TRUST */}
            <section id="trust" className={SEC_PAD}>
              <div className={`${SEC_HEAD} max-w-[760px]`}>
                <span className={EYEBROW}>{test.trust.eyebrow}</span>
                <H html={test.trust.titleHtml} as="h2" className={SEC_H2} />
              </div>
              <div className="reveal mt-7 flex flex-wrap justify-center gap-3.5 rounded-[20px] border border-zeus/[0.09] bg-white p-[22px] max-[620px]:gap-2.5">
                {test.trust.certs.map((c, i) => (
                  <div
                    key={i}
                    className="flex min-w-[120px] flex-1 flex-col items-center gap-2 rounded-[12px] border border-eden/10 px-4 py-3.5 max-[620px]:min-w-[calc(50%-10px)] [&_img]:h-10 [&_img]:w-auto [&_img]:max-w-[90px] [&_img]:object-contain"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img ?? c.svg} alt={c.alt} />
                    {/* <span className="text-center text-[10.5px] font-semibold text-cord">{c.label}</span> */}
                  </div>
                ))}
              </div>
              <div className="reveal mt-5 rounded-3xl border border-zeus/[0.09] bg-white px-7 py-2 shadow-kyg-card">
                {test.trust.rows.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[0.9fr_1.1fr] gap-7 border-b border-zeus/[0.09] py-5 last:border-b-0 max-[760px]:grid-cols-1 max-[760px]:gap-1.5"
                  >
                    <H html={r.label} className="text-[15px] font-semibold text-mine" />
                    <H html={r.descHtml} className="text-sm leading-[1.55] text-cape" />
                  </div>
                ))}
              </div>
              {test.trust.traceNote && (
                <div className="reveal mt-5 rounded-3xl border border-mandalay/20 bg-lusta/40 px-7 py-6">
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-lusta text-mandalay [&_img]:h-5 [&_img]:w-auto">
                      <Ico name="icon-info" />
                    </span>
                    <h4 className="text-[15px] font-bold text-mandalay">{test.trust.traceNote.title}</h4>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {test.trust.traceNote.items.map((it, i) => (
                      <li
                        key={i}
                        className="flex list-none gap-2 text-[13.5px] leading-[1.55] text-cape [&_img]:mt-0.5 [&_img]:h-[15px] [&_img]:w-auto"
                      >
                        <Ico name="icon-sign" /> <H html={it} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="reveal mt-5 grid grid-cols-[auto_1fr] items-start gap-5 rounded-3xl bg-[linear-gradient(160deg,#0E4D4B,#0A3B39)] p-7 text-spring shadow-kyg-dark max-[620px]:grid-cols-1 max-[620px]:gap-3.5">
                <span className="grid size-14 place-items-center rounded-[14px] bg-bermuda text-[18px] font-bold text-bottle">
                  {test.trust.expert.initials}
                </span>
                <div>
                  <div className="text-[18px] font-semibold">
                    <H html={test.trust.expert.name} />{' '}
                    <H html={test.trust.expert.role} className="font-medium text-bermuda" />
                  </div>
                  <H html={test.trust.expert.lab} className="mb-3 mt-0.5 text-[13px] text-spring/70" as="div" />
                  <H html={test.trust.expert.bodyHtml} className="text-[15px] leading-[1.55] text-spring/90" as="div" />
                  <H html={test.trust.expert.accuracyHtml} className="mt-2.5 text-[13px] text-bermuda" as="div" />
                </div>
              </div>
            </section>

            {/* 8 · FAQ */}
            <section id="faq" className={`${SEC_ALT} ${SEC_PAD}`}>
              <div className={SEC_HEAD}>
                <span className={EYEBROW}>{test.faq.eyebrow}</span>
                <H html={test.faq.titleHtml} as="h2" className={SEC_H2} />
              </div>
              <div className="mt-8 flex flex-col gap-3">
                {test.faq.items.map((f, i) => (
                  <details key={i} className="reveal overflow-hidden rounded-[18px] border border-zeus/[0.09] bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3.5 px-6 py-5 text-[16.5px] font-semibold text-mine">
                      <H html={f.q} />
                      <span className="faq-plus grid size-[30px] shrink-0 place-items-center rounded-full bg-eden/[0.07] text-eden transition-transform duration-[250ms] [&_img]:h-[18px] [&_img]:w-auto">
                        <Ico name="faq-plus" />
                      </span>
                    </summary>
                    <H html={f.aHtml} as="p" className="px-6 pb-[22px] text-[14.5px] leading-[1.62] text-cape" />
                  </details>
                ))}
              </div>
            </section>

            {/* 9a · GIFT (ancestry) */}
            {test.giftSection && (
              <section className={SEC_PAD}>
                <div className={SEC_HEAD}>
                  <span className={EYEBROW}>{test.giftSection.eyebrow}</span>
                  <H html={test.giftSection.titleHtml} as="h2" className={SEC_H2} />
                  <H html={test.giftSection.introHtml} className={LEAD} as="p" />
                </div>
                <div className="mt-[34px] grid grid-cols-3 gap-5 max-[1180px]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] max-[760px]:grid-cols-1">
                  {test.giftSection.cards.map((c, i) => (
                    <div
                      key={i}
                      className="reveal flex flex-col gap-3 rounded-3xl border border-zeus/[0.09] bg-white p-6 shadow-kyg-card"
                    >
                      <h4 className="text-[19px] font-semibold tracking-[-0.02em] text-mine">{c.title}</h4>
                      <H html={c.bodyHtml} className="text-sm leading-[1.55] text-cape" as="p" />
                      <H
                        html={c.bestForHtml}
                        className="mt-auto rounded-[12px] bg-pearl/70 px-3 py-2.5 text-[12.5px] leading-[1.45] text-cord"
                        as="div"
                      />
                    </div>
                  ))}
                </div>
                <div className="reveal mt-7 flex justify-center">
                  {SHOW_CTAS && (
                    <a href={test.giftSection.ctaHref} className={BTN_EDEN_LG}>
                      {test.giftSection.ctaLabel} <Arrow />
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* 9 · BUNDLES + FINAL CTA (bundles hidden until ready - SHOW_BUNDLES) */}
            <section id="bundles" className={SEC_PAD}>
              {SHOW_BUNDLES && (
                <>
                  <div className={SEC_HEAD}>
                    <span className={EYEBROW}>{test.bundlesSection.eyebrow}</span>
                    <H html={test.bundlesSection.titleHtml} as="h2" className={SEC_H2} />
                  </div>
                  <div className="mt-[34px] grid grid-cols-3 gap-5 max-[1180px]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] max-[760px]:grid-cols-1">
                    {test.bundlesSection.items.map((b) => (
                      <BundleCard key={b.key} b={b} full />
                    ))}
                  </div>
                </>
              )}

              <div className="reveal mt-9 flex flex-col items-center gap-5 rounded-[34px] bg-[linear-gradient(167deg,#0E4D4B_0%,#0A3B39_55%,#052422_100%)] p-[clamp(48px,6vw,68px)_clamp(28px,9vw,132px)] text-center text-spring shadow-kyg-deep max-[620px]:rounded-[26px] max-[620px]:p-[40px_22px]">
                <H
                  html={test.finalCta.titleHtml}
                  as="h2"
                  className="text-[clamp(30px,4.4vw,50px)] font-semibold leading-[1.08] tracking-[-0.025em]"
                />
                <H
                  html={test.finalCta.subHtml}
                  className="max-w-[640px] text-[17px] leading-[1.55] text-spring/85"
                  as="p"
                />
                {SHOW_CTAS && (
                  <a href={test.finalCta.ctaHref} className={BTN_JAVA_LG}>
                    {test.finalCta.ctaLabel} <Arrow />
                  </a>
                )}
                <H html={test.finalCta.fineprint1} className="text-[13px] text-bermuda" as="div" />
                <H html={test.finalCta.fineprint2} className="text-[13px] text-spring/60" as="div" />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

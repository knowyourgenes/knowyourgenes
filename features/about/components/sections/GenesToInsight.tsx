// =============================================================================
// About Us — SECTION 06 · FROM GENES TO INSIGHT
// -----------------------------------------------------------------------------
// Figma frame is 1440 wide, 1410 tall, on a #eff6f5 -> #faf6ef vertical gradient
// (the shared `sageFade` ground). Three stacked blocks, 56px apart:
//   1. centred eyebrow + 42px h2                       (720 wide)
//   2. the flowing-spine journey — 860 wide, 104px left
//      rail holding the 54px node medallions, cards 756 wide, 24px apart
//   3. the "Genes -> Data -> Insight -> Awareness" chip row (900 wide)
//
// RADIUS TRAP: the project remaps Tailwind's radius scale, so every radius here
// is written as an explicit arbitrary value (24 -> rounded-[24px], 2 ->
// rounded-[2px]); only the full-round pills use rounded-full.
// =============================================================================

import { Fragment } from 'react';

import { cn } from '@/lib/utils';

import { AboutIcon } from '../AboutIcon';
import { Eyebrow, Heading, Photo, Section } from '../ui';

/* -------------------------------------------------------------------------- */
/* copy — verbatim from the frame                                             */
/* -------------------------------------------------------------------------- */

type Step = {
  index: string;
  kicker: string;
  title: string;
  body: string;
  slotIcon: string;
  slotLabel: string;
  /** Designer photography; when present it REPLACES slotIcon + slotLabel. */
  slotImg: string;
  slotAlt: string;
  nodeIcon: string;
};

const STEPS: Step[] = [
  {
    index: '01',
    kicker: 'Collect',
    title: 'Simple DNA Sample',
    body: 'A simple DNA sample gives us the starting point.',
    slotIcon: '5844-536',
    slotLabel: 'Saliva kit',
    slotImg: '/about/img/step-01-collect.jpg',
    slotAlt: 'Hands opening a saliva collection kit on a kitchen table.',
    nodeIcon: '5817-322',
  },
  {
    index: '02',
    kicker: 'Analyse',
    title: 'Genetic Analysis',
    body: 'Your genetic information is analysed to identify relevant genetic variations.',
    slotIcon: '6029-536',
    slotLabel: 'Lab analysis',
    slotImg: '/about/img/step-02-analyse.jpg',
    slotAlt: 'A scientist reviewing genetic data at a lab workstation.',
    nodeIcon: '5989-322',
  },
  {
    index: '03',
    kicker: 'Interpret',
    title: 'Making Sense of the Findings',
    body: 'The findings are translated into understandable insights across relevant areas of health and wellness.',
    slotIcon: '6240-536',
    slotLabel: 'Counsellor & report',
    slotImg: '/about/img/step-03-interpret.jpg',
    slotAlt: 'A counsellor going through a report with someone on a tablet.',
    nodeIcon: '6187-322',
  },
];

const LAB_PILLS = [
  { icon: '6619-757', label: 'Lab-powered science' },
  { icon: '6667-757', label: 'Trusted testing partner' },
];

const FLOW = [
  { icon: '6793-291', label: 'Genes', solid: true },
  { icon: '6793-543', label: 'Data', solid: false },
  { icon: '6793-784', label: 'Insight', solid: false },
  { icon: '6793-1041', label: 'Awareness', solid: false },
];

/* -------------------------------------------------------------------------- */
/* local bits — the frame's own shapes, none of which the shared primitives     */
/* cover (dark-ground pills, spine medallions, the connector chips)             */
/* -------------------------------------------------------------------------- */

/** Shared type ramp for the card's "01 / COLLECT" row + heading + body. */
const CARD_NUMBER = 'font-kyg text-[26px] font-semibold leading-[26px]';
// textCase=UPPER in the frame. Figma keeps `characters` as typed ("Collect") and
// applies case via style.textCase, so the spec dump reads sentence case while the
// frame renders COLLECT. All four consumers — Collect / Analyse / Interpret and
// the 04 "GENEous Lab" kicker (y 5839.2 / 6010.7 / 6208.6 / 6432.5) — are UPPER
// runs, so the transform lives on the constant. The 0.14em is uppercase tracking:
// do NOT "correct" this back to sentence case.
//
// One caller opts out: the GENEous Lab kicker adds `normal-case` to keep the
// partner brand's own capitalisation. That is a product decision, not a frame
// reading — see the BRAND EXCEPTION note at its call site.
const CARD_KICKER = 'font-kyg text-[13px] font-bold uppercase leading-[19.5px] tracking-[0.14em]';
const CARD_TITLE =
  'font-kyg text-[clamp(18px,1.39vw,20px)] font-bold leading-[1.14] tracking-[-0.018em] lg:leading-[1.05]';
const CARD_BODY = 'break-words pt-0.5 font-kyg text-[clamp(15px,1.15vw,16.5px)] leading-[1.62]';
// textCase=UPPER in the frame — same story as CARD_KICKER. Every CardSlot caption
// is an UPPER run (Saliva kit / Lab analysis / Counsellor & report / GENEous Lab,
// y 5887.2 / 6071.9 / 6283.3 / 6571.8); 0.12em is the uppercase tracking. The
// GENEous Lab caption opts out via CardSlot's `labelClassName` for the same brand
// reason as the kicker; the other three are frame-exact.
const SLOT_LABEL = 'font-kyg text-[12px] font-bold uppercase leading-[18px] tracking-[0.12em]';

/** The 54px medallion that sits on the spine. In flow above the card < md. */
function SpineNode({ icon, accent = false }: { icon: string; accent?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'mb-3 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full',
        'md:absolute md:left-[-86px] md:top-[4px] md:mb-0',
        accent
          ? 'bg-gradient-to-br from-eden to-java shadow-tst-card'
          : 'border-2 border-eden/25 bg-white shadow-tst-soft'
      )}
    >
      <AboutIcon id={icon} className="h-[32px] w-[26px]" />
    </span>
  );
}

/**
 * Left tile of every card: teal wash + glyph + letter-spaced caption.
 *
 * `labelClassName` exists for exactly one caller — the GENEous Lab card, which
 * opts out of SLOT_LABEL's frame-accurate `uppercase` to preserve the partner
 * brand's own casing. See the BRAND EXCEPTION note at the 04 kicker.
 */
function CardSlot({
  icon,
  label,
  accent = false,
  labelClassName,
  img,
  alt,
}: {
  icon: string;
  label: string;
  accent?: boolean;
  labelClassName?: string;
  img?: string;
  alt?: string;
}) {
  // Filling a slot hides its glyph + caption in the frame, so the photo replaces
  // the stand-in entirely. The tile stretches to the card's height (the frame's
  // slots are 145.5 / 171.9 / 198.8 / 328.2 tall — each card's own height) and
  // keeps the 317 width it has at sm and up.
  if (img) {
    return (
      <Photo
        src={img}
        alt={alt ?? ''}
        className="h-[180px] w-full shrink-0 self-stretch sm:h-auto sm:w-[317px]"
        sizes="(min-width: 640px) 317px, 100vw"
      />
    );
  }

  return (
    <div
      className={cn(
        'flex w-full shrink-0 flex-col items-center justify-center gap-[3px] px-[14px] py-8 sm:w-[317px] sm:py-10',
        accent
          ? 'bg-[linear-gradient(180deg,rgba(37,181,171,0.12),rgba(14,77,75,0.28))]'
          : 'bg-[linear-gradient(180deg,rgba(14,77,75,0.05),rgba(37,181,171,0.06))]'
      )}
    >
      <AboutIcon id={icon} className="h-[40px] w-[34px]" />
      <span className={cn(SLOT_LABEL, 'text-center', accent ? 'text-ice' : 'text-eden', labelClassName)}>
        {label}
      </span>
    </div>
  );
}

/** Static capsule inside the dark GENEous Lab card (white/10 on ink). */
function LabPill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-[8px]">
      <AboutIcon id={icon} className="h-[21px] w-[17px] shrink-0" />
      <span className="min-w-0 break-words font-kyg text-[13.5px] font-semibold leading-[20px] text-linenw">
        {label}
      </span>
    </span>
  );
}

/** Bottom summary chip. */
function FlowChip({ icon, label, solid }: { icon: string; label: string; solid: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-[49px] shrink-0 items-center gap-2 rounded-full px-[21px]',
        solid
          ? 'border border-eden bg-eden shadow-[0_12px_30px_0_rgba(14,77,75,0.28)]'
          : 'border border-mine/12 bg-white shadow-tst-soft'
      )}
    >
      <AboutIcon id={icon} className="h-[25px] w-[21px] shrink-0" />
      <span
        className={cn(
          'font-kyg text-[15px] font-extrabold leading-[17px] tracking-[0.02em]',
          solid ? 'text-linenw' : 'text-mine'
        )}
      >
        {label}
      </span>
    </span>
  );
}

/** 118px gradient hairline with the glowing bead at its head. */
function FlowLink() {
  return (
    <span
      aria-hidden
      className="relative hidden h-[2px] min-w-[24px] max-w-[118px] flex-1 rounded-[2px] bg-[linear-gradient(90deg,rgba(14,77,75,0.14),rgba(37,181,171,0.55),rgba(14,77,75,0.14))] md:block"
    >
      <span className="absolute left-[-3px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-[3.5px] bg-java shadow-[0_0_10px_0_rgba(37,181,171,0.85)]" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* section                                                                     */
/* -------------------------------------------------------------------------- */

export default function GenesToInsight() {
  return (
    <Section ground="sageFade" id="from-genes-to-insight" innerClassName="flex flex-col gap-14">
      {/* --- heading block ------------------------------------------------- */}
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-[15px] text-center">
        {/* pad 8/17/8/13, gap 9, 19x23 glyph and Figtree 700 13.5/20.2 ls 0.11em
            are the shared Eyebrow's own metrics now — and so is the uppercase:
            this node is textCase=UPPER. See the Eyebrow note in ui.tsx. */}
        <Eyebrow label="From genes to insight" icon="5612-606" />
        <Heading
          html={
            'It starts with something simple: <em class="abt-grad">your <br class="hidden sm:inline" />genes.</em>'
          }
          className="text-[clamp(28px,2.92vw,42px)] leading-[1.05] tracking-[-0.018em]"
        />
      </div>

      {/* --- the flowing-spine journey ------------------------------------- */}
      <div className="relative mx-auto w-full max-w-[860px] md:pl-[104px]">
        {/* the spine itself — hidden once the 104px rail collapses */}
        <span
          aria-hidden
          className="absolute inset-y-3 left-[44px] hidden w-[3px] rounded-full bg-[linear-gradient(180deg,rgba(34,34,34,0.05),#25b5ab,#0e4d4b,#25b5ab,rgba(34,34,34,0.05))] md:block"
        />

        <ol className="flex list-none flex-col gap-6">
          {STEPS.map((step) => (
            <li key={step.index} className="relative flex flex-col items-center md:block">
              <SpineNode icon={step.nodeIcon} />
              <div className="flex w-full flex-col overflow-hidden rounded-[24px] border border-mine/10 bg-white shadow-tst-soft sm:flex-row">
                <CardSlot
                  icon={step.slotIcon}
                  label={step.slotLabel}
                  img={step.slotImg}
                  alt={step.slotAlt}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-5 sm:p-[28px]">
                  <div className="flex items-baseline gap-[11px]">
                    <span className={cn(CARD_NUMBER, 'text-eden/30')}>{step.index}</span>
                    <span className={cn(CARD_KICKER, 'text-eden')}>{step.kicker}</span>
                  </div>
                  <h3 className={cn(CARD_TITLE, 'text-mine')}>{step.title}</h3>
                  <p className={cn(CARD_BODY, 'text-fusc')}>{step.body}</p>
                </div>
              </div>
            </li>
          ))}

          {/* 04 — GENEous Lab: trust & science, not an ad */}
          <li className="relative flex flex-col items-center md:block">
            <SpineNode icon="6412-322" accent />
            <div className="flex w-full flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#141b1a,#1e2b29)] sm:flex-row">
              {/* normal-case: the BRAND EXCEPTION described at the kicker below. */}
              <CardSlot
                icon="6529-536"
                label="GENEous Lab"
                accent
                labelClassName="normal-case"
                img="/about/img/geneous-lab.jpg"
                alt="Sequencing instruments running in a darkened laboratory."
              />
              <div className="relative min-w-0 flex-1 p-5 sm:p-[28px]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-[192px] w-[192px] rounded-full bg-java2/10 blur-[20px]"
                />
                <div className="relative flex flex-col gap-1.5">
                  <div className="flex items-baseline gap-[11px]">
                    <span className={cn(CARD_NUMBER, 'text-java2/40')}>04</span>
                    {/* BRAND EXCEPTION — the only deliberate deviation from the
                        frame's textCase on this page. y=6432.5 is textCase=UPPER
                        like its three sibling kickers, so the frame renders
                        "GENEOUS LAB", but that flattens the intentional GENE-ous
                        capitalisation of the partner's name. Product decision:
                        keep the brand's own casing here and in the slot caption
                        below. Everything else on the page stays frame-exact. */}
                    <span className={cn(CARD_KICKER, 'normal-case text-java2')}>GENEous Lab</span>
                  </div>
                  <h3 className={cn(CARD_TITLE, 'text-linenw')}>Testing With Our GENEous Lab Partner</h3>
                  <p className={cn(CARD_BODY, 'text-linenw/80')}>
                    Testing is powered through our GENEous Lab partner, NeoTech, helping turn your DNA sample into
                    genetic insights you can understand and explore.
                  </p>
                  {/* frame 'div.flex' is layout=VERTICAL pad=10/0/0/0 gap=10 — both
                      pills start at x=740, i.e. a left-aligned stack, not a row
                      that happens to wrap. */}
                  <div className="flex flex-col items-start gap-2.5 pt-2.5">
                    {LAB_PILLS.map((pill) => (
                      <LabPill key={pill.label} icon={pill.icon} label={pill.label} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </div>

      {/* --- visual flow summary ------------------------------------------- */}
      <div className="mx-auto flex w-full max-w-[900px] flex-wrap items-center justify-center gap-[9px]">
        {FLOW.map((chip, i) => (
          <Fragment key={chip.label}>
            {i > 0 ? <FlowLink /> : null}
            <FlowChip icon={chip.icon} label={chip.label} solid={chip.solid} />
          </Fragment>
        ))}
      </div>
    </Section>
  );
}

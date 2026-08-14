// =============================================================================
// About Us - SECTION 11 · THE BIGGER PICTURE
// -----------------------------------------------------------------------------
// Figma frame is 1400 wide inside the 1440 artboard; the shared <Section> rail
// (1280 → 1216 content) holds every child of this frame, whose widest block is
// the 1040 transformation row. Vertical rhythm is the frame's own 48px gap.
//
// RADIUS TRAP: the project remaps Tailwind's radius scale, so 16 and 24 are
// written as arbitrary values (rounded-[16px] / rounded-[24px]).
// =============================================================================

import { cn } from '@/lib/utils';

import { AboutIcon } from '../AboutIcon';
import { Body, Eyebrow, Heading, Pill, Section } from '../ui';

/** The three white capsules that head the left column. */
const SHIFTS = [
  { label: 'More personal.', icon: '12093-237' },
  { label: 'More data-driven.', icon: '12093-408' },
  { label: 'More preventive.', icon: '12144-237' },
] as const;

/** The "not this / but this" ladder in the right column. */
const STANCE = [
  {
    text: 'Not by making genetics sound complicated.',
    icon: '12070-765',
    strong: false,
  },
  {
    text: 'By making it understandable.',
    icon: '12142-766',
    strong: true,
  },
  {
    text: 'Not by telling people what their future will look like.',
    icon: '12214-765',
    strong: false,
  },
  {
    text: 'By helping them understand the information they already carry.',
    icon: '12299-766',
    strong: true,
  },
] as const;

/** One card of the reactive → personalized → preventive strip. */
function Stage({
  icon,
  chipClassName,
  label,
  labelClassName,
  body,
  bodyClassName,
  className,
  ornament = false,
}: {
  icon: string;
  chipClassName?: string;
  label: string;
  labelClassName: string;
  body: string;
  bodyClassName: string;
  className: string;
  ornament?: boolean;
}) {
  return (
    <div
      className={cn('relative flex min-w-0 flex-1 flex-col gap-2 overflow-hidden rounded-[24px] p-[28px]', className)}
    >
      {ornament ? (
        // The frame's blurred teal orb, clipped by the card's own corner radius.
        <span
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-java2/15 blur-[20px]"
        />
      ) : null}
      <span
        className={cn('relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px]', chipClassName)}
      >
        <AboutIcon id={icon} className="h-[28px] w-[24px]" />
      </span>
      {/*
        CASE: all three stage labels are textCase=UPPER in the frame - the frame
        renders REACTIVE HEALTHCARE / PERSONALIZED HEALTH / PREVENTIVE HEALTH.
        Figma keeps `characters` as the designer typed it and applies case
        separately via `style.textCase`, so the sentence-case strings passed in
        below are NOT the rendered text. Do not "correct" this `uppercase` away.
        The 0.12em tracking is the tell: that is uppercase tracking.
        Callers only pass a colour in `labelClassName`, so nothing here competes
        with `uppercase` in tailwind-merge's text-transform group.
      */}
      <p
        className={cn(
          'relative pt-2 font-kyg text-[13px] font-bold uppercase leading-[19.5px] tracking-[0.12em]',
          labelClassName
        )}
      >
        {label}
      </p>
      <p className={cn('relative break-words font-kyg text-[15px] leading-[1.375] sm:text-[16px]', bodyClassName)}>
        {body}
      </p>
    </div>
  );
}

/** The 26×32 chevron that sits between the stage cards on wide viewports. */
function StageArrow({ id }: { id: string }) {
  return (
    <span className="hidden shrink-0 items-center justify-center self-center lg:flex">
      <AboutIcon id={id} className="h-[32px] w-[26px]" />
    </span>
  );
}

export default function BiggerPicture() {
  return (
    <Section ground="veil" id="the-bigger-picture">
      <div className="flex flex-col items-center gap-12">
        {/* ── heading block (820 wide, centred) ───────────────────────────── */}
        <div className="flex w-full max-w-[820px] flex-col items-center gap-4 text-center">
          <Eyebrow label="The bigger picture" icon="11875-622" />
          <Heading
            className="text-[clamp(26px,2.8vw,40px)] leading-[1.05]"
            html={`We&apos;re moving from &quot;What&apos;s wrong with me?&quot; <br class="hidden md:inline" />to <em class="abt-grad">&quot;What should I do about it?&quot;</em>`}
          />
        </div>

        {/* ── two-column body (476 + 48 + 476) ────────────────────────────── */}
        <div className="grid w-full max-w-[1000px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex min-w-0 flex-col gap-[15px]">
            <div className="flex flex-wrap gap-2.5">
              {SHIFTS.map((shift) => (
                <Pill
                  key={shift.label}
                  label={shift.label}
                  icon={shift.icon}
                  // Frame: pad 8/16, gap 8, label Figtree 600 15/22.5, stroke only -
                  // no effects[], so the primitive's shadow-tst-soft has to go. It has
                  // to go via the arbitrary PROPERTY: `shadow-none` loses (tailwind-merge
                  // files shadow-tst-soft under shadow-color, so both classes survive,
                  // and v4 emits .shadow-tst-soft after .shadow-none) while `shadow-[none]`
                  // wins only through an invalid box-shadow list. [box-shadow:none] is
                  // emitted after the utilities and is a valid declaration.
                  className="px-4 py-2 [&>span]:text-[15px] [&>span]:leading-[22.5px] [box-shadow:none]"
                />
              ))}
            </div>
            <Body
              className="pt-1 text-[clamp(15px,1.22vw,17.5px)] leading-[1.62]"
              html="Healthcare is becoming more personal, more data-driven, more preventive. And genetics is becoming an increasingly important part of that conversation."
            />
            <Body
              className="text-[clamp(15px,1.22vw,17.5px)] leading-[1.62]"
              html="We want to make that conversation easier to enter."
            />
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            {STANCE.map((row) => (
              <div
                key={row.text}
                className={cn(
                  'flex items-center gap-4 rounded-[16px] px-5 py-4',
                  row.strong ? 'border-2 border-eden/25 bg-white shadow-tst-soft' : 'border border-mine/10 bg-linenw'
                )}
              >
                <AboutIcon id={row.icon} className="h-[26px] w-[22px] shrink-0" />
                <p
                  className={cn(
                    'min-w-0 break-words font-kyg text-[15.5px] leading-[1.5] sm:text-[16.5px]',
                    row.strong ? 'font-semibold text-[#2d2a24]' : 'font-normal text-fusc'
                  )}
                >
                  {row.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── reactive → personalized → preventive ────────────────────────── */}
        <div className="flex w-full max-w-[1040px] flex-col items-stretch gap-4 pt-2 lg:flex-row">
          <Stage
            icon="12449-241"
            className="border border-mine/10 bg-linenw"
            chipClassName="bg-mine/[0.06]"
            label="Reactive Healthcare"
            labelClassName="text-boulder"
            body="Wait for the problem. Then look for answers."
            bodyClassName="text-fusc"
          />
          <StageArrow id="12491-524" />
          <Stage
            icon="12449-607"
            className="border border-eden/20 bg-gradient-to-b from-java/10 to-white"
            chipClassName="bg-mint"
            label="Personalized Health"
            labelClassName="text-eden2"
            body="Use more information to understand the individual."
            bodyClassName="text-fusc"
          />
          <StageArrow id="12491-890" />
          <Stage
            icon="12448-972"
            className="bg-gradient-to-br from-eden to-eden2 pb-[30px]"
            label="Preventive Health"
            labelClassName="text-java2"
            body="Understand ourselves earlier and make more informed choices."
            bodyClassName="text-linenw/85"
            ornament
          />
        </div>

        {/* ── closing statement ───────────────────────────────────────────── */}
        <p className="w-full max-w-[820px] break-words pt-[15px] text-center font-kyg text-[clamp(22px,2.4vw,34px)] font-semibold leading-[1.26] text-mine">
          The future of healthcare shouldn&apos;t only be about treating problems better.{' '}
          <em className="abt-grad">It should also be about understanding ourselves earlier.</em>
        </p>
      </div>
    </Section>
  );
}

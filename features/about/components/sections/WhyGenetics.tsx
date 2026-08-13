// =============================================================================
// features/about — SECTION 03 · WHY GENETICS
// -----------------------------------------------------------------------------
// Figma: 'SECTION 03 · WHY GENETICS' 1440 x 779, pad 92 vertical,
//        ground GRADIENT_LINEAR(#faf6ef -> #eff6f5) === the `mintFade` ground
//        (linenw -> sage3), so the shared <Section> carries it verbatim.
//
// Geometry reproduced:
//   • two equal columns, 64px gap, vertically centred on each other
//     (frame: 636 + 64 + 636 = 1336; on the shared 1216 rail the split stays
//      50/50 at 576 + 64 + 576 — the design is a true half/half)
//   • left rail: 15px gap between every block, with the frame's own inner
//     top/bottom pads folded onto the paragraphs (8/1, 4/0, 9/0, 8/1)
//   • Not / Not / But: three 12px-radius rows, 12/16 pad, 12 gap; the third is
//     the emphasised one — solid white, 2px eden/25 stroke, shadow-tst-soft
//     (the frame's 0 4 14 .05 + 0 1 2 .04 exactly)
//   • right rail: 28px-radius white card, 32 pad, 24 gap, shadow-tst-card
//     (the frame's 0 18 50 .08 + 0 4 16 .06 exactly), holding a 5-step flow of
//     44x44 chips + 24px gradient connectors (44*5 + 24*4 = 316 ✓)
//
// RADIUS TRAP: 28 -> rounded-[28px], 16 -> rounded-[16px], 12 -> rounded-[12px].
// None of those map onto the remapped Tailwind scale, so all are arbitrary.
// =============================================================================

import { cn } from '@/lib/utils';
import { AboutIcon } from '../AboutIcon';
import { Body, Eyebrow, Heading, Section } from '../ui';

/** The frame's 3px x 24px connector: a 5-stop vertical gradient, fully rounded. */
const CONNECTOR =
  'bg-[linear-gradient(to_bottom,rgba(34,34,34,0.05)_0%,#25b5ab_25%,#0e4d4b_50%,#25b5ab_75%,rgba(34,34,34,0.05)_100%)]';

/** Not / Not / But — editorial contrast, verbatim from the frame. */
const CONTRAST = [
  {
    icon: '2775-69',
    text: 'Not to tell you exactly what will happen.',
    row: 'border border-mine/10 bg-white/60',
    label: 'font-normal text-fusc',
  },
  {
    icon: '2836-69',
    text: 'Not to put a label on your future.',
    row: 'border border-mine/10 bg-white/60',
    label: 'font-normal text-fusc',
  },
  {
    icon: '2898-70',
    text: 'But to give you another layer of information about yourself.',
    row: 'border-2 border-eden/25 bg-white shadow-tst-soft',
    label: 'font-semibold text-[#2d2a24]',
  },
] as const;

/**
 * Genes -> Genetic patterns -> Personal context -> Better questions -> Better decisions.
 *
 * CASE: these five chip labels are textCase=AS_TYPED in the frame — they are NOT in
 * the About uppercase manifest (the only two UPPER runs in this section are the
 * "Why genetics" eyebrow at y=2433.2 and the "How one layer becomes a decision"
 * card kicker at y=2523.3). "Genes" DOES appear as an UPPER run elsewhere on the
 * page (Hero, y=1107.3, 13px/0.14em) — same word, different node, different answer.
 * Do not add `uppercase` here; sentence case is what the frame renders.
 */
const FLOW = [
  { icon: '2576-796', label: 'Genes', chip: 'bg-eden', text: 'font-bold text-[#2d2a24]' },
  { icon: '2644-796', label: 'Genetic patterns', chip: 'bg-mint', text: 'font-bold text-[#2d2a24]' },
  { icon: '2712-796', label: 'Personal context', chip: 'bg-mint', text: 'font-bold text-[#2d2a24]' },
  { icon: '2780-796', label: 'Better questions', chip: 'bg-mint', text: 'font-bold text-[#2d2a24]' },
  {
    icon: '2848-796',
    label: 'Better decisions',
    chip: 'bg-gradient-to-br from-eden to-java',
    text: 'font-extrabold text-eden',
  },
] as const;

export default function WhyGenetics() {
  return (
    <Section ground="mintFade" id="why-genetics">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ── left rail ─────────────────────────────────────────────────── */}
        <div className="mx-auto flex w-full min-w-0 max-w-[636px] flex-col gap-[15px] lg:mx-0">
          {/* Frame: 178 x 38, pad 8/17/8/13, gap 9, Figtree 700 13.5/20.2 ls 1.49.
              The primitive's own metrics are a size up, so they are tuned here
              rather than a second eyebrow being built.

              CASE: textCase=UPPER in the frame (manifest y=2433.2, 13.5px/700,
              ls 0.11em, measured width 118 = "WHY GENETICS", which is what the
              13+19+9+118+17 = 176 ≈ 178 pill width is measured from). <Eyebrow>
              already emits `uppercase`; the [&>span]: overrides below retune size,
              weight, leading and tracking ONLY. Never add [&>span]:normal-case. */}
          <Eyebrow
            label="Why genetics"
            icon="2432-66"
            className="self-start gap-[9px] py-2 pl-[13px] pr-[17px] [&>img]:h-[23px] [&>img]:w-[19px] [&>span]:text-[13.5px] [&>span]:font-bold [&>span]:leading-5 [&>span]:tracking-[0.11em]"
          />

          {/* Figtree 700 42/44.1, ls -0.76 (-0.018em), #222222. */}
          <Heading
            html={
              'Your body comes with information. <em class="abt-grad">Most of us never get to read it.</em>'
            }
            className="text-[clamp(30px,2.92vw,42px)] leading-[1.05] tracking-[-0.018em]"
          />

          {/* Figtree 400 17.5/28.4 (1.62), #5b564e. Frame pad 8 top / 1 bottom. */}
          <Body
            html="Your genes contain variations that can influence how your body responds to different aspects of health, nutrition, fitness and lifestyle."
            className="pb-px pt-2 text-[clamp(15px,1.22vw,17.5px)] leading-[1.62]"
          />

          {/* Frame pad 4 top. */}
          <Body
            html="Genetic testing gives you a way to explore some of those patterns."
            className="pt-1 text-[clamp(15px,1.22vw,17.5px)] leading-[1.62]"
          />

          {/* Frame pad 9 top, gap 10. */}
          <ul className="flex flex-col gap-[10px] pt-[9px]">
            {CONTRAST.map((row) => (
              <li
                key={row.text}
                className={cn('flex items-start gap-3 rounded-[12px] px-4 py-3', row.row)}
              >
                <AboutIcon id={row.icon} className="h-6 w-5 shrink-0" />
                <span
                  className={cn(
                    'min-w-0 break-words font-kyg text-[clamp(14.5px,1.15vw,16.5px)] leading-[1.5]',
                    row.label,
                  )}
                >
                  {row.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Frame pad 8 top / 1 bottom. BOLDRUNS marks the closing sentence. */}
          <Body
            html="Because the more you understand, the better questions you can ask. <strong>And better questions can lead to better health decisions.</strong>"
            className="pb-px pt-2 text-[clamp(15px,1.22vw,17.5px)] leading-[1.62]"
          />
        </div>

        {/* ── right rail: the flow card ──────────────────────────────────── */}
        <div className="mx-auto flex w-full min-w-0 max-w-[636px] flex-col gap-[15px] lg:mx-0">
          {/* Padding steps up at xl, not sm. The uppercase kicker below measures
              306px, and between 1024 and 1280 this card's column is only ~382px
              — p-8 would leave 318px of content box at 1440 but just 302px at
              1024, wrapping the kicker in a band the frame keeps on one line.
              p-6 through that band clears it with 12px to spare. */}
          <div className="rounded-[28px] border border-mine/10 bg-white p-6 shadow-tst-card xl:p-8">
            <div className="flex flex-col gap-6">
              {/* Figtree 700 13/19.5, ls 1.82 (0.14em), #7a7a7a, centred.

                  CASE: textCase=UPPER in the frame (manifest y=2523.3, measured
                  width 306 = "HOW ONE LAYER BECOMES A DECISION"). The source
                  string is sentence case because Figma stores `characters` as
                  typed and applies case via style.textCase — keep `uppercase`. */}
              <p className="text-center font-kyg text-[13px] font-bold uppercase leading-[19.5px] tracking-[0.14em] text-boulder">
                How one layer becomes a decision
              </p>

              <ol className="flex flex-col">
                {FLOW.map((step, i) => (
                  <li key={step.label} className="flex flex-col">
                    {i > 0 ? (
                      <div
                        aria-hidden="true"
                        className="flex h-6 w-11 shrink-0 items-center justify-center"
                      >
                        <span className={cn('h-6 w-[3px] rounded-full', CONNECTOR)} />
                      </div>
                    ) : null}

                    <div className="flex min-h-11 items-center gap-4">
                      <span
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px]',
                          step.chip,
                        )}
                      >
                        <AboutIcon id={step.icon} className="h-[26px] w-[22px]" />
                      </span>
                      <span
                        className={cn(
                          'min-w-0 break-words font-kyg text-[clamp(15px,1.18vw,17px)] leading-[1.5]',
                          step.text,
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Figtree 400 14.5/21.8, #7a7a7a, centred. Frame pad 1 bottom. */}
          <p className="break-words pb-px text-center font-kyg text-[14.5px] font-normal leading-[21.8px] text-boulder">
            Genes read as an information layer, not a verdict.
          </p>
        </div>
      </div>
    </Section>
  );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { useScrollPin } from '../lib/use-scroll-pin';
import { Button, Icon, Lead, PHOTO, Rule, Section, SectionTitle, type IconName } from '../ui';

/**
 * The six directions, as a selector.
 *
 * The old build arranged these as six pills on a ring with an absolutely
 * positioned detail pane in the middle, driven by an angle per area. It needed
 * a filter chain per icon to fight colours baked into exported SVGs, it could
 * not survive a narrow viewport, and the ring read as decoration rather than as
 * something you could operate. This is the same six areas as a list you pick
 * from, which is what the ring was trying to be.
 */
type Area = {
  label: string;
  icon: IconName;
  question: string;
  detail: string;
  markers: string[];
  photo: string;
  alt: string;
  cta: string;
  href: string;
};

const AREAS: Area[] = [
  {
    label: 'My Everyday Health',
    icon: 'heart',
    question: 'Why does my body respond the way it does?',
    detail:
      'Explore genetic insights related to nutrition, weight, fitness, metabolism, vitamins, food sensitivities, stress, sleep and more.',
    markers: ['Nutrition', 'Weight', 'Fitness', 'Metabolism', 'Vitamins', 'Food sensitivities', 'Stress', 'Sleep'],
    photo: PHOTO.care2,
    alt: 'A home-cooked meal of dal, rice and greens in morning light',
    cta: 'Explore Wellness',
    href: '/categories/wellness',
  },
  {
    label: 'Our Future Family',
    icon: 'users',
    question: 'What should we know before having a child?',
    detail:
      'Carrier screening and reproductive genetic testing can help prospective parents better understand certain inherited genetic risks before or during family planning.',
    markers: ['Carrier screening', 'Reproductive genetics', 'Family planning'],
    photo: PHOTO.care1,
    alt: 'A counsellor talking a client through their report',
    cta: 'Explore Reproductive Genetics',
    href: '/categories',
  },
  {
    label: 'My Inherited Health',
    icon: 'dna',
    question: 'What could my family history mean for me?',
    detail:
      'Explore genetic testing related to hereditary cancer predispositions, BRCA, cardiovascular health, hypertension, kidney health, eye health and other inherited conditions.',
    markers: ['Hereditary cancer', 'BRCA', 'Cardiovascular', 'Kidney health', 'Eye health'],
    photo: PHOTO.care3,
    alt: 'A clinician welcoming a patient at a clinic door',
    cta: 'Explore Health Tests',
    href: '/categories',
  },
  {
    label: 'My Origins',
    icon: 'globe',
    question: 'Where did my story begin?',
    detail:
      'Explore your genetic ancestry, origins and inherited traits, and discover another side of the story that made you, you.',
    markers: ['Ancestry', 'Origins', 'Inherited traits'],
    photo: PHOTO.life3,
    alt: 'A young couple talking on a rooftop at golden hour',
    cta: 'Explore Ancestry',
    href: '/categories/wellness/ancestry',
  },
  {
    label: 'My Longevity',
    icon: 'hourglass',
    question: 'What can I learn about how I’m aging?',
    detail:
      'Explore telomere, epigenetic age, longevity and healthy-aging insights to understand another dimension of your biological story.',
    markers: ['Telomeres', 'Epigenetic age', 'Healthy aging'],
    photo: PHOTO.life5,
    alt: 'An older adult tending plants on a sunlit balcony',
    cta: 'Explore Longevity',
    href: '/categories',
  },
  {
    label: 'My Clinical Genetics',
    icon: 'crosshair',
    question: 'I need answers about a specific health concern.',
    detail:
      'Access specialty genetic testing supported by appropriate expert guidance and a trusted laboratory ecosystem.',
    markers: ['Specialty testing', 'Expert guidance', 'Trusted labs'],
    photo: PHOTO.lab,
    alt: 'A genomics laboratory bench with sequencing equipment',
    cta: 'Explore Clinical Tests',
    href: '/categories',
  },
];

/**
 * `eyebrowTone` picks which of the design's two dark pills opens the section -
 * see `Eyebrow` in ui/SectionTitle. The design draws the teal one here; `ink`
 * is what the section has shipped with.
 */
export default function ExploreKyg({
  eyebrowTone = 'dark',
  /**
   * Hold the section still and let page-scroll walk the six directions, the way
   * 04 walks the life curve and 07 walks the step track.
   */
  pinned = false,
}: { eyebrowTone?: 'dark' | 'teal'; pinned?: boolean } = {}) {
  const { track, pane, walked, pinning, scrollToWalked } = useScrollPin();
  const [clicked, setClicked] = useState(0);

  // SCROLL OWNS THE CHOICE AT EVERY WIDTH: above md it is the walk through the
  // pin, below md the section's own travel through the viewport.
  //
  // What made this jump before was not the scroll - it was MOVING one panel
  // between the rows. A tall block re-ordered past a list item teleports every
  // item it crosses. Below md each row now owns its own panel and they open and
  // close by animating height, so one shrinks exactly as the next grows: the
  // rows slide instead of hopping, and the section's total height never
  // changes, which is also why the scroll maths cannot oscillate.
  const driven = pinned;
  const active = driven ? Math.min(AREAS.length - 1, Math.floor(walked * AREAS.length)) : clicked;
  const area = AREAS[active]!;

  /**
   * One card's contents. Rendered once per row below md (each row owns its own,
   * so both the closing and the opening panel exist during the transition) and
   * once beside the list from md up.
   */
  const panel = (a: Area) => (
    <>
      <div className="relative aspect-[24/7] max-h-[min(22vh,240px)] w-full">
        <Image src={a.photo} alt={a.alt} fill sizes="(max-width: 1023px) 100vw, 60vw" className="object-cover" />
      </div>

      <div className="px-[clamp(20px,2.4vw,32px)] pb-[clamp(24px,2.6vw,30px)] pt-[clamp(22px,2.4vw,28px)]">
        <span className="inline-flex items-center gap-[10px] font-kyg text-[11.5px] font-bold uppercase tracking-[0.16em] text-java2">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-sm bg-java2/[0.14]">
            <Icon name={a.icon} className="h-[14px] w-[14px]" />
          </span>
          {a.label}
        </span>

        <h3 className="mt-[16px] font-kyg text-[clamp(21px,2.2vw,30px)] font-bold leading-[1.2] tracking-[-0.025em] text-linenw">
          {a.question}
        </h3>

        <p className="mt-[12px] font-kyg text-[16.5px] leading-[1.6] text-linenw/70">{a.detail}</p>

        <ul className="mt-[20px] flex list-none flex-wrap gap-[8px]">
          {a.markers.map((m) => (
            <li
              key={m}
              className="rounded-sm bg-linenw/[0.06] px-[11px] py-[6px] font-kyg text-[13px] text-linenw/[0.78] ring-1 ring-inset ring-linenw/[0.1]"
            >
              {m}
            </li>
          ))}
        </ul>

        <div className="mt-[24px] flex">
          <Button href={a.href} variant="onDark">
            {a.cta}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Section id="what-would-you-like-to-know" ground="ink" labelledBy="explore-kyg-heading">
      {/* The pin, from md up and only when asked for. Below that the track is
          auto-height, the pane is static, and progress comes from the section's
          own travel through the viewport instead. */}
      <div ref={track} className={cn('relative', pinned && 'md:h-[240vh]')}>
        <div
          ref={pane}
          className={cn(
            pinned &&
              'md:sticky md:top-[var(--site-header-h,104px)] md:flex md:h-[calc(100svh-var(--site-header-h,104px))] md:flex-col md:justify-center'
          )}
        >
          <SectionTitle
            id="explore-kyg-heading"
            eyebrow="Explore KYG"
            tone="dark"
            eyebrowTone={eyebrowTone}
            aside={
              <Lead tone="dark">
                Six directions, one set of genes. Choose the question that sounds most like yours.
              </Lead>
            }
          >
            What would you like to know <em>about yourself?</em>
          </SectionTitle>

          <div className="mt-[clamp(18px,min(3.7vw,3.6vh),52px)] grid gap-[8px] md:gap-[clamp(20px,2.2vw,32px)] md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,404px)_minmax(0,1fr)]">
            {/* The picker. Buttons, not links: choosing a direction changes what is
            shown here, it does not navigate - the CTA inside the panel does. */}
            <ul className="grid list-none gap-[8px]">
              {AREAS.map((a, i) => {
                const on = i === active;
                return (
                  <li key={a.label} className="scroll-mt-[calc(var(--site-header-h,104px)+12px)]">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={(e) => {
                        if (!driven) {
                          setClicked(i);
                          // Bring the row to the top so the panel that just
                          // opened under it is on screen, not below the fold.
                          e.currentTarget.closest('li')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          return;
                        }
                        scrollToWalked(i / AREAS.length + 0.5 / AREAS.length);
                      }}
                      className={cn(
                        'flex w-full items-center gap-[14px] rounded-sm py-[14px] pl-[14px] pr-[18px] text-left',
                        'transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        on
                          ? 'bg-java2 text-abyss shadow-[0_10px_30px_-12px_rgba(42,195,162,0.6)]'
                          : 'bg-linenw/[0.045] text-linenw/[0.86] ring-1 ring-inset ring-linenw/[0.12] hover:bg-linenw/[0.08]'
                      )}
                    >
                      <span
                        className={cn(
                          'grid h-[38px] w-[38px] shrink-0 place-items-center rounded-sm',
                          on ? 'bg-abyss/[0.12] text-abyss' : 'bg-linenw/[0.07] text-ice'
                        )}
                      >
                        <Icon name={a.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1 font-kyg text-[15.5px] font-semibold leading-[1.3]">
                        {a.label}
                      </span>
                      <Icon
                        name="chevron"
                        strokeWidth={2}
                        className={cn('h-[18px] w-[18px]', on ? null : 'opacity-40')}
                      />
                    </button>

                    {/* Below md the card opens under its own row.
                        `grid-template-rows: 0fr -> 1fr` is what makes that
                        animatable at all - height cannot transition to `auto`,
                        and a max-height guess either clips the tallest card or
                        makes the short ones drift open. Every row keeps its
                        panel, so the one closing and the one opening are both
                        present and move together. */}
                    <div
                      className={cn(
                        'grid md:hidden',
                        'motion-safe:transition-[grid-template-rows] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
                        on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="mt-[8px] min-w-0 overflow-hidden rounded-sm bg-linenw/[0.04] ring-1 ring-inset ring-linenw/[0.12]">
                          {panel(a)}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* From md up: the one panel, beside the list. */}
            <div className="hidden min-w-0 overflow-hidden rounded-sm bg-linenw/[0.04] ring-1 ring-inset ring-linenw/[0.12] md:block">
              {panel(area)}
            </div>
          </div>

          <Rule tone="dark" className="mt-[clamp(14px,min(3vw,2.8vh),40px)]" />

          <div className="mt-[24px] flex flex-wrap items-center justify-between gap-[20px]">
            <p className="font-tst text-[clamp(18px,1.7vw,23px)] font-medium italic leading-[1.3] text-linenw/70">
              One you. A lifetime of genetic insight.
            </p>
            <Button href="/categories" variant="onDark">
              Explore Genetic Testing
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

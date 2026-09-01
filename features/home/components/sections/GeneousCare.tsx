import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button, Icon, Lead, PHOTO, Rule, Section, SectionTitle, type IconName } from '../ui';

/**
 * Result → Context → Understanding → Next step.
 *
 * The tint escalates across the four (eden at 5 / 10 / 15 percent, then solid)
 * so the row reads as a progression rather than as four equal chips. This is the
 * section's actual argument, and the old build rendered it as four 54px pills
 * adrift between two lead paragraphs, where it read as decoration.
 */
const FLOW = [
  { label: 'Result', skin: 'bg-eden/[0.05] text-nevada ring-eden/10' },
  { label: 'Context', skin: 'bg-eden/[0.1] text-[#3b5e5c] ring-eden/[0.22]' },
  { label: 'Understanding', skin: 'bg-eden/[0.15] text-[#1b5250] ring-eden/[0.34]' },
  { label: 'Next step', skin: 'bg-eden text-linenw ring-0' },
];

const CARDS: { icon: IconName; title: string; body: string; photo: string; alt: string }[] = [
  {
    icon: 'messages',
    title: 'Genetic counselling',
    body: 'Support in understanding what your genetic information means.',
    photo: PHOTO.care1,
    alt: 'A genetic counsellor talking a client through their report',
  },
  {
    icon: 'leaf',
    title: 'Wellness guidance',
    body: 'Help in making sense of the insights relevant to you.',
    photo: PHOTO.care2,
    alt: 'Everyday home food and a glass of water in morning light',
  },
  {
    icon: 'route',
    title: 'Appropriate referral',
    body: 'Referral to the appropriate healthcare professional where needed.',
    photo: PHOTO.care3,
    alt: 'A clinician welcoming a patient at a clinic door',
  },
];

export default function GeneousCare() {
  return (
    <Section id="geneous-care" ground="sand" labelledBy="care-heading">
      {/* CASE TRAP: "GENEous" is a GENE + genius lockup whose lowercase middle
          is the whole joke. This is the one eyebrow on the page that is not
          upper-cased, and it is deliberate. */}
      <SectionTitle id="care-heading" eyebrow="GENEous Care" eyebrowCaps={false}>
        A report shouldn&rsquo;t be the end of the conversation. <em>It should be the beginning of a better one.</em>
      </SectionTitle>

      <p className="mt-[20px] max-w-[56ch] font-kyg text-[clamp(19px,1.45vw,24px)] leading-[1.46] tracking-[-0.015em] text-heavy2">
        Getting your results is one thing. Understanding what they mean for you is another.
      </p>

      <ol
        role="group"
        aria-label="From result to next step"
        className="mt-[clamp(16px,min(3.2vw,3vh),44px)] grid list-none gap-[12px] sm:grid-cols-2 lg:grid-cols-4"
      >
        {FLOW.map((s) => (
          <li
            key={s.label}
            className={cn(
              'grid min-h-[62px] place-items-center rounded-sm px-[22px] py-[13px] text-center',
              'font-kyg text-[16px] font-bold leading-[1.4] tracking-[-0.01em] ring-1 ring-inset',
              s.skin
            )}
          >
            {s.label}
          </li>
        ))}
      </ol>

      <Lead className="mt-[clamp(14px,min(3vw,2.8vh),40px)] max-w-[70ch]">
        With GENEous Care, KYG helps you make sense of your results, understand their context and identify appropriate
        next steps. Depending on your test and needs, that may include:
      </Lead>

      <ul className="mt-[clamp(12px,min(2.4vw,2.2vh),30px)] grid list-none gap-[clamp(18px,2vw,26px)] md:grid-cols-3">
        {CARDS.map((c) => (
          <li
            key={c.title}
            className="group flex h-full min-w-0 flex-col rounded-sm bg-linenw shadow-[0_1px_2px_0_rgba(45,32,18,0.05),0_4px_14px_0_rgba(45,32,18,0.05)] transition-[translate,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[7px] hover:shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)] motion-reduce:transition-none"
          >
            {/* The badge straddles the photo's bottom edge, which is why it is a
                sibling of the figure and not a child - the figure clips. */}
            <div className="relative">
              <div className="relative aspect-[16/10] max-h-[min(24vh,260px)] w-full overflow-hidden rounded-t-sm">
                <Image src={c.photo} alt={c.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" />
              </div>
              <span
                aria-hidden="true"
                className="absolute -bottom-[25px] left-[22px] z-[3] grid h-12 w-12 place-items-center rounded-sm bg-linenw text-eden shadow-[0_8px_22px_0_rgba(45,32,18,0.14)] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:-rotate-[5deg] group-hover:bg-eden group-hover:text-linenw motion-reduce:transition-none"
              >
                <Icon name={c.icon} className="h-[23px] w-[23px]" />
              </span>
            </div>

            {/* 44px of top padding is what clears the badge. */}
            <div className="flex min-w-0 flex-1 flex-col px-[clamp(20px,2vw,26px)] pb-[clamp(24px,2.4vw,30px)] pt-[44px]">
              <h3 className="font-kyg text-[clamp(19px,1.3vw,21px)] font-bold leading-[1.28] tracking-[-0.015em] text-zeus transition-colors duration-500 group-hover:text-eden motion-reduce:transition-none">
                {c.title}
              </h3>
              <p className="mt-[10px] font-kyg text-[16px] leading-[1.6] text-fusc">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <Rule className="mt-[clamp(16px,min(3.6vw,3vh),48px)]" />

      <div className="mt-[28px] flex flex-wrap items-center justify-between gap-[22px]">
        <p className="max-w-[34ch] font-tst text-[clamp(19px,2vw,27px)] font-medium italic leading-[1.3] text-heavy2">
          Because information becomes more valuable when you understand it.
        </p>
        <Button href="/contact">Discover GENEous Care</Button>
      </div>
    </Section>
  );
}

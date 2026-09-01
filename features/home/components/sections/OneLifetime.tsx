import Image from 'next/image';

import { Button, PHOTO, Section, SectionTitle } from '../ui';
import { Icon, type IconName } from '../ui';

/**
 * Five moments, in the order a life reaches them.
 *
 * The old build ran these along a hand-drawn curve 1360px wide, with the copy
 * alternating above and below it. That geometry only existed at one artboard
 * width - below it the curve overshot the rail and the stations detached from
 * their captions. This is the same five stations as an ordinary sequence, which
 * survives every width and says the same thing.
 */
const STATIONS: { n: string; icon: IconName; title: string; line: string; photo: string; alt: string }[] = [
  {
    n: '01',
    icon: 'crosshair',
    title: 'Before you were born',
    line: 'It was already written.',
    photo: PHOTO.life1,
    alt: 'A newborn’s hand curled around a parent’s finger',
  },
  {
    n: '02',
    icon: 'users',
    title: 'When you grew',
    line: 'It shaped how you responded.',
    photo: PHOTO.life3,
    alt: 'A young couple talking on a rooftop at golden hour',
  },
  {
    n: '03',
    icon: 'heart',
    title: 'When you fell in love',
    line: 'It was part of what you would pass on.',
    photo: PHOTO.life5,
    alt: 'A man walking outdoors on an early morning',
  },
  {
    n: '04',
    icon: 'users',
    title: 'When you thought of family',
    line: 'It mattered more than ever.',
    photo: PHOTO.care1,
    alt: 'Two women talking across a table over a report',
  },
  {
    n: '05',
    icon: 'dna',
    title: 'As your body changes',
    line: 'It remains part of your story.',
    photo: PHOTO.life2,
    alt: 'An older woman tending plants on a sunlit balcony',
  },
];

export default function OneLifetime() {
  return (
    <Section id="one-lifetime-one-dna" ground="ink" labelledBy="one-life-heading">
      <SectionTitle id="one-life-heading" eyebrow="One life. One DNA." tone="dark">
        Before you knew yourself, <em>your genes were already there.</em>
      </SectionTitle>

      <ol className="mt-[clamp(18px,min(3.7vw,3.6vh),52px)] grid list-none gap-[clamp(16px,1.8vw,24px)] sm:grid-cols-2 lg:grid-cols-5">
        {STATIONS.map((s) => (
          <li
            key={s.n}
            className="flex min-w-0 flex-col rounded-sm bg-linenw/[0.045] p-[18px] ring-1 ring-inset ring-linenw/[0.1]"
          >
            <div className="relative mb-[14px] aspect-[16/11] max-h-[min(16vh,170px)] w-full overflow-hidden rounded-sm">
              <Image
                src={s.photo}
                alt={s.alt}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 20vw"
                className="object-cover"
              />
            </div>

            <span className="grid h-10 w-10 place-items-center rounded-sm bg-java2/[0.14] text-ice">
              <Icon name={s.icon} className="h-[19px] w-[19px]" />
            </span>

            <h3 className="mt-[14px] font-kyg text-[17.5px] font-bold leading-[1.28] tracking-[-0.015em] text-linenw">
              {s.title}
            </h3>
            <p className="mt-[6px] font-kyg text-[15px] leading-[1.55] text-linenw/60">{s.line}</p>
          </li>
        ))}
      </ol>

      <div className="mt-[clamp(16px,min(3.2vw,3vh),44px)] flex">
        <Button href="/categories" variant="onDark">
          Explore Genetic Testing
        </Button>
      </div>
    </Section>
  );
}

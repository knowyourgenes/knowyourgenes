'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button, Icon, Lead, PHOTO, Section, SectionTitle } from '../ui';

const POSTS = [
  {
    title: 'Wellness & Genetics',
    photo: PHOTO.jrn1,
    alt: 'Lacing a running shoe on the front steps at dawn',
    href: '/blog?topic=wellness-genetics',
  },
  {
    title: 'Genes & Family',
    photo: PHOTO.jrn2,
    alt: 'Three generations looking through old family photographs',
    href: '/blog?topic=genes-family',
  },
  {
    title: 'Cancer Genetics',
    photo: PHOTO.jrn3,
    alt: 'Two women walking together on a tree-lined road',
    href: '/blog?topic=cancer-genetics',
  },
  {
    title: 'Reproductive Health',
    photo: PHOTO.jrn4,
    alt: 'A couple talking over chai at their kitchen table',
    href: '/blog?topic=reproductive-health',
  },
  {
    title: 'Longevity',
    photo: PHOTO.jrn5,
    alt: 'An older woman tending plants on a sunlit balcony',
    href: '/blog?topic=longevity',
  },
  {
    title: 'Ancestry',
    photo: PHOTO.jrn6,
    alt: 'A hand-drawn family tree and old photographs on a table',
    href: '/blog?topic=ancestry',
  },
];

const CARD = 'w-[clamp(250px,25vw,316px)] shrink-0 snap-start';

/**
 * The rail is a carousel, at every width - it is never a grid that happens to
 * scroll. Two things say so: the next card is always half-visible past the right
 * edge, and the prev/next controls sit under it.
 *
 * The old build had the scroll behaviour and neither cue, so it read as a
 * cropped grid and nobody scrolled it.
 */
export default function Journal() {
  const rail = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setAtStart(el.scrollLeft < 8);
    setAtEnd(max - el.scrollLeft < 8);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 700), behavior: 'smooth' });
  };

  return (
    <Section id="the-journal" ground="cream" labelledBy="journal-heading" innerClassName="pb-[clamp(40px,4.4vw,64px)]">
      <SectionTitle
        id="journal-heading"
        eyebrow="The journal"
        aside={
          <div>
            <p className="font-kyg text-[clamp(19px,1.45vw,24px)] leading-[1.46] tracking-[-0.015em] text-heavy2">
              The more you know, the better you can ask.
            </p>
            <Lead className="mt-[14px] max-w-[64ch]">
              Stories, explainers, myths, conversations and the questions about your body you&rsquo;ve probably wondered
              about but never knew whom to ask.
            </Lead>
          </div>
        }
      >
        Discover genetics <em>without the textbook.</em>
      </SectionTitle>

      {/* The rail bleeds one gutter so card one starts on the headline's x and
          the row runs off the viewport edge. */}
      <ul
        ref={rail}
        onScroll={measure}
        className={cn(
          'mt-[clamp(18px,min(3.7vw,3.6vh),52px)] flex list-none snap-x snap-mandatory gap-[clamp(16px,1.8vw,24px)]',
          '-mx-[var(--gutter,clamp(18px,3vw,40px))] px-[var(--gutter,clamp(18px,3vw,40px))]',
          'overflow-x-auto overscroll-x-contain scroll-px-[var(--gutter,clamp(18px,3vw,40px))] pb-[14px] pt-[14px]',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )}
      >
        {POSTS.map((p) => (
          <li key={p.title} className={CARD}>
            <Link href={p.href} className="group block">
              <div className="relative aspect-[4/3] max-h-[min(26vh,280px)] w-full overflow-hidden rounded-sm shadow-[0_1px_2px_0_rgba(45,32,18,0.05),0_4px_14px_0_rgba(45,32,18,0.05)] transition-[translate,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)] motion-reduce:transition-none">
                <Image src={p.photo} alt={p.alt} fill sizes="316px" className="object-cover" />
              </div>
              <p className="mt-[18px] font-kyg text-[19px] font-bold leading-[1.28] tracking-[-0.018em] text-zeus transition-colors duration-500 group-hover:text-eden motion-reduce:transition-none">
                {p.title}
              </p>
              <span className="mt-[10px] inline-flex items-center gap-2 font-kyg text-[15px] font-bold text-eden">
                Read
                <Icon
                  name="arrow"
                  strokeWidth={2}
                  className="h-[17px] w-[17px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </span>
            </Link>
          </li>
        ))}

        {/* The one card that is not an article. */}
        <li className={CARD}>
          <Link href="#meet-genee" className="group block">
            <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-sm bg-[linear-gradient(158deg,#0e4d4b_0%,#0a3b39_100%)] p-[28px] text-center shadow-[0_1px_2px_0_rgba(45,32,18,0.05),0_4px_14px_0_rgba(45,32,18,0.05)] transition-[translate,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 motion-reduce:transition-none">
              <Icon name="chat" className="h-[72px] w-[72px] text-java2" strokeWidth={1.4} />
            </div>
            <p className="mt-[18px] font-kyg text-[19px] font-bold leading-[1.28] tracking-[-0.018em] text-zeus">
              Ask GENEe
            </p>
            <p className="mt-[5px] font-kyg text-[16px] leading-[1.45] text-fusc">Bring your genetics questions.</p>
            <span className="mt-[10px] inline-flex items-center gap-2 font-kyg text-[15px] font-bold text-eden">
              Ask
              <Icon name="arrow" strokeWidth={2} className="h-[17px] w-[17px]" />
            </span>
          </Link>
        </li>
      </ul>

      <div className="mt-[clamp(16px,min(3.2vw,3vh),44px)] flex flex-wrap items-center justify-between gap-[20px]">
        <Button href="/blog">Explore The Journal</Button>

        <div className="flex items-center gap-[24px]">
          <div aria-hidden="true" className="h-[3px] w-[200px] overflow-hidden rounded-sm bg-eden/[0.13]">
            <div
              className="h-full rounded-sm bg-eden transition-[width] duration-300"
              style={{ width: `${Math.max(12, progress * 100)}%` }}
            />
          </div>
          <div className="flex gap-[10px]">
            {(
              [
                ['Previous', -1, atStart],
                ['Next', 1, atEnd],
              ] as const
            ).map(([label, dir, disabled]) => (
              <button
                key={label}
                type="button"
                aria-label={`${label} journal entries`}
                disabled={disabled}
                onClick={() => nudge(dir)}
                className={cn(
                  'grid h-12 w-12 place-items-center rounded-sm ring-[1.5px] ring-inset transition duration-300',
                  disabled
                    ? 'text-eden/30 ring-eden/[0.14]'
                    : 'text-eden ring-eden/[0.28] hover:bg-eden/[0.06] hover:ring-eden/55'
                )}
              >
                <Icon name="chevron" strokeWidth={2} className={cn('h-5 w-5', dir === -1 && 'rotate-180')} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Section } from '../ui';

/**
 * The accreditation strip.
 *
 * `alt` is the accreditation NAME, not a description of the artwork - these are
 * claims about the lab, so they have to reach a screen reader rather than being
 * decorative chrome.
 *
 * THE CREAM GROUND IS LOAD-BEARING. Most of these are white-ground JPEGs on
 * `mix-blend-multiply`, which is what drops those white boxes out into the band.
 * Move this onto any other ground and five pale rectangles come back. ISO is the
 * exception - it is a transparent WebP and needs no help, but multiply is a
 * no-op on a fully transparent pixel, so it can stay in the same rule.
 *
 * THEY ARE IN COLOUR AND AT FULL STRENGTH. They used to sit at `grayscale` and
 * 60% opacity and only come up on hover - which meant a phone, where nothing
 * hovers, never saw them properly at all. These are accreditations: NABL, ISO,
 * FDA. Their whole job is to be recognised on sight, and a grey ghost of a mark
 * you have to point at is not doing that job.
 *
 * IT SCROLLS ON A PHONE ONLY. Six marks do not fit across 354px, so below `md`
 * the track holds the set twice and translates by exactly -50% - one full copy
 * passes and the loop never seams. Pointing at it pauses the animation, which
 * is the only way to read a mark that is mid-travel.
 *
 * From `md` up they all fit, so it stays the centred static row it has always
 * been. `prefers-reduced-motion` gets that same row at every width.
 */
const CERTS = [
  { src: '/home/brand/nabl.jpg', alt: 'NABL accreditation', w: 520, h: 300 },
  // Its OWN size, not the strip's 520x300. The mark is sized by height with an
  // auto width, so the intrinsic ratio is what reserves the box before the file
  // arrives - give ISO the wordmarks' 1.73 and its 1.21 globe snaps narrower on
  // load, shunting every logo after it sideways.
  { src: '/home/brand/iso.webp', alt: 'ISO certification', w: 1097, h: 908 },
  { src: '/home/brand/acmg.jpg', alt: 'ACMG guidelines', w: 520, h: 300 },
  { src: '/home/brand/cpic.jpg', alt: 'CPIC guidelines', w: 520, h: 300 },
  { src: '/home/brand/fda.jpg', alt: 'FDA reference', w: 520, h: 300 },
  { src: '/home/brand/hipaa.jpg', alt: 'HIPAA aligned data handling', w: 520, h: 300 },
];

/**
 * One step of the rhythm: the mark, then the gap that follows it.
 *
 * Trailing padding, so the last mark of a copy is spaced off the first mark of
 * the next one and the seam is the same width as every other gap. But padding
 * AFTER the last item is width the static row would centre on - it pushed that
 * row half a gap left of the heading above it - so the static cases drop it and
 * take a real `gap-x` instead (see ROW), which puts no space on the outside.
 *
 * Written out rather than built from a shared constant: Tailwind scans source
 * for whole class strings, and an interpolated one is never emitted.
 */
const GAP = 'pr-[clamp(29px,4.4vw,70px)] md:pr-0 motion-reduce:pr-0';

/** The static row's own spacing, replacing GAP from `md` up. */
const ROW =
  'md:gap-x-[clamp(29px,4.4vw,70px)] md:gap-y-[clamp(18px,2vw,28px)] ' +
  'motion-reduce:gap-x-[clamp(29px,4.4vw,70px)] motion-reduce:gap-y-[clamp(18px,2vw,28px)]';

/**
 * 10% up from the strip's original clamp(40px, 4.6vw, 64px).
 *
 * Height, never width - the six marks have six different aspect ratios (the new
 * ISO globe is 1.21 against the wordmarks' 1.73), and a shared width would set
 * them at six different optical sizes.
 */
const MARK = 'h-[clamp(44px,5.06vw,70px)] w-auto max-w-none';

export default function Certifications() {
  return (
    <Section ground="cream" labelledBy="certs-heading" innerClassName="py-[clamp(40px,4.4vw,64px)]">
      <div className="flex flex-col items-center bg-linenw">
        <h2
          id="certs-heading"
          className="w-full text-center font-kyg text-[14px] font-extrabold uppercase tracking-[0.16em] text-boulder"
        >
          Verified laboratory / certification logos
        </h2>

        {/*
          `py` IS FOR THE HOVER, not for looks. The rail is exactly as tall as an
          unscaled mark, so `hover:scale-110` put 3.5px of a 70px logo past the
          top and bottom and `overflow-hidden` cut it off. It reads as a crop on
          the ISO globe - ink right up to its edge - and is invisible on the
          wordmarks, which carry their own whitespace, but it was happening to
          all six.

          `overflow-hidden` is only there to clip the moving track, so from `md`
          up - where the row is static and nothing overflows sideways - it comes
          off entirely. It cannot be dropped on one axis alone: hiding either
          axis forces the other out of `visible`, which is why the padding has
          to carry the phone case.
        */}
        <div className="kyg-certs-strip group mt-[clamp(28px,3.4vw,48px)] w-full overflow-hidden py-[6px] md:overflow-visible">
          {/*
            `w-max` so the track is as wide as its contents rather than as wide
            as the rail - without it there is nothing to translate.

            Under `prefers-reduced-motion` it stops AND wraps back into the
            centred static row it used to be. Stopping alone would leave the
            track parked at translateX(0) with everything past the rail's right
            edge unreachable - on a phone that is four of the six marks.
          */}
          <div
            className={cn(
              // `bg-linenw` IS THE MULTIPLY. Five of the six marks are
              // white-ground JPEGs knocked out by `mix-blend-multiply`, which
              // blends against the backdrop inside the nearest stacking
              // context - and an animated transform creates one, so the moment
              // this track started moving the images were blending against
              // nothing and the white boxes came back. The cream has to be
              // painted on the isolating element itself.
              'flex w-max animate-kyg-marquee items-center bg-linenw',
              'group-hover:[animation-play-state:paused]',
              // The static row, in the two cases that want it. `md` and
              // `motion-reduce` cannot be expressed as one variant, so the same
              // values are written twice.
              'md:w-full md:animate-none md:flex-wrap md:justify-center',
              'motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center'
            )}
          >
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                // The second copy is the same six claims again. Announcing them
                // twice is noise, so only the first one is read.
                aria-hidden={copy > 0}
                className={cn(
                  'flex w-max list-none items-center',
                  // The duplicate exists only to make the loop seamless. Once
                  // the row is static it is six logos printed twice.
                  copy > 0 && 'md:hidden motion-reduce:hidden',
                  'md:w-auto md:flex-wrap md:justify-center',
                  'motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center',
                  ROW
                )}
              >
                {CERTS.map((c) => (
                  <li key={c.src} className={GAP}>
                    <Image
                      src={c.src}
                      alt={copy > 0 ? '' : c.alt}
                      width={c.w}
                      height={c.h}
                      className={cn(
                        MARK,
                        'mix-blend-multiply transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        'hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100'
                      )}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

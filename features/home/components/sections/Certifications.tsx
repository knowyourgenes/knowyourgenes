import Image from 'next/image';

import { Section } from '../ui';

/**
 * The accreditation strip.
 *
 * `alt` is the accreditation NAME, not a description of the artwork - these are
 * claims about the lab, so they have to reach a screen reader rather than being
 * decorative chrome.
 *
 * THE CREAM GROUND IS LOAD-BEARING. The logos are white-ground JPEGs on
 * `mix-blend-multiply`, which is what drops those white boxes out into the band.
 * Move this onto any other ground and six pale rectangles come back.
 *
 * THEY ARE IN COLOUR AND AT FULL STRENGTH. They used to sit at `grayscale` and
 * 60% opacity and only come up on hover - which meant a phone, where nothing
 * hovers, never saw them properly at all. These are accreditations: NABL, ISO,
 * FDA. Their whole job is to be recognised on sight, and a grey ghost of a mark
 * you have to point at is not doing that job.
 *
 * Hover is now polish rather than the reveal - a small scale, nothing else, so
 * the mark lifts toward you without moving off its line. Nothing is behind it,
 * so touch loses only the flourish.
 */
const CERTS = [
  { src: '/home/brand/nabl.jpg', alt: 'NABL accreditation' },
  { src: '/home/brand/iso.jpg', alt: 'ISO certification' },
  { src: '/home/brand/acmg.jpg', alt: 'ACMG guidelines' },
  { src: '/home/brand/cpic.jpg', alt: 'CPIC guidelines' },
  { src: '/home/brand/fda.jpg', alt: 'FDA reference' },
  { src: '/home/brand/hipaa.jpg', alt: 'HIPAA aligned data handling' },
];

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

        <ul className="mt-[clamp(28px,3.4vw,48px)] flex list-none flex-wrap items-center justify-center gap-[clamp(26px,4vw,64px)] bg-linenw">
          {CERTS.map((c) => (
            <li key={c.src} className="min-w-0">
              <Image
                src={c.src}
                alt={c.alt}
                width={520}
                height={300}
                className="h-[clamp(40px,4.6vw,64px)] w-auto max-w-full mix-blend-multiply transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

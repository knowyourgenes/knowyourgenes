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
                className="h-[clamp(30px,3.4vw,44px)] w-auto max-w-full opacity-60 mix-blend-multiply grayscale contrast-[0.95] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:opacity-100 hover:grayscale-0 motion-reduce:transition-none"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

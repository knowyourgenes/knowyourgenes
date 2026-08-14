import Link from 'next/link';
import type { FooterSection, Ground } from '../../types';

// =============================================================================
// Page chrome - the dark footer. Geometry read 1:1 from the frame
// (spec 017705_footer-bg-dark1):
//
//   footer.bg-dark1  1440 × 337, pad 64/80/36/80, fill #141b1a
//   div.mx-auto      1280, pad 0/32          → 1216 content rail
//   div.grid         1216 × 194.5, GRID 4 × 1, colGap 40, rowGap 32,
//                    pad-bottom 44, individualStrokeWeights {bottom:1}
//                    #faf6ef@70 - the one hairline in the footer.
//                    Columns are 349 / 249 / 249 / 249 = 1.4fr + 3 × 1fr.
//   brand col        gap 10.9 · logo Figtree 21/31.5 ls 0, split by
//                    characterStyleOverrides: "Know" 800 #faf6ef ·
//                    "Your" 500 #faf6ef · "Genes" 800 #2ac3a2 (java2).
//                    Tagline 260 wide, Figtree 400 14.5/21.75 #faf6ef@70.
//   link cols        gap 15 · h5 Figtree 700 11/16.5 ls 1.43 UPPER #2ac3a2 ·
//                    ul gap 9, each li pad-bottom 0.75 → 22.5 tall, 31.5
//                    top-to-top; links Figtree 400 14.5/21.75 #faf6ef@70.
//   div.flex         pad-top 24, SPACE_BETWEEN, both spans
//                    Figtree 400 12.5/18.75 #faf6ef@70.
//
// Deliberately separate from the global <SiteFooter/>: this one is scoped to
// the product (its own test links) and matches the ink band above it.
//
// SMALL SCREENS. The 4-track rail already collapses 1 → sm:2 → lg:4, and every
// item in it is fluid (the 260 tagline is a max, the links are short), so
// nothing here overflows 320. What did not survive the shrink was TOUCH: a
// 22.5 tall link on a 9px gap is a 31.5 pitch, well under 40. Below lg the ul
// gap opens to 20 and the anchors take py-3. The padding is on an INLINE box,
// so it is hit-tested without ever joining the line box - the li stays 22.5
// and only the gap moves the layout. Both revert at lg, where the frame's
// 9px rhythm and 31.5 top-to-top come back exactly.
// =============================================================================

/** Figma splits the wordmark on its capitals and styles it by position:
 *  first + last extrabold, middle medium, last in java2 on the ink ground.
 *  Deriving that from the data keeps the copy in `lib/testsdata.ts`. */
function BrandMark({ brand }: { brand: string }) {
  const words = brand.match(/[A-Z][a-z]*/g) ?? [brand];
  const last = words.length - 1;

  return (
    <span className="block font-kyg text-[21px] leading-[31.5px] text-linenw">
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={
            i > 0 && i < last ? 'font-medium' : i === last && last > 0 ? 'font-extrabold text-java2' : 'font-extrabold'
          }
        >
          {w}
        </span>
      ))}
    </span>
  );
}

export default function Footer({ data }: { data: FooterSection; ground?: Ground }) {
  return (
    <footer className="bg-ink px-5 pb-8 pt-12 font-kyg text-linenw sm:px-10 lg:px-20 lg:pb-9 lg:pt-16">
      <div className="mx-auto w-full max-w-[1280px] lg:px-8">
        {/* GRID pad-bottom 44, +1 to make up for Figma's text boxes rounding up:
            the tallest column is 16.5 + 15 + 118 = 149.5 there (printed 150)
            and 148.5 here, so the divider still lands on the frame's line. */}
        <div className="grid gap-x-10 gap-y-8 border-b border-linenw/70 pb-[45px] sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-[11px]">
            <BrandMark brand={data.brand} />
            {/* p.mt-3 - pad 0/0/0.75/0 on top of the two 21.75 lines → 45 tall. */}
            <p
              className="max-w-[260px] break-words pb-[0.75px] text-[14.5px] font-normal leading-[21.75px] text-linenw/70"
              dangerouslySetInnerHTML={{ __html: data.taglineHtml }}
            />
          </div>

          {data.columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-[15px]">
              <h5 className="text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.43px] text-java2">
                {col.title}
              </h5>
              <ul className="flex flex-col gap-5 lg:gap-2.25">
                {col.links.map((l) => (
                  <li key={l.href + l.label} className="pb-[0.75px]">
                    <Link
                      href={l.href}
                      className="py-3 text-[14.5px] font-normal leading-[21.75px] text-linenw/70 transition-colors duration-200 hover:text-linenw lg:py-0"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 pt-6">
          <span className="text-[12.5px] font-normal leading-[18.75px] text-linenw/70">{data.copyright}</span>
          <span className="text-[12.5px] font-normal leading-[18.75px] text-linenw/70">{data.signoff}</span>
        </div>
      </div>
    </footer>
  );
}

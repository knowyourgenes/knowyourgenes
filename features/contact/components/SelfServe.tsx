import Link from 'next/link';
import { SELF_SERVE, SELF_SERVE_CARDS } from '../constants';
import { ContactEyebrow, ContactIcon } from './ContactIcon';

/**
 * SELF-SERVE STRIP — 1440 x 478 on a white@70 ground, hairline #222222@10 on the
 * TOP AND BOTTOM only (the frame's 336 content height = 478 - 70 - 70 - 1 - 1,
 * and the children start at x=130 = the raw side padding, so the strip carries no
 * left/right edge).
 *
 * Rails: section pad 130 -> 1180, inner pad 32 -> 1116 content. The head block is
 * its own 640 rail (eyebrow 46 + gap 15 + h2 41 = 102), then a 40 gap, then the
 * 194-tall row of four 264 cards at gap 20 (4*264 + 3*20 = 1116 exactly).
 *
 * Card: r22 on #faf6ef with a #222222@10 hairline, pad 28, a 30x30 icon box (the
 * glyph frame is 30x36 and overflows 3px top and bottom), gap 6, an h3 frame that
 * adds its own 16 pad-top (so 22 from the icon), gap 6, then the body.
 * 1 + 28 + 30 + 6 + (16 + 20) + 6 + 58 + 28 + 1 = 194.
 */
export default function SelfServe() {
  return (
    <section className="border-y border-mine/10 bg-white/70 px-5 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-[1180px] py-[clamp(48px,5vw,70px)] lg:px-8">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-[15px] text-center">
          <ContactEyebrow label={SELF_SERVE.eyebrow.label} icon={SELF_SERVE.eyebrow.icon} className="max-w-full" />
          {/* Figtree 800 38/41 ls -0.76 (-0.02em) #222222 */}
          <h2 className="font-kyg text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.079] tracking-[-0.02em] text-mine">
            {SELF_SERVE.title}
          </h2>
        </div>

        {/* Four-up only from xl. At lg the rail is 800 wide, so four tracks are
            185 and the 28 padding leaves 127px of copy — the 14px body would set
            at ~17 characters a line. Two-up holds until 1280; >= 1280 (and so
            1440) is the frame's four 264s. */}
        <ul className="mt-[clamp(28px,3.2vw,40px)] grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SELF_SERVE_CARDS.map((c) => (
            <li key={c.title}>
              <Link
                href={c.href}
                className="flex h-full flex-col rounded-[22px] border border-mine/10 bg-linenw p-7 transition duration-200 hover:-translate-y-px hover:shadow-tst-soft"
              >
                {/* 30x30 layout box; the 30x36 glyph bleeds 3px above and below it. */}
                <span className="relative block h-[30px] w-[30px] shrink-0">
                  <ContactIcon id={c.icon} className="absolute left-0 top-[-3px] h-[36px] w-[30px]" />
                </span>
                {/* gap 6 + the h3 frame's own 16 pad-top = 22 */}
                <h3 className="mt-[22px] font-kyg text-[clamp(16px,1.4vw,18px)] font-bold leading-[19.4px] tracking-[-0.02em] text-mine">
                  {c.title}
                </h3>
                <p className="mt-1.5 font-kyg text-[14px] font-normal leading-[19.2px] text-fusc">{c.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

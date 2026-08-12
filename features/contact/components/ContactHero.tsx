import { CONTACT_HERO, HERO_CHIPS } from '../constants';
import { ContactEyebrow, ContactIcon } from './ContactIcon';

/**
 * HERO — 1440 x 485, pad 80/342/56/342, so the copy column is exactly 756 wide
 * and centred. Vertical gap 19.
 *
 * The second headline line is Cormorant Garamond 600 italic at the same 58/61.5
 * as the roman line above it, filled with the frame's 5-stop teal gradient
 * (#0e4d4b -> #15605d -> #25b5ab -> #15605d -> #0e4d4b). That ramp — plus the
 * serif family, italic, 600 and ls=0 — is exactly what `.tst-em-teal` already
 * paints from globals.css (@layer components, background-clip: text), so the
 * span just wears the class instead of carrying a second copy of the gradient.
 */
export default function ContactHero() {
  return (
    <section className="bg-linenw px-5 sm:px-10">
      <div className="mx-auto flex w-full max-w-[756px] flex-col items-center gap-[19px] pb-14 pt-[clamp(48px,6vw,80px)] text-center">
        {/* max-w-full: the pill is an inline-flex item in a column flex box, so
            its max-content width can escape the 280px content box at 320. */}
        <ContactEyebrow
          label={CONTACT_HERO.eyebrow.label}
          icon={CONTACT_HERO.eyebrow.icon}
          className="max-w-full"
        />

        {/* 58/61.5 -> 1.0603; the two lines sit in a VERTICAL frame with gap 1. */}
        <h1 className="flex flex-col gap-px font-kyg text-[clamp(32px,4.4vw,58px)] font-extrabold leading-[1.0603] tracking-[-0.02em] text-mine">
          <span>{CONTACT_HERO.titleTop}</span>
          <span className="tst-em-teal">{CONTACT_HERO.titleAccent}</span>
        </h1>

        {/* p.text-ink3 — 620 wide, 19/28.5, and the frame's 1px bottom padding. */}
        <p className="max-w-[620px] pb-px font-kyg text-[clamp(15.5px,1.35vw,19px)] font-normal leading-[1.5] text-fusc">
          {CONTACT_HERO.lead}
        </p>

        {/* div.flex — pad 13/0/0/0, gap 10, main axis centred; chips are 50 tall. */}
        <ul className="flex flex-wrap items-center justify-center gap-2.5 pt-[13px]">
          {HERO_CHIPS.map((c) => (
            <li
              key={c.label}
              className="inline-flex items-center gap-2 rounded-full border border-mine/10 bg-white py-2 pl-2 pr-4 shadow-tst-soft"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mint">
                <ContactIcon id={c.icon} className="h-[23px] w-[19px]" />
              </span>
              <span className="font-kyg text-[13.5px] font-bold leading-[20.2px] text-[#2d2a24]">
                {c.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

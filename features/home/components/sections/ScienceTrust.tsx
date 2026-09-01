import Image from 'next/image';

import { Button, Icon, IconWell, PHOTO, RULE_DARK, Section, SectionTitle, type IconName } from '../ui';

/** The four trust claims, in reading order. */
const CLAIMS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'flask',
    title: 'Trusted laboratory network',
    body: 'Testing through carefully selected genetic laboratory partners with relevant certifications and capabilities.',
  },
  {
    icon: 'book',
    title: 'Expert interpretation',
    body: 'Because genetic information needs context, not just a PDF full of terminology.',
  },
  {
    icon: 'lifebuoy',
    title: 'Guidance where it matters',
    body: 'Access to counselling and appropriate expert support depending on the nature of your test.',
  },
  {
    icon: 'scale',
    title: 'Science, not certainty',
    body: 'Genes can reveal valuable information about inherited variants, traits and predispositions. They don’t determine every aspect of your health or future.',
  },
];

export default function ScienceTrust() {
  return (
    <Section id="science-and-trust" ground="ink" labelledBy="science-heading">
      <SectionTitle
        id="science-heading"
        eyebrow="Science &amp; trust"
        tone="dark"
        aside={
          <div className="flex gap-[18px]">
            <Icon name="quote" className="mt-[6px] h-8 w-8 shrink-0 text-ice opacity-60" />
            <p className="font-tst text-[clamp(20px,2.1vw,29px)] font-medium italic leading-[1.3] text-linenw/80">
              Your DNA is deeply personal.
              <br />
              We treat it that way.
            </p>
          </div>
        }
      >
        Big questions deserve <em>serious science.</em>
      </SectionTitle>

      {/* No cards, only rules - and they taper. Each row is topped by a hairline
          that fades out to the right; the column seam fades at BOTH ends. */}
      <ul className="mt-[clamp(18px,min(3.7vw,3.6vh),52px)] grid list-none grid-cols-1 lg:grid-cols-2">
        {CLAIMS.map((c, i) => (
          <li
            key={c.title}
            className="flex min-w-0 flex-col border-t border-transparent py-[clamp(28px,3vw,40px)] pr-[clamp(0px,3vw,50px)] lg:odd:pr-[clamp(24px,3vw,50px)] lg:even:border-l lg:even:pl-[clamp(24px,3vw,50px)]"
            style={{
              borderImage:
                i % 2 === 1
                  ? 'linear-gradient(180deg,rgba(250,246,239,0) 0%,rgba(250,246,239,0.2) 26%,rgba(250,246,239,0.2) 74%,rgba(250,246,239,0) 100%) 1'
                  : `${RULE_DARK} 1`,
            }}
          >
            <IconWell name={c.icon} tone="dark" />
            <h3 className="mt-[22px] font-kyg text-[clamp(20px,1.75vw,27px)] font-bold leading-[1.16] tracking-[-0.022em] text-linenw">
              {c.title}
            </h3>
            <p className="mt-[12px] font-kyg text-[16.5px] leading-[1.64] text-linenw/[0.68]">{c.body}</p>
          </li>
        ))}
      </ul>

      {/* The photograph carries the CTA rather than leaving it stranded in a
          band of empty teal underneath. The scrim ramps 80% to 4% left to right,
          which is the least it can be and still hold the label. */}
      <div className="relative mt-[clamp(20px,2.6vh,50px)] aspect-[16/9] max-h-[min(30vh,340px)] w-full overflow-hidden rounded-sm lg:aspect-[1360/300]">
        <Image
          src={PHOTO.lab}
          alt="A genomics laboratory bench with sequencing equipment and sample tubes"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,41,39,0.8)_0%,rgba(6,41,39,0.14)_58%,rgba(6,41,39,0.04)_100%)]"
        />
        <div className="absolute bottom-[clamp(20px,3vw,40px)] left-[clamp(20px,3vw,40px)]">
          <Button href="/about" variant="onDark">
            Our Science &amp; Standards
          </Button>
        </div>
      </div>
    </Section>
  );
}

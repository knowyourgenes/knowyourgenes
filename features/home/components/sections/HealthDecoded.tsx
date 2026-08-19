import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

const cards = [
  {
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    alt: 'A bowl of fresh, colorful food',
    tag: 'Nutrition',
    title: 'Why your diet may not be working',
    desc: `The "perfect" diet is the one that fits your biology. Not someone else's.`,
  },
  {
    img: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    alt: 'Two different healthy meals',
    tag: 'Food & Body',
    title: 'Why some foods suit some people better',
    desc: `Sensitivities, tolerances, and metabolism vary genetically. Here's why.`,
  },
  {
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    alt: 'Person stretching outdoors',
    tag: 'Fitness',
    title: 'Why two people respond differently to exercise',
    desc: `From muscle response to recovery. Your genes write a different program.`,
  },
  {
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    alt: 'A calm scene of water',
    tag: 'Recovery',
    title: 'Why recovery differs from person to person',
    desc: `Some bodies bounce back overnight. Others need a different rhythm.`,
  },
  {
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    alt: 'Generic wellness advice',
    tag: 'Wellness',
    title: 'Why generic wellness advice fails many people',
    desc: `When the rules are written for "everyone", nobody really benefits.`,
  },
];

const arrow = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[14px] w-[14px] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[4px]"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default function HealthDecoded() {
  return (
    <section id="decoded" className={`relative ${SECTION_PY}`}>
      <Container>
        <div className="relative mb-[clamp(36px,4vw,56px)] max-w-[760px]">
          <div className={`${EYEBROW} text-(--c-teal)`}>
            <span className={EYEBROW_DASH_TEAL} />
            Health Decoded
          </div>
          <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
            Breaking everyday <span className={GRAD_TEXT}>wellness myths.</span>
          </h2>
          <p className={`mt-[18px] max-w-[680px] ${LEAD} text-(--ink-2)`}>
            Bite-sized, science-grounded reads that help you make sense of what works, and what doesn&apos;t, for your
            body.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-[22px] max-[1180px]:grid-cols-2 max-[880px]:grid-cols-1 max-[720px]:gap-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group relative isolate flex aspect-[4/4.4] flex-col overflow-hidden rounded-[var(--r-md)] border border-(--ink-line) bg-white/70 backdrop-blur-[8px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[6px] hover:border-[rgba(31,26,20,0.16)] hover:shadow-[0_28px_60px_rgba(45,32,18,0.16)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                src={card.img}
                alt={card.alt}
                loading="lazy"
              />
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(31,26,20,0)_30%,rgba(31,26,20,0.55)_70%,rgba(31,26,20,0.9)_100%)]" />
              <div className="relative z-[2] mt-auto px-[26px] pt-[24px] pb-[26px] text-white">
                <div className="inline-flex text-[10.5px] font-semibold uppercase tracking-[0.22em] text-(--c-peach-2)">
                  {card.tag}
                </div>
                <h3 className="mt-[10px] text-[20px] font-semibold leading-[1.2] tracking-[-0.012em] text-white">
                  {card.title}
                </h3>
                <p className="mt-[10px] max-h-0 overflow-hidden text-[13.5px] leading-[1.5] text-white/[0.78] opacity-0 transition-all duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-h-[120px] group-hover:opacity-100">
                  {card.desc}
                </p>
                <Link
                  className="mt-[16px] inline-flex items-center gap-[8px] text-[13px] font-semibold text-white"
                  href="/blog"
                >
                  Read article
                  {arrow}
                </Link>
              </div>
            </article>
          ))}

          <article className="group relative isolate flex aspect-[4/4.4] flex-col overflow-hidden rounded-[var(--r-md)] bg-[linear-gradient(160deg,var(--dark-1)_0%,var(--dark-2)_100%)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[6px] hover:shadow-[0_28px_60px_rgba(45,32,18,0.16)]">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(60%_70%_at_80%_20%,rgba(37,181,171,0.25),transparent_60%)]" />
            <div className="relative z-[2] mt-auto p-[32px] text-white">
              <div className="inline-flex text-[10.5px] font-semibold uppercase tracking-[0.22em] text-(--c-peach-2)">
                Explore more
              </div>
              <h3 className="mt-[10px] text-[24px] font-semibold leading-[1.2] tracking-[-0.012em] text-white">
                Health Decoded is a growing library.
              </h3>
              <p className="mt-[14px] text-[13.5px] leading-[1.5] text-[rgba(250,246,239,0.75)]">
                New articles every week, written for real people in real life. Subscribe and never miss a beat.
              </p>
              <Link
                className="mt-[16px] inline-flex items-center gap-[8px] text-[13px] font-semibold text-white"
                href="/blog"
              >
                Explore Health Decoded
                {arrow}
              </Link>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}

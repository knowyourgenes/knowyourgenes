import { Container } from '@/components/shared/Container';
import { CONTENT_GAP, EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

const cards = [
  {
    href: '/categories/wellness/mens-health',
    img: '/tests/mens-health/hero-man.png',
    alt: "Men's Health DNA",
    num: "Men's Health",
    title: "Men's Health DNA",
    sub: 'Fertility, hormones and hair-loss risk in one saliva test.',
    list: [
      'Fertility & reproductive risk',
      'Hormone & endocrine markers',
      'Hair-loss (Alopecia) risk',
      'Good / Average / Poor grading',
      'Personalised recommendations',
    ],
    quote: 'Know your risks before they surface.',
  },
  {
    href: '/categories/wellness/womens-health',
    img: '/tests/womens-health/hero-woman.png',
    alt: "Women's Health DNA",
    num: "Women's Health",
    title: "Women's Health DNA",
    sub: "Clinical panels focused on women's genetic health.",
    list: [
      'PCOS & hormonal risk',
      'Pregnancy & fertility markers',
      'Bone & joint health',
      'Mood & wellbeing',
      'Personalised recommendations',
    ],
    quote: 'The questions that matter most, answered.',
  },
  {
    href: '/categories/wellness/ancestry',
    img: '/tests/ancestry/hero-map.png',
    alt: 'Ancestry DNA',
    num: 'Ancestry',
    title: 'Ancestry DNA',
    sub: 'Trace your heritage and genetic origins.',
    list: [
      'Ethnic origin breakdown',
      'Regional heritage mapping',
      '42,000+ SNP genotyping',
      'Gene Journey narrative report',
    ],
    quote: 'Where did you really come from?',
  },
  {
    href: '/categories/wellness/my-wellness',
    img: '/tests/my-wellness/hero-wellness.png',
    alt: 'My Wellness',
    num: 'Wellness',
    title: 'My Wellness',
    sub: 'Diet, weight, fitness and detox insights in one report.',
    list: ['Diet & nutrition response', 'Weight & metabolism', 'Fitness & recovery', 'Detox & stress pathways'],
    quote: 'One kit. Four life-changing answers.',
  },
];

export default function WellnessPackages() {
  return (
    <section
      id="wellness"
      className={`relative bg-[linear-gradient(180deg,transparent_0%,rgba(248,228,204,0.6)_50%,transparent_100%)] ${SECTION_PY}`}
    >
      <Container>
        <div className="relative mb-[clamp(36px,4vw,56px)] max-w-[760px]">
          <div className={`${EYEBROW} text-(--c-teal)`}>
            <span className={EYEBROW_DASH_TEAL} />
            Our DNA Tests
          </div>
          <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
            Explore our <span className={GRAD_TEXT}>DNA tests</span>.
          </h2>
          <p className={`mt-[18px] max-w-[680px] ${LEAD} text-(--ink-2)`}>
            One at-home saliva kit. Choose the report that matters most to you - from fertility and hormones to ancestry
            and whole-body wellness.
          </p>
        </div>

        <div className={`mt-2 grid grid-cols-4 ${CONTENT_GAP} max-[1180px]:grid-cols-2 max-[880px]:grid-cols-1`}>
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="group relative isolate flex aspect-[4/5.4] flex-col overflow-hidden rounded-sm bg-(--c-cream-2) text-inherit no-underline transition-[transform,box-shadow] duration-[800ms] ease-[var(--e-out)] hover:-translate-y-2 hover:shadow-[0_32px_70px_rgba(45,32,18,0.18)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-[1300ms] ease-[var(--e-out)] group-hover:scale-[1.08]"
                src={card.img}
                alt={card.alt}
                loading="lazy"
              />
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(31,26,20,0)_30%,rgba(31,26,20,0.65)_70%,rgba(31,26,20,0.92)_100%)]" />
              <div className="absolute left-[18px] top-[18px] z-[2] rounded-sm border border-white/[0.22] bg-white/[0.18] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-[10px]">
                {card.num}
              </div>
              <div className="absolute right-[18px] top-[18px] z-[2] flex h-[38px] w-[38px] items-center justify-center rounded-sm bg-white/[0.95] text-(--ink-1) transition-[transform,background] duration-[600ms] ease-[var(--e-out)] group-hover:-rotate-45 group-hover:bg-(--c-teal-light) group-hover:text-white">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="absolute inset-x-0 bottom-0 z-[2] px-[26px] pb-[26px] pt-6 text-white">
                <h3 className="font-[family-name:var(--ff)] text-[24px] font-semibold leading-[1.1] tracking-[-0.015em]">
                  {card.title}
                </h3>
                <p className="mt-2 max-w-[90%] text-[13.5px] leading-[1.45] text-white/[0.85]">{card.sub}</p>
                <div className="max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity,margin-top] duration-[650ms] ease-[var(--e-out)] group-hover:mt-[14px] group-hover:max-h-[260px] group-hover:opacity-100">
                  <ul className="flex flex-col gap-1.5 border-t border-white/[0.18] pt-[14px]">
                    {card.list.map((item) => (
                      <li
                        key={item}
                        className="relative pl-[18px] text-[12.5px] leading-[1.4] text-white/[0.85] before:absolute before:left-0 before:top-2 before:h-[1.5px] before:w-[10px] before:rounded-sm before:bg-(--c-teal-light) before:content-['']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[12.5px] font-medium italic text-(--c-peach-2)">{card.quote}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

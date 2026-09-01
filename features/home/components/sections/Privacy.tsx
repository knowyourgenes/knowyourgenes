import { cn } from '@/lib/utils';
import { Button, Icon, Lead, Rule, Section, SectionTitle, type IconName } from '../ui';

/** The three assurances, in source order. */
const ASSURANCES: { icon: IconName; label: string }[] = [
  { icon: 'check', label: 'Clear consent' },
  { icon: 'lock', label: 'Responsible data handling' },
  { icon: 'shield', label: 'Confidential reporting' },
];

/**
 * The quietest section on the page - no card, no panel, no photography.
 *
 * NO BORDERS ANYWHERE. Every outline here is a 1.5px inset ring, never a
 * border: a border grows the box it is on and knocks it off the baseline its
 * neighbours share.
 */
export default function Privacy({ hoverTint = false }: { hoverTint?: boolean } = {}) {
  return (
    <Section id="privacy-confidentiality" ground="sand" labelledBy="privacy-heading">
      <SectionTitle
        id="privacy-heading"
        eyebrow="Privacy &amp; confidentiality"
        asideAlign="top"
        aside={
          <div>
            <Lead className="max-w-[44ch] text-[17.5px]">
              Genes can reveal valuable information. They don&rsquo;t determine every aspect of your health or future.
            </Lead>
            <div className="mt-[24px] flex">
              <Button href="#science-and-trust">Our Science &amp; Standards</Button>
            </div>
          </div>
        }
      >
        Your DNA is deeply personal. <em>We treat it that way.</em>
      </SectionTitle>

      {/* A bar, not three stray pills. Equal thirds divided by seams that fade
          at both ends, held between two tapered rules. */}
      <Rule className="mt-[clamp(18px,min(3.7vw,3.6vh),52px)]" />

      <ul className="grid list-none grid-cols-1 md:grid-cols-3">
        {ASSURANCES.map((a, i) => (
          <li
            key={a.label}
            className={cn(
              'flex min-w-0 items-center gap-[18px] py-[clamp(24px,2.8vw,34px)] md:pr-[clamp(20px,2.4vw,44px)]',
              // The seams between the thirds are drawn with `border-image` on
              // the li itself, so the tint sits inside the padding box and
              // cannot paint over them. The first cell is the only one without
              // an inset of its own, so it takes one - otherwise the wash
              // starts hard against its icon.
              hoverTint && [
                'rounded-sm transition-colors duration-300 hover:bg-mist',
                i === 0 && 'pl-[clamp(14px,1.6vw,26px)]',
              ]
            )}
            style={
              i > 0
                ? {
                    borderLeftWidth: '1px',
                    borderLeftColor: 'transparent',
                    borderImage:
                      'linear-gradient(180deg,rgba(27,23,18,0) 0%,rgba(27,23,18,0.13) 26%,rgba(27,23,18,0.13) 74%,rgba(27,23,18,0) 100%) 1',
                    paddingLeft: 'clamp(0px,2.4vw,44px)',
                  }
                : undefined
            }
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-eden/[0.08] text-eden">
              <Icon name={a.icon} className="h-[22px] w-[22px]" />
            </span>
            <span className="min-w-0 font-kyg text-[clamp(16px,1.5vw,19px)] font-bold leading-[1.35] tracking-[-0.01em] text-zeus">
              {a.label}
            </span>
          </li>
        ))}
      </ul>

      <Rule />
    </Section>
  );
}

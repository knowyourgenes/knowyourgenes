import { cn } from '@/lib/utils';
import EyebrowPill from './EyebrowPill';
import type { IconName } from './Icon';

// Centered section header: eyebrow pill + H2 (+ optional Cormorant-italic
// gradient accent line and sub-paragraph). Shared by Features / Upgrade / FAQ /
// Reviews. The accent reproduces the Figma's serif gradient exactly.
export default function SectionHeader({
  eyebrow,
  eyebrowIcon,
  tone = 'sea',
  heading,
  accent,
  sub,
  headingClassName = 'text-[clamp(26px,3.4vw,34px)]',
  className,
}: {
  eyebrow: string;
  eyebrowIcon: IconName;
  tone?: 'sea' | 'eden';
  heading: string;
  accent?: string;
  sub?: string;
  headingClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3 text-center', className)}>
      <EyebrowPill label={eyebrow} icon={eyebrowIcon} tone={tone} />
      <h2 className={cn('font-extrabold leading-[1.12] tracking-[-0.02em] text-heavy', headingClassName)}>
        {heading}
        {accent && (
          <span
            className="mt-1 block bg-clip-text font-semibold italic text-transparent"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              backgroundImage: 'linear-gradient(167deg, #1F5F41 0%, #2E7D5B 42%, #4FA47C 100%)',
              WebkitBackgroundClip: 'text',
            }}
          >
            {accent}
          </span>
        )}
      </h2>
      {sub && <p className="mt-1 max-w-[600px] text-[15.5px] leading-[1.5] text-fusc">{sub}</p>}
    </div>
  );
}

import { cn } from '@/lib/utils';
import Icon, { type IconName } from './Icon';

// The rounded "eyebrow" chip above every section heading. Each section passes
// its own Figma icon. Figma: padding 8/17/8/13, gap 9, Figtree Bold 12 / 0.11em.
//   sea  → Sea Green 10% bg, 22% border, Green Pea text (WHY KYG / BEFORE YOU ORDER)
//   eden → Eden 7% bg, 15% border, Eden text (ONE SAMPLE / REVIEWS)
export default function EyebrowPill({
  label,
  icon,
  tone = 'sea',
  className,
}: {
  label: string;
  icon: IconName;
  tone?: 'sea' | 'eden';
  className?: string;
}) {
  const tint = tone === 'sea' ? 'bg-sea/10 border-sea/20 text-greenpea' : 'bg-eden/[0.07] border-eden/15 text-eden';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[9px] rounded-sm border py-[8px] pl-[13px] pr-[17px]',
        'text-[12px] font-bold uppercase leading-none tracking-[0.11em]',
        tint,
        className
      )}
    >
      <Icon name={icon} className={cn('size-[17px]', tone === 'sea' ? 'text-sea' : 'text-eden')} />
      {label}
    </span>
  );
}

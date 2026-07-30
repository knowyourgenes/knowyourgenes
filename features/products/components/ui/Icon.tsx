import { cn } from '@/lib/utils';

// Renders one of the exact vector icons exported from the Figma
// (public/products/icons/*.svg) as a CSS mask, so the precise design geometry
// is preserved while the fill follows `currentColor` (color via text-* utils).
export type IconName =
  | 'cart'
  | 'chevron-down'
  | 'arrow-right'
  | 'trust-saliva'
  | 'trust-clock'
  | 'trust-shield'
  | 'trust-chat'
  | 'eyebrow-features'
  | 'eyebrow-upgrade'
  | 'eyebrow-faq'
  | 'eyebrow-reviews'
  | 'feature-personalized'
  | 'feature-shipping'
  | 'feature-reports'
  | 'feature-secure'
  | 'kit-glyph'
  | 'thumb-1'
  | 'thumb-2'
  | 'thumb-3'
  | 'thumb-4';

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  const url = `/products/icons/${name}.svg`;
  return (
    <span
      aria-hidden
      className={cn('inline-block shrink-0 bg-current', className)}
      style={{
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}

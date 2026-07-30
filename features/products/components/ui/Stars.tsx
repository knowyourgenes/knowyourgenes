import { cn } from '@/lib/utils';

// Rating stars — the Figma renders these as the ★ text glyph in Hokey Pokey gold
// (#D4A72C), not as SVG icons. Reproduce exactly with the star character.
export default function Stars({
  count = 5,
  className,
  style,
}: {
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-label={`${count} out of 5 stars`}
      className={cn('inline-block text-[#d4a72c] leading-none', className)}
      style={{ letterSpacing: '0.1333em', ...style }}
    >
      {'★'.repeat(count)}
    </span>
  );
}

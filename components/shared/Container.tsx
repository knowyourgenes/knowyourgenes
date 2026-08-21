import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Site-wide 1600px content column - the ONE page shell width (docs/DESIGN.md §1).
 *
 * Centres its children and applies the shared horizontal gutter. Use this
 * instead of repeating `max-w-[1600px] mx-auto px-(--gutter)` in every
 * component - the max-width lives in exactly one place now.
 *
 * The gutter reads the ambient `--gutter` (e.g. the value CHROME_VARS sets on
 * the header/footer) and falls back to a clamp when no ancestor defines it, so
 * the component is safe to drop in anywhere. Pass `className` to override or
 * extend (e.g. add `flex`, vertical padding, or a custom gutter); tailwind-merge
 * resolves conflicts so a `px-*` you pass wins over the default.
 */
type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export function Container<T extends ElementType = 'div'>({ as, className, children, ...props }: ContainerProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag className={cn('mx-auto w-full max-w-[1600px] px-[var(--gutter,clamp(18px,3vw,40px))]', className)} {...props}>
      {children}
    </Tag>
  );
}

export default Container;

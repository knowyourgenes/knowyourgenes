'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Bundle, Category, SidebarLink } from '@/features/catalog/data/tests';
import { scrollToHashWithOffset, useScrollSpy } from '@/hooks/use-scroll';
import { ChevronLeft } from './icons';
import { BUNDLE_THEME } from './themes';

/**
 * Category-level report rail. Driven entirely by `category.sidebar` so it stays
 * identical across the category's reports — only the active highlight changes.
 *  • route links (`/wellness/...`) navigate between sibling reports (active via pathname)
 *  • anchor links (`#panel-...`) scroll within the current page (active via scroll-spy)
 * Sticky below the shared SiteHeader, collapsible; hidden under 980px.
 */
export default function ReportSidebar({
  category,
  collapsed,
  onToggleCollapse,
}: {
  category: Category;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const anchorIds = category.sidebar.flatMap((g) =>
    g.kind === 'links' ? g.links.filter((l) => l.href.startsWith('#')).map((l) => l.href.slice(1)) : []
  );
  const [activeAnchor] = useScrollSpy(anchorIds, anchorIds[0] ?? '');

  const isActive = (href: string) =>
    href.startsWith('#') ? activeAnchor === href.slice(1) : href !== '#' && pathname === href;

  const textCls = collapsed ? 'hidden' : 'block';
  const dotCls = collapsed ? 'flex' : 'hidden';
  const titleCls = collapsed ? 'hidden' : 'block';

  return (
    <aside
      aria-label="Reports navigation"
      className={cn(
        'self-start sticky top-[var(--navbar-h)] h-[calc(100vh-var(--navbar-h))] overflow-y-auto overflow-x-hidden',
        'border-r border-[var(--ink-line)] bg-[rgba(245,237,223,.36)] kyg-scroll max-[980px]:hidden',
        'transition-[flex-basis,width,padding] duration-[420ms] ease-[var(--e-out)]',
        collapsed
          ? 'basis-[78px] w-[78px] px-[14px] py-[30px]'
          : 'basis-[var(--sidebar-w)] w-[var(--sidebar-w)] px-[22px] pt-[30px] pb-[40px]'
      )}
    >
      {/* Top */}
      <div className={cn('flex items-center gap-[10px] mb-[26px]', collapsed ? 'justify-center' : 'justify-between')}>
        <span
          className={cn(
            'text-[11.5px] font-bold tracking-[0.16em] uppercase text-[var(--acc-700)] whitespace-nowrap',
            titleCls
          )}
        >
          {category.sidebarEyebrow}
        </span>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="shrink-0 w-[34px] h-[34px] rounded-[10px] inline-flex items-center justify-center text-[var(--ink-2)] border border-[var(--ink-line)] bg-white transition-[background,color] duration-300 ease-[var(--e-out)] hover:bg-[var(--ink-1)] hover:text-[var(--cream)] cursor-pointer"
        >
          <ChevronLeft
            className={cn('w-[17px] h-[17px] transition-transform duration-[420ms]', collapsed && 'rotate-180')}
          />
        </button>
      </div>

      {category.sidebar.map((group) => (
        <div key={group.title} className="mb-[26px]">
          <div
            className={cn(
              'text-[11.5px] font-bold tracking-[0.15em] uppercase text-[var(--ink-3)] px-[12px] mb-[12px] whitespace-nowrap',
              titleCls
            )}
          >
            {group.title}
          </div>

          {group.kind === 'links'
            ? group.links.map((link) => (
                <LinkRow
                  key={link.name}
                  link={link}
                  active={isActive(link.href)}
                  collapsed={collapsed}
                  textCls={textCls}
                  dotCls={dotCls}
                />
              ))
            : group.cards.map((card) => (
                <CardRow key={card.name} card={card} collapsed={collapsed} textCls={textCls} dotCls={dotCls} />
              ))}
        </div>
      ))}
    </aside>
  );
}

function LinkRow({
  link,
  active,
  collapsed,
  textCls,
  dotCls,
}: {
  link: SidebarLink;
  active: boolean;
  collapsed: boolean;
  textCls: string;
  dotCls: string;
}) {
  const isAnchor = link.href.startsWith('#');
  const className = cn(
    'block relative rounded-[var(--r-xs)] mb-[4px] transition-[background] duration-[280ms] ease-[var(--e-out)]',
    collapsed ? 'py-[8px] px-0' : 'py-[12px] px-[14px]',
    active ? 'bg-white shadow-[var(--sh-1)]' : 'hover:bg-[rgba(31,26,20,.045)]',
    active &&
      !collapsed &&
      "before:content-[''] before:absolute before:left-0 before:top-[9px] before:bottom-[9px] before:w-[3px] before:rounded-full before:bg-[var(--acc-500)]",
    collapsed && active && 'bg-transparent shadow-none'
  );

  const inner = (
    <>
      <span
        className={cn(
          'w-[30px] h-[30px] rounded-[9px] mx-auto items-center justify-center font-bold text-[13px]',
          active ? 'bg-[var(--acc-500)] text-white' : 'bg-[var(--acc-50)] text-[var(--acc-700)]',
          dotCls
        )}
      >
        {link.dot}
      </span>
      <span
        className={cn(
          'text-[15.5px] font-semibold tracking-[-0.01em] whitespace-nowrap',
          active ? 'text-[var(--acc-700)]' : 'text-[var(--ink-1)]',
          textCls
        )}
      >
        {link.name}
      </span>
      {link.meta ? (
        <span className={cn('text-[13px] text-[var(--ink-3)] mt-[2px] whitespace-nowrap', textCls)}>{link.meta}</span>
      ) : null}
    </>
  );

  if (isAnchor) {
    return (
      <a
        href={link.href}
        aria-current={active ? 'page' : undefined}
        onClick={(e) => {
          e.preventDefault();
          scrollToHashWithOffset(link.href.slice(1));
        }}
        className={className}
      >
        {inner}
      </a>
    );
  }
  if (link.href === '#') {
    return (
      <a href="#" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={link.href} aria-current={active ? 'page' : undefined} className={className}>
      {inner}
    </Link>
  );
}

function CardRow({
  card,
  collapsed,
  textCls,
  dotCls,
}: {
  card: Bundle;
  collapsed: boolean;
  textCls: string;
  dotCls: string;
}) {
  const t = BUNDLE_THEME[card.theme];
  return (
    <a
      href="#"
      className={cn(
        'block rounded-[var(--r-sm)] mb-[10px] overflow-hidden border border-transparent transition-[transform,box-shadow] duration-[400ms] ease-[var(--e-out)]',
        collapsed
          ? 'py-[8px] px-0 bg-transparent'
          : cn('py-[14px] px-[16px] hover:-translate-y-[2px] hover:shadow-[var(--sh-2)]', t.bg)
      )}
    >
      <span
        className={cn(
          'w-[30px] h-[30px] rounded-[9px] mx-auto items-center justify-center font-bold text-[13px]',
          t.dotBg,
          t.dotFg,
          dotCls
        )}
      >
        {card.dot}
      </span>
      <span
        className={cn(
          'block text-[10.5px] font-bold tracking-[0.13em] uppercase mb-[5px] whitespace-nowrap',
          t.accent,
          textCls
        )}
      >
        {card.tag}
      </span>
      <span className={cn('block text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap', t.name, textCls)}>
        {card.name}
      </span>
      <span className={cn('block text-[12.5px] mt-[3px] leading-[1.4]', t.desc, textCls)}>{card.desc}</span>
    </a>
  );
}

'use client';

import { cn } from '@/lib/utils';
import type { Category, Panel, Test } from '../data';
import { scrollToHashWithOffset } from '../_hooks';
import { ChevronLeft } from './icons';
import { BUNDLE_THEME } from './themes';

interface SidebarProps {
  category: Category;
  sidebar: Test['sidebar'];
  panels: Panel[];
  activePanel: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Desktop-only report rail: sticky below the shared SiteHeader, collapsible to
 * an icon strip. Hidden under 980px — on mobile the SiteHeader owns navigation,
 * and the panel content / bundles are still reachable inline in the main column.
 */
export default function ReportSidebar({ category, sidebar, panels, activePanel, collapsed, onToggleCollapse }: SidebarProps) {
  const textCls = collapsed ? 'hidden' : 'block';
  const dotCls = collapsed ? 'flex' : 'hidden';
  const groupTitleCls = collapsed ? 'hidden' : 'block';

  const onPanelClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToHashWithOffset(id);
  };

  return (
    <aside
      aria-label="Reports navigation"
      className={cn(
        'self-start sticky top-[var(--navbar-h)] h-[calc(100vh-var(--navbar-h))] overflow-y-auto overflow-x-hidden',
        'border-r border-[var(--ink-line)] bg-[rgba(245,237,223,.36)] kyg-scroll max-[980px]:hidden',
        'transition-[flex-basis,width,padding] duration-[420ms] ease-[var(--e-out)]',
        collapsed ? 'basis-[78px] w-[78px] px-[14px] py-[30px]' : 'basis-[var(--sidebar-w)] w-[var(--sidebar-w)] px-[22px] pt-[30px] pb-[40px]',
      )}
    >
      {/* Top */}
      <div className={cn('flex items-center gap-[10px] mb-[26px]', collapsed ? 'justify-center' : 'justify-between')}>
        <span className={cn('text-[11.5px] font-bold tracking-[0.16em] uppercase text-[var(--acc-700)] whitespace-nowrap', groupTitleCls)}>
          {sidebar.eyebrow}
        </span>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="shrink-0 w-[34px] h-[34px] rounded-[10px] inline-flex items-center justify-center text-[var(--ink-2)] border border-[var(--ink-line)] bg-white transition-[background,color] duration-300 ease-[var(--e-out)] hover:bg-[var(--ink-1)] hover:text-[var(--cream)] cursor-pointer"
        >
          <ChevronLeft className={cn('w-[17px] h-[17px] transition-transform duration-[420ms]', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Primary panels nav */}
      <nav className="mb-[26px]" aria-label={category.name + ' panels'}>
        <div className={cn('text-[11.5px] font-bold tracking-[0.15em] uppercase text-[var(--ink-3)] px-[12px] mb-[12px] whitespace-nowrap', groupTitleCls)}>
          {category.name}
        </div>
        {panels.map((p) => {
          const active = p.id === activePanel;
          return (
            <a
              key={p.id}
              href={`#${p.id}`}
              aria-current={active ? 'page' : undefined}
              onClick={(e) => onPanelClick(e, p.id)}
              className={cn(
                'block relative rounded-[var(--r-xs)] mb-[4px] transition-[background] duration-[280ms] ease-[var(--e-out)]',
                collapsed ? 'py-[8px] px-0' : 'py-[12px] px-[14px]',
                active ? 'bg-white shadow-[var(--sh-1)]' : 'hover:bg-[rgba(31,26,20,.045)]',
                active && !collapsed && "before:content-[''] before:absolute before:left-0 before:top-[9px] before:bottom-[9px] before:w-[3px] before:rounded-full before:bg-[var(--acc-500)]",
                collapsed && active && 'bg-transparent shadow-none',
              )}
            >
              <span
                className={cn(
                  'w-[30px] h-[30px] rounded-[9px] mx-auto items-center justify-center font-bold text-[13px]',
                  active ? 'bg-[var(--acc-500)] text-white' : 'bg-[var(--acc-50)] text-[var(--acc-700)]',
                  dotCls,
                )}
              >
                {p.sidebar.dot}
              </span>
              <span className={cn('text-[15.5px] font-semibold tracking-[-0.01em] whitespace-nowrap', active ? 'text-[var(--acc-700)]' : 'text-[var(--ink-1)]', textCls)}>
                {p.sidebar.name}
              </span>
              <span className={cn('text-[13px] text-[var(--ink-3)] mt-[2px] whitespace-nowrap', textCls)}>{p.sidebar.meta}</span>
            </a>
          );
        })}
      </nav>

      {/* Pair with */}
      <nav className="mb-[26px]" aria-label="Pair with">
        <div className={cn('text-[11.5px] font-bold tracking-[0.15em] uppercase text-[var(--ink-3)] px-[12px] mb-[12px] whitespace-nowrap', groupTitleCls)}>
          Pair With
        </div>
        {sidebar.pairWith.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={cn('block relative rounded-[var(--r-xs)] mb-[4px] transition-[background] duration-[280ms] ease-[var(--e-out)] hover:bg-[rgba(31,26,20,.045)]', collapsed ? 'py-[8px] px-0' : 'py-[12px] px-[14px]')}
          >
            <span className={cn('w-[30px] h-[30px] rounded-[9px] mx-auto items-center justify-center font-bold text-[13px] bg-[var(--acc-50)] text-[var(--acc-700)]', dotCls)}>{link.dot}</span>
            <span className={cn('text-[15.5px] font-semibold tracking-[-0.01em] text-[var(--ink-1)] whitespace-nowrap', textCls)}>{link.name}</span>
            <span className={cn('text-[13px] text-[var(--ink-3)] mt-[2px] whitespace-nowrap', textCls)}>{link.meta}</span>
          </a>
        ))}
      </nav>

      {/* Bundles */}
      <div className={collapsed ? 'mb-[14px]' : 'mb-[26px]'}>
        <div className={cn('text-[11.5px] font-bold tracking-[0.15em] uppercase text-[var(--ink-3)] px-[12px] mb-[12px] whitespace-nowrap', groupTitleCls)}>
          Bundles
        </div>
        {sidebar.bundles.map((b) => {
          const t = BUNDLE_THEME[b.theme];
          return (
            <a
              key={b.name}
              href="#"
              className={cn(
                'block rounded-[var(--r-sm)] mb-[10px] overflow-hidden border border-transparent transition-[transform,box-shadow] duration-[400ms] ease-[var(--e-out)]',
                collapsed ? 'py-[8px] px-0 bg-transparent' : cn('py-[14px] px-[16px] hover:-translate-y-[2px] hover:shadow-[var(--sh-2)]', t.bg),
              )}
            >
              <span className={cn('w-[30px] h-[30px] rounded-[9px] mx-auto items-center justify-center font-bold text-[13px]', t.dotBg, t.dotFg, dotCls)}>{b.dot}</span>
              <span className={cn('block text-[10.5px] font-bold tracking-[0.13em] uppercase mb-[5px] whitespace-nowrap', t.accent, textCls)}>{b.tag}</span>
              <span className={cn('block text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap', t.name, textCls)}>{b.name}</span>
              <span className={cn('block text-[12.5px] mt-[3px] leading-[1.4]', t.desc, textCls)}>{b.desc}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}

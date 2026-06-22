'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import type { Category, Test } from '@/data/tests';
import PageStyles from './styles';
import ReportSidebar from './ReportSidebar';

/**
 * The persistent shell shared by every report in a category (lives in the
 * category layout). Owns the sidebar collapse state and the per-report accent:
 * it reads the active report from the route segment and applies that report's
 * accent CSS variables, so navigating between siblings recolours + swaps the
 * content without the sidebar/header/footer re-rendering.
 */
export default function CategoryShell({
  category,
  tests,
  children,
}: {
  category: Category;
  tests: Test[];
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const activeSlug = useSelectedLayoutSegment(); // the active [test_slug]
  const activeTest = tests.find((t) => t.slug === activeSlug);
  const accent = activeTest?.accent ?? category.accent;

  const accentStyle = {
    '--acc-50': accent.c50,
    '--acc-100': accent.c100,
    '--acc-500': accent.c500,
    '--acc-700': accent.c700,
  } as CSSProperties;

  return (
    <div className="kyg-test" style={accentStyle}>
      <PageStyles />
      <div className="flex min-h-screen max-w-[1280px] mx-auto relative max-[980px]:block">
        <ReportSidebar category={category} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
        <main className="flex-1 min-w-0 p-[clamp(28px,3vw,52px)_clamp(24px,3.4vw,60px)_90px] max-[980px]:p-[clamp(24px,5vw,40px)_var(--gutter)_110px]">
          {children}
        </main>
      </div>
    </div>
  );
}

import type { CSSProperties } from 'react';

/**
 * KYG warm-modern design tokens for the shared header/footer chrome.
 *
 * Applied as inline CSS variables on the chrome wrapper (`style={CHROME_VARS}`)
 * so the components are fully self-contained: they render identically whether
 * they sit inside the landing page's `.kyg-page` scope, the test page's
 * `.kyg-test` scope, or anywhere else — no external stylesheet required.
 * Components consume them via Tailwind arbitrary utilities, e.g.
 * `bg-(--cream)`, `text-(--ink-1)`, `shadow-(--sh-1)`.
 */
export const CHROME_VARS = {
  '--cream': '#FAF6EF',
  '--cream-2': '#F5EDDF',
  '--peach-2': '#F3D5B2',

  '--ink-1': '#1F1A14',
  '--ink-2': '#2D2A24',
  '--ink-3': '#6B6358',
  '--ink-line': 'rgba(31,26,20,.08)',

  '--dark-1': '#1A2220',

  '--teal': '#0E4D4B',
  '--teal-2': '#15605D',
  '--teal-light': '#25B5AB',
  '--teal-bright': '#2AC3A2',

  // Active accent for the chrome = brand teal (fixed, not per-page).
  '--acc-50': '#E6F4F1',
  '--acc-100': '#CDE9E4',
  '--acc-500': '#15605D',
  '--acc-700': '#0E4D4B',

  '--r-xs': '12px',
  '--r-sm': '18px',
  '--r-md': '22px',
  '--r-lg': '30px',

  '--sh-1': '0 1px 2px rgba(45,32,18,.04), 0 4px 14px rgba(45,32,18,.05)',
  '--sh-2': '0 2px 6px rgba(45,32,18,.05), 0 18px 50px -24px rgba(45,32,18,.20)',
  '--sh-3': '0 6px 18px rgba(45,32,18,.08), 0 30px 70px -30px rgba(45,32,18,.26)',

  '--e-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--gutter': 'clamp(18px, 3vw, 40px)',

  // Figtree comes from the route-group layout's next/font variable when present.
  fontFamily: "var(--font-figtree, Figtree), system-ui, -apple-system, 'Segoe UI', sans-serif",
} as CSSProperties;

import type { CSSProperties } from 'react';

/**
 * KYG warm-modern design tokens for the (new) pure-Tailwind homepage sections.
 *
 * Applied once as inline CSS variables on the NewHomepage wrapper
 * (`style={KYG_HOME_VARS}`), so every section can consume them through Tailwind
 * arbitrary utilities - e.g. `bg-(--c-teal)`, `text-(--ink-1)`,
 * `rounded-[var(--r-2xl)]`, `shadow-[var(--sh-2)]` - with NO scoped stylesheet.
 *
 * Values mirror the original `.kyg-page` design system 1:1 so the rebuilt
 * sections match the current homepage.
 */
export const KYG_HOME_VARS = {
  // Warm base palette
  '--c-cream': '#faf6ef',
  '--c-cream-2': '#f5eddf',
  '--c-peach': '#f8e4cc',
  '--c-peach-2': '#f3d5b2',
  '--c-rose': '#f0d5c0',
  '--c-sand': '#edddb8',

  // Brand teal (accent only)
  '--c-teal': '#0e4d4b',
  '--c-teal-2': '#15605d',
  '--c-teal-light': '#25b5ab',
  '--c-teal-bright': '#2ac3a2',

  // Warm ink
  '--ink-1': '#1f1a14',
  '--ink-2': '#2d2a24',
  '--ink-3': '#6b6358',
  '--ink-4': '#b5ab9a',
  '--ink-line': 'rgba(31, 26, 20, 0.08)',

  // Warm dark for break sections
  '--dark-1': '#1a2220',
  '--dark-2': '#243230',
  '--dark-3': '#2e3d3a',

  // Squircle radii

  // Layout
  '--max-w': '1530px',
  '--gutter': 'clamp(20px, 4vw, 56px)',

  // Easings
  '--e-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--e-out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Shadows (warm tinted)
  '--sh-1': '0 1px 2px rgba(45, 32, 18, 0.04), 0 4px 14px rgba(45, 32, 18, 0.04)',
  '--sh-2': '0 4px 16px rgba(45, 32, 18, 0.06), 0 18px 50px rgba(45, 32, 18, 0.08)',
  '--sh-3': '0 12px 36px rgba(45, 32, 18, 0.1), 0 40px 100px rgba(45, 32, 18, 0.14)',

  fontFamily: "var(--font-figtree, Figtree), system-ui, -apple-system, 'Segoe UI', sans-serif",
} as CSSProperties;

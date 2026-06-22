// Colour themes for bundle cards, shared by the sidebar mini-cards and the
// Bundles section tiles. Values are Tailwind utilities backed by the scoped
// CSS-variable tokens (see styles.tsx).
import type { Bundle } from '@/data/tests';

export interface BundleTheme {
  bg: string;
  accent: string; // tag + cta text
  name: string;
  desc: string;
  dotBg: string;
  dotFg: string;
}

export const BUNDLE_THEME: Record<Bundle['theme'], BundleTheme> = {
  wellness: {
    bg: 'bg-[var(--diet-50)]',
    accent: 'text-[var(--diet-700)]',
    name: 'text-[var(--ink-1)]',
    desc: 'text-[var(--diet-700)]',
    dotBg: 'bg-[var(--diet-50)]',
    dotFg: 'text-[var(--diet-700)]',
  },
  couple: {
    bg: 'bg-[var(--women-50)]',
    accent: 'text-[var(--women-700)]',
    name: 'text-[var(--ink-1)]',
    desc: 'text-[var(--women-700)]',
    dotBg: 'bg-[var(--women-50)]',
    dotFg: 'text-[var(--women-700)]',
  },
  matri: {
    bg: 'bg-[var(--detox-50)]',
    accent: 'text-[var(--detox-700)]',
    name: 'text-[var(--ink-1)]',
    desc: 'text-[var(--detox-700)]',
    dotBg: 'bg-[var(--detox-50)]',
    dotFg: 'text-[var(--detox-700)]',
  },
  ultimate: {
    bg: 'bg-[var(--dark-1)]',
    accent: 'text-[var(--teal-bright)]',
    name: 'text-white',
    desc: 'text-white/60',
    dotBg: 'bg-[var(--dark-1)]',
    dotFg: 'text-[var(--teal-bright)]',
  },
};

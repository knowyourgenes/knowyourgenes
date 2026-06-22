// Colour themes for bundle cards, shared by the sidebar mini-cards and the
// Bundles section tiles. Values are Tailwind utilities backed by the scoped
// CSS-variable tokens (see styles.tsx).
import type { Bundle } from '@/features/catalog/data/tests';

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
    bg: 'bg-(--diet-50)',
    accent: 'text-(--diet-700)',
    name: 'text-(--ink-1)',
    desc: 'text-(--diet-700)',
    dotBg: 'bg-(--diet-50)',
    dotFg: 'text-(--diet-700)',
  },
  couple: {
    bg: 'bg-(--women-50)',
    accent: 'text-(--women-700)',
    name: 'text-(--ink-1)',
    desc: 'text-(--women-700)',
    dotBg: 'bg-(--women-50)',
    dotFg: 'text-(--women-700)',
  },
  matri: {
    bg: 'bg-(--detox-50)',
    accent: 'text-(--detox-700)',
    name: 'text-(--ink-1)',
    desc: 'text-(--detox-700)',
    dotBg: 'bg-(--detox-50)',
    dotFg: 'text-(--detox-700)',
  },
  ultimate: {
    bg: 'bg-(--dark-1)',
    accent: 'text-(--teal-bright)',
    name: 'text-white',
    desc: 'text-white/60',
    dotBg: 'bg-(--dark-1)',
    dotFg: 'text-(--teal-bright)',
  },
};

import type { ReactNode } from 'react';
import { Figtree, Hind } from 'next/font/google';

// The test pages use the KYG warm-modern type system: Figtree for everything,
// Hind as the secondary face. Exposed as CSS variables that the scoped page
// styles consume via --ff / --ff-i (see _components/styles.tsx). Loading them
// here scopes the variables to the (tests) route group without touching the
// root layout or globals.css.
const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-figtree',
  display: 'swap',
});

const hind = Hind({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

export default function TestsLayout({ children }: { children: ReactNode }) {
  return <div className={`${figtree.variable} ${hind.variable}`}>{children}</div>;
}

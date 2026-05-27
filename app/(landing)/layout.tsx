import { Figtree, Hind } from 'next/font/google';

// Load the exact fonts the kyg design uses. Exposed as CSS variables that
// kyg.css consumes via --ff / --ff-i.
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

// The landing page ships its own nav + footer (see page.tsx), so this layout
// adds no chrome — it just scopes the font variables.
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${figtree.variable} ${hind.variable}`}>{children}</div>;
}

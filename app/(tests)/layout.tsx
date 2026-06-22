import type { ReactNode } from 'react';

// The test pages use the KYG warm-modern type system (Figtree + Hind). Those
// faces are now loaded once in the root layout and exposed as the global
// `--font-figtree` / `--font-hind` CSS variables, which the scoped page styles
// consume via --ff / --ff-i (see components/tests/styles.tsx). This layout no longer
// loads them itself.
export default function TestsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Scoped design-token + animation stylesheet for the test pages.
// -----------------------------------------------------------------------------
// Why a <style> tag and not globals.css / @theme:
//   * globals.css is shared and must not be touched (other people's work).
//   * Tailwind v4 @theme tokens can only be registered in the compiled
//     stylesheet, so the KYG palette is exposed as CSS variables here instead
//     and consumed from components via arbitrary utilities, e.g.
//     `bg-(--acc-50)`, `rounded-(--r-md)`, `shadow-(--sh-1)`.
//   * Every selector is scoped under `.kyg-test`, so nothing leaks across routes.
//   * Animations (reveal-on-scroll, the mesh background) live here per the
//     design's request that animations stay in a <style> block.
// Layout / colour / spacing for actual elements is done with Tailwind utilities
// in the components — this file only declares the tokens + the few effects that
// utilities can't express (mesh gradient, ::selection, JS-toggled reveal).

const CSS = `
.kyg-test {
  /* Warm base */
  --cream: #FAF6EF;
  --cream-2: #F5EDDF;

  /* Warm ink */
  --ink-1: #1F1A14;
  --ink-2: #2D2A24;
  --ink-3: #6B6358;
  --ink-line: rgba(31, 26, 20, 0.08);

  /* Warm dark (break panels) */
  --dark-1: #1A2220;
  --dark-3: #2E3D3A;

  /* Brand teal */
  --teal: #0E4D4B;
  --teal-2: #15605D;
  --teal-light: #25B5AB;
  --teal-bright: #2AC3A2;

  /* Active accent — overridden per category via inline style on the root */
  --acc-50: #E6F4F1;
  --acc-100: #CDE9E4;
  --acc-500: #15605D;
  --acc-700: #0E4D4B;

  /* Themed accents for bundle cards */
  --diet-50: #E6F4F1;  --diet-700: #0E4D4B;
  --women-50: #FBE9F0; --women-700: #9A2855;
  --detox-50: #FAEBD9; --detox-700: #8B4F0E;

  /* Status badges */
  --st-good-bg: #E6F4F1; --st-good-fg: #0E4D4B;
  --st-avg-bg: #FBF1DC;  --st-avg-fg: #9A6B12;
  --st-risk-bg: #FBE6E1; --st-risk-fg: #B23A22;

  /* Radii */
  --r-xs: 12px;
  --r-sm: 18px;
  --r-md: 22px;
  --r-lg: 30px;

  /* Shadows (warm tinted) */
  --sh-1: 0 1px 2px rgba(45,32,18,.04), 0 4px 14px rgba(45,32,18,.05);
  --sh-2: 0 2px 6px rgba(45,32,18,.05), 0 18px 50px -24px rgba(45,32,18,.20);
  --sh-3: 0 6px 18px rgba(45,32,18,.08), 0 30px 70px -30px rgba(45,32,18,.26);

  /* Easing + layout */
  --e-out: cubic-bezier(0.22, 1, 0.36, 1);
  --gutter: clamp(18px, 3vw, 40px);
  --navbar-h: 64px; /* matches the shared SiteHeader (h-16) */
  --sidebar-w: 320px;

  /* Type — fonts come from the (tests) layout's next/font variables */
  --ff: var(--font-figtree), system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ff-i: var(--font-hind), var(--ff);

  font-family: var(--ff);
  color: var(--ink-1);
  background: var(--cream);
  position: relative;
  min-height: 100vh;
  isolation: isolate;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Soft warm mesh background */
.kyg-test::before {
  content: '';
  position: fixed;
  /* No horizontal bleed (-10vw would cause horizontal scroll here, since this
     scope has no overflow-x clip like the landing's .kyg-page does). */
  inset: -10vh 0;
  background:
    radial-gradient(38vw 46vh at 10% 14%, rgba(248,228,204,.40) 0%, transparent 60%),
    radial-gradient(40vw 44vh at 92% 6%,  rgba(233,245,238,.55) 0%, transparent 62%),
    radial-gradient(46vw 48vh at 80% 88%, rgba(240,213,192,.34) 0%, transparent 65%),
    var(--cream);
  z-index: -2;
}

.kyg-test ::selection { background: var(--acc-100); color: var(--acc-700); }

/* Thin sidebar scrollbar */
.kyg-test .kyg-scroll { scrollbar-width: thin; }
.kyg-test .kyg-scroll::-webkit-scrollbar { width: 7px; }
.kyg-test .kyg-scroll::-webkit-scrollbar-thumb { background: rgba(31,26,20,.14); border-radius: 99px; }

/* Reveal-on-scroll — 'is-in' is toggled by the IntersectionObserver hook */
.kyg-test .reveal { opacity: 0; transform: translateY(20px); transition: opacity .7s var(--e-out), transform .7s var(--e-out); }
.kyg-test .reveal.is-in { opacity: 1; transform: none; }
.kyg-test .reveal-r { opacity: 0; transform: translateX(26px); transition: opacity .8s var(--e-out), transform .8s var(--e-out); }
.kyg-test .reveal-r.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .kyg-test .reveal, .kyg-test .reveal-r { opacity: 1; transform: none; transition: none; }
  .kyg-test * { scroll-behavior: auto; }
}
`;

export default function PageStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

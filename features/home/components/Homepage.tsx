'use client';

import { useEffect } from 'react';

// =============================================================
// Scoped page styles - inlined from the original kyg.html <style>
// block. Kept inside the component (not in globals.css) so nothing
// leaks across routes; every selector is prefixed .kyg-page so the
// cascade cannot escape. Animations (@keyframes) live in the same
// block per the design's request. Tailwind utility classes are
// preferred for any NEW elements added to this page.
// =============================================================
const KYG_PAGE_CSS = `/* =========================================================
   KYG · Warm-Modern design system
   ========================================================= */
.kyg-page {
  /* Warm base palette */
  --c-cream: #faf6ef;
  --c-cream-2: #f5eddf;
  --c-peach: #f8e4cc;
  --c-peach-2: #f3d5b2;
  --c-rose: #f0d5c0;
  --c-sand: #edddb8;

  /* Brand teal (accent only) */
  --c-teal: #0e4d4b;
  --c-teal-2: #15605d;
  --c-teal-light: #25b5ab;
  --c-teal-bright: #2ac3a2;

  /* Warm ink */
  --ink-1: #1f1a14;
  --ink-2: #2d2a24;
  --ink-3: #6b6358;
  --ink-4: #b5ab9a;
  --ink-line: rgba(31, 26, 20, 0.08);

  /* Warm dark for break sections */
  --dark-1: #1a2220;
  --dark-2: #243230;
  --dark-3: #2e3d3a;

  /* Type */
  --ff: 'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ff-i: 'Hind', 'Figtree', sans-serif;

  /* Scale */
  --fs-xs: 12px;
  --fs-sm: 14px;
  --fs-md: 16px;
  --fs-lg: 18px;
  --fs-xl: 22px;
  --fs-2xl: 28px;
  --fs-3xl: 36px;
  --fs-4xl: 48px;
  --fs-5xl: 64px;
  --fs-6xl: 84px;

  /* Layout */
  --max-w: 1530px;
  --max-w-wide: 1530px;
  --gutter: clamp(20px, 4vw, 56px);

  /* Squircle radii (subtle squircle feel via generous radius) */
  --r-xs: 12px;
  --r-sm: 18px;
  --r-md: 26px;
  --r-lg: 34px;
  --r-xl: 44px;
  --r-2xl: 56px;

  /* Easings */
  --e-out: cubic-bezier(0.22, 1, 0.36, 1);
  --e-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
  --e-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Shadows (warm tinted) */
  --sh-1: 0 1px 2px rgba(45, 32, 18, 0.04), 0 4px 14px rgba(45, 32, 18, 0.04);
  --sh-2: 0 4px 16px rgba(45, 32, 18, 0.06), 0 18px 50px rgba(45, 32, 18, 0.08);
  --sh-3: 0 12px 36px rgba(45, 32, 18, 0.1), 0 40px 100px rgba(45, 32, 18, 0.14);
}

/* ========= Reset / base ========= */
.kyg-page *,
.kyg-page *::before,
.kyg-page *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.kyg-page {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
.kyg-page {
  font-family: var(--ff);
  font-size: var(--fs-md);
  line-height: 1.55;
  color: var(--ink-1);
  background: var(--c-cream);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh;
  /* Create a stacking context so .hero__media (z-index:-1) is contained
     inside the cream background instead of painting behind it. In the
     original HTML, body was the root and z-index:-1 rendered above the
     html canvas - wrapping everything in .kyg-page broke that without
     this isolation. */
  isolation: isolate;
}

/* ========= Animated mesh background (fixed) =========
   Off-white + peach + rose drifting gradients */
.kyg-page::before {
  content: '';
  position: fixed;
  inset: -10vh -10vw;
  background:
    radial-gradient(40vw 50vh at 12% 18%, rgba(248, 228, 204, 0.55) 0%, transparent 60%),
    radial-gradient(36vw 42vh at 88% 8%, rgba(243, 213, 178, 0.45) 0%, transparent 60%),
    radial-gradient(50vw 50vh at 75% 65%, rgba(240, 213, 192, 0.45) 0%, transparent 65%),
    radial-gradient(40vw 40vh at 18% 88%, rgba(245, 237, 223, 0.55) 0%, transparent 60%), var(--c-cream);
  z-index: -2;
  animation: meshDrift 26s ease-in-out infinite alternate;
  will-change: transform;
}
@keyframes meshDrift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(2%, -1.5%, 0) scale(1.05);
  }
  100% {
    transform: translate3d(-1.5%, 2%, 0) scale(1.02);
  }
}

/* ========= Grain overlay ========= */
.kyg-page::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.18  0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>");
  opacity: 0.42;
  mix-blend-mode: multiply;
  z-index: -1;
}

.kyg-page img,
.kyg-page svg {
  display: block;
  max-width: 100%;
  height: auto;
}
.kyg-page img {
  object-fit: cover;
}
.kyg-page a {
  color: inherit;
  text-decoration: none;
}
.kyg-page button {
  font: inherit;
  background: none;
  border: 0;
  cursor: pointer;
  color: inherit;
}
.kyg-page ul,
.kyg-page ol {
  list-style: none;
}
.kyg-page ::selection {
  background: var(--c-teal);
  color: #fff;
}

/* ========= Container ========= */
.kyg-page .container {
  width: 100%;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
.kyg-page .container--wide {
  max-width: var(--max-w-wide);
}

/* ========= Typography utilities ========= */
.kyg-page .eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c-teal);
}
.kyg-page .eyebrow::before {
  content: '';
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--c-teal), var(--c-teal-light));
  border-radius: 2px;
}
.kyg-page .eyebrow--light {
  color: var(--c-peach-2);
}
.kyg-page .eyebrow--light::before {
  background: var(--c-peach-2);
}

.kyg-page .h-display {
  font-family: var(--ff);
  font-weight: 600;
  font-size: clamp(48px, 7.4vw, 96px);
  line-height: 0.98;
  letter-spacing: -0.035em;
  color: var(--ink-1);
}
.kyg-page .h1 {
  font-family: var(--ff);
  font-weight: 600;
  font-size: clamp(34px, 4.8vw, 60px);
  line-height: 1.04;
  letter-spacing: -0.028em;
  color: var(--ink-1);
}
.kyg-page .h2 {
  font-family: var(--ff);
  font-weight: 600;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.1;
  letter-spacing: -0.022em;
  color: var(--ink-1);
}
.kyg-page .h3 {
  font-family: var(--ff);
  font-weight: 600;
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.18;
  letter-spacing: -0.012em;
  color: var(--ink-1);
}
.kyg-page .lead {
  font-size: clamp(17px, 1.4vw, 21px);
  line-height: 1.55;
  color: var(--ink-2);
  font-weight: 400;
  letter-spacing: -0.005em;
}
.kyg-page .muted {
  color: var(--ink-3);
}

/* ========= Animated gradient text ========= */
.kyg-page .grad-text {
  background: linear-gradient(
    110deg,
    var(--c-teal) 0%,
    var(--c-teal-2) 25%,
    var(--c-teal-light) 50%,
    var(--c-teal-2) 75%,
    var(--c-teal) 100%
  );
  background-size: 240% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradShift 9s ease-in-out infinite;
}
.kyg-page .grad-text--warm {
  background: linear-gradient(110deg, #c76842 0%, #d4895e 30%, var(--c-teal) 60%, var(--c-teal-light) 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradShift 10s ease-in-out infinite;
}
@keyframes gradShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* ========= Buttons (squircle pill, eased) ========= */
.kyg-page .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 28px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 15px;
  line-height: 1;
  letter-spacing: -0.005em;
  transition:
    transform 0.6s var(--e-out),
    background 0.35s var(--e-out),
    color 0.35s var(--e-out),
    box-shadow 0.6s var(--e-out),
    border-color 0.35s var(--e-out);
  will-change: transform;
  border: 1.5px solid transparent;
  cursor: pointer;
}
.kyg-page .btn .ico {
  width: 16px;
  height: 16px;
  transition: transform 0.5s var(--e-out);
}
.kyg-page .btn:hover .ico {
  transform: translateX(3px);
}

.kyg-page .btn--primary {
  background: var(--ink-1);
  color: var(--c-cream);
  box-shadow: 0 10px 28px rgba(31, 26, 20, 0.18);
}
.kyg-page .btn--primary:hover {
  background: var(--c-teal);
  transform: translateY(-3px);
  box-shadow: 0 18px 44px rgba(14, 77, 75, 0.32);
}
.kyg-page .btn--ghost {
  background: transparent;
  color: var(--ink-1);
  border-color: rgba(31, 26, 20, 0.18);
}
.kyg-page .btn--ghost:hover {
  background: var(--ink-1);
  color: var(--c-cream);
  border-color: var(--ink-1);
  transform: translateY(-3px);
}
.kyg-page .btn--accent {
  background: var(--c-teal-light);
  color: #fff;
  box-shadow: 0 10px 28px rgba(37, 181, 171, 0.32);
}
.kyg-page .btn--accent:hover {
  background: var(--c-teal);
  transform: translateY(-3px);
  box-shadow: 0 18px 44px rgba(14, 77, 75, 0.36);
}
.kyg-page .btn--light {
  background: rgba(255, 255, 255, 0.92);
  color: var(--ink-1);
  backdrop-filter: blur(10px);
}
.kyg-page .btn--light:hover {
  background: #fff;
  transform: translateY(-3px);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.18);
}
.kyg-page .btn--text {
  padding: 8px 0;
  color: var(--ink-1);
  font-weight: 600;
}
.kyg-page .btn--text .ico {
  transition: transform 0.5s var(--e-out);
}
.kyg-page .btn--text:hover .ico {
  transform: translateX(5px);
}

/* ========= Reveal anim ========= */
.kyg-page .reveal {
  opacity: 0;
  transform: translateY(34px);
  transition:
    opacity 1s var(--e-out-soft),
    transform 1s var(--e-out-soft);
  transition-delay: var(--rd, 0s);
}
.kyg-page .reveal.is-in {
  opacity: 1;
  transform: translateY(0);
}
.kyg-page .reveal-r {
  opacity: 0;
  transform: translateX(40px);
  transition:
    opacity 1s var(--e-out-soft),
    transform 1s var(--e-out-soft);
}
.kyg-page .reveal-r.is-in {
  opacity: 1;
  transform: translateX(0);
}

/* ========= Hero ========= */
.kyg-page .hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 24px 0 80px;
  overflow: hidden;
}
.kyg-page .hero__media {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  border-radius: 0 0 var(--r-2xl) var(--r-2xl);
}
.kyg-page .hero__media-img {
  position: absolute;
  top: -14%;
  left: 0;
  width: 100%;
  height: 128%;
  object-fit: cover;
  object-position: 60% 45%;
  will-change: transform;
  filter: saturate(0.92) contrast(1.02);
}
.kyg-page .hero__media-veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      96deg,
      rgba(250, 246, 239, 0.99) 0%,
      rgba(250, 246, 239, 0.92) 26%,
      rgba(250, 246, 239, 0.62) 46%,
      rgba(250, 246, 239, 0.22) 64%,
      rgba(250, 246, 239, 0) 80%
    ),
    linear-gradient(180deg, rgba(250, 246, 239, 0) 50%, rgba(250, 246, 239, 0.65) 100%);
}
.kyg-page .hero__media-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
  opacity: 0.15;
  mix-blend-mode: multiply;
}

.kyg-page .hero__inner {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 60px;
}
.kyg-page .hero__copy {
  max-width: 820px;
}
.kyg-page .hero__pill {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 12px 26px 12px 12px;
  background: var(--c-teal);
  border: 1px solid rgba(37, 181, 171, 0.32);
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  color: var(--c-cream);
  margin-bottom: 36px;
  letter-spacing: 0.005em;
  box-shadow:
    0 14px 32px -8px rgba(14, 77, 75, 0.42),
    0 0 0 4px rgba(14, 77, 75, 0.05);
  position: relative;
  overflow: hidden;
}
.kyg-page .hero__pill::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -30%;
  width: 30%;
  background: linear-gradient(90deg, transparent, rgba(248, 228, 204, 0.28), transparent);
  animation: pillShine 4.5s ease-in-out infinite;
}
@keyframes pillShine {
  0%,
  70% {
    left: -30%;
  }
  100% {
    left: 130%;
  }
}
.kyg-page .hero__pill-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--c-peach-2), var(--c-rust));
  color: var(--c-cream);
  border-radius: 50%;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px rgba(248, 228, 204, 0.14);
}
.kyg-page .hero__h {
  font-family: var(--ff);
  font-size: clamp(48px, 7.4vw, 110px);
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -0.038em;
  color: var(--ink-1);
}
.kyg-page .hero__h em {
  font-style: normal;
  display: block;
  font-weight: 500;
}
.kyg-page .hero__sub {
  font-size: clamp(17px, 1.45vw, 21px);
  line-height: 1.5;
  color: var(--ink-2);
  margin-top: 28px;
  max-width: 580px;
}
.kyg-page .hero__cta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 36px;
}

.kyg-page .hero__aside {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-end;
}
.kyg-page .hero__statcard {
  width: 100%;
  max-width: 360px;
  padding: 22px 24px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--r-md);
  box-shadow: 0 18px 50px rgba(45, 32, 18, 0.1);
  transition: transform 0.8s var(--e-out);
}
.kyg-page .hero__statcard:hover {
  transform: translateY(-4px);
}
.kyg-page .hero__statcard-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.kyg-page .hero__statcard-ico {
  width: 44px;
  height: 44px;
  border-radius: var(--r-xs);
  background: linear-gradient(135deg, var(--c-peach-2) 0%, var(--c-peach) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-teal);
  flex-shrink: 0;
}
.kyg-page .hero__statcard-ico svg {
  width: 22px;
  height: 22px;
}
.kyg-page .hero__statcard-lab {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-3);
  font-weight: 600;
}
.kyg-page .hero__statcard-num {
  font-family: var(--ff);
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink-1);
  line-height: 1.05;
}
.kyg-page .hero__statcard-sub {
  font-size: 13px;
  color: var(--ink-3);
  margin-top: 4px;
}
.kyg-page .hero__statcard-sm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 14px;
  padding-top: 16px;
  border-top: 1px solid var(--ink-line);
}
.kyg-page .hero__statcard-sm > div {
  font-size: 12.5px;
  color: var(--ink-2);
  line-height: 1.3;
}
.kyg-page .hero__statcard-sm b {
  display: block;
  font-weight: 600;
  color: var(--ink-1);
  margin-bottom: 2px;
}

.kyg-page .hero__floater {
  position: absolute;
  top: 28%;
  right: 6%;
  z-index: 2;
  padding: 12px 16px;
  background: rgba(31, 26, 20, 0.9);
  color: #fff;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 14px 40px rgba(31, 26, 20, 0.28);
  animation: float 6s ease-in-out infinite;
}
.kyg-page .hero__floater-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-teal-bright);
  box-shadow: 0 0 0 4px rgba(42, 195, 162, 0.25);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(42, 195, 162, 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(42, 195, 162, 0);
  }
}

/* ========= Marquee Trust strip ========= */
.kyg-page .trust {
  padding: 52px 0 48px;
  overflow: hidden;
  border-top: 1px solid rgba(248, 228, 204, 0.12);
  border-bottom: 1px solid rgba(248, 228, 204, 0.12);
  background: linear-gradient(180deg, #0e4d4b 0%, #082f2d 100%);
  position: relative;
  box-shadow:
    inset 0 14px 28px -16px rgba(0, 0, 0, 0.45),
    inset 0 -14px 28px -16px rgba(0, 0, 0, 0.45);
}
.kyg-page .trust::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(50% 90% at 10% 50%, rgba(37, 181, 171, 0.28), transparent 60%),
    radial-gradient(45% 90% at 90% 50%, rgba(248, 228, 204, 0.12), transparent 60%);
  pointer-events: none;
}
/* Soft edge fades on left + right so items fade in/out of the marquee */
.kyg-page .trust::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, #0e4d4b 0%, rgba(14, 77, 75, 0) 8%),
    linear-gradient(270deg, #082f2d 0%, rgba(8, 47, 45, 0) 8%);
  pointer-events: none;
  z-index: 2;
}
.kyg-page .trust__label {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(248, 228, 204, 0.72);
}
.kyg-page .trust__label::before,
.kyg-page .trust__label::after {
  content: '';
  width: 36px;
  height: 1px;
  background: rgba(248, 228, 204, 0.35);
}
.kyg-page .trust__label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-teal-light);
  box-shadow: 0 0 0 3px rgba(37, 181, 171, 0.24);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px rgba(37, 181, 171, 0.24);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(37, 181, 171, 0.1);
  }
}
.kyg-page .trust__track {
  display: flex;
  gap: 72px;
  animation: marq 60s linear infinite;
  width: fit-content;
  position: relative;
  z-index: 1;
}
.kyg-page .trust__item {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 19px;
  font-weight: 500;
  color: var(--c-cream);
  white-space: nowrap;
  letter-spacing: 0.005em;
}
.kyg-page .trust__item svg {
  width: 30px;
  height: 30px;
  color: var(--c-teal-light);
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(37, 181, 171, 0.4));
}
.kyg-page .trust__item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-peach-2);
  opacity: 0.9;
  box-shadow: 0 0 10px rgba(243, 213, 178, 0.5);
}
@keyframes marq {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* ========= Section base ========= */
.kyg-page section.s {
  padding: clamp(56px, 6.5vw, 96px) 0;
  position: relative;
}
.kyg-page .s--peach {
  background: linear-gradient(180deg, transparent 0%, rgba(248, 228, 204, 0.6) 50%, transparent 100%);
}
.kyg-page .s--dark {
  background: var(--dark-1);
  color: var(--c-cream);
  position: relative;
  overflow: hidden;
}
.kyg-page .s--dark::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(50vw 60vh at 85% 15%, rgba(37, 181, 171, 0.18), transparent 60%),
    radial-gradient(40vw 50vh at 10% 90%, rgba(248, 228, 204, 0.1), transparent 60%);
  pointer-events: none;
}
.kyg-page .s--dark .h1,
.kyg-page .s--dark .h2,
.kyg-page .s--dark .h3,
.kyg-page .s--dark .lead {
  color: var(--c-cream);
}
.kyg-page .s--dark .muted {
  color: rgba(250, 246, 239, 0.65);
}

.kyg-page .s-head {
  max-width: 760px;
  margin-bottom: clamp(56px, 6vw, 88px);
  position: relative;
}
.kyg-page .s-head--center {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.kyg-page .s-head .eyebrow {
  margin-bottom: 32px;
}
.kyg-page .s-head .h1,
.kyg-page .s-head .h2 {
  margin-bottom: 22px;
}

/* ========= Why KYG ========= */
.kyg-page .why {
  position: relative;
}
.kyg-page .why__grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: stretch;
}
.kyg-page .why__left {
  display: flex;
  flex-direction: column;
}
.kyg-page .why__track {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 28px 0 32px;
}
.kyg-page .why__chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--ink-line);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  transition: all 0.5s var(--e-out);
}
.kyg-page .why__chip:hover {
  background: #fff;
  border-color: rgba(31, 26, 20, 0.18);
  transform: translateY(-2px);
  box-shadow: var(--sh-1);
}
.kyg-page .why__chip svg {
  width: 16px;
  height: 16px;
  color: var(--c-teal);
}

.kyg-page .why__qs {
  margin: 36px 0 28px;
  padding: 32px 36px;
  border-radius: var(--r-md);
  background: linear-gradient(160deg, var(--c-teal) 0%, #0a3f3d 100%);
  border: 1px solid rgba(37, 181, 171, 0.22);
  color: var(--c-cream);
  box-shadow:
    0 28px 60px -22px rgba(14, 77, 75, 0.42),
    0 0 0 1px rgba(37, 181, 171, 0.08),
    inset 0 0 60px rgba(37, 181, 171, 0.04);
  position: relative;
  overflow: hidden;
}
.kyg-page .why__qs::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 80% at 12% 12%, rgba(37, 181, 171, 0.22), transparent 60%),
    radial-gradient(50% 60% at 90% 90%, rgba(248, 228, 204, 0.06), transparent 60%);
  pointer-events: none;
}
.kyg-page .why__qs > * {
  position: relative;
  z-index: 1;
}
.kyg-page .why__qs-lab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-peach-2);
  margin-bottom: 18px;
}
.kyg-page .why__qs-lab::before {
  content: '';
  width: 18px;
  height: 1px;
  background: var(--c-peach-2);
}
.kyg-page .why__qs p {
  font-size: 16.5px;
  line-height: 1.6;
  color: rgba(250, 246, 239, 0.92);
  margin-bottom: 10px;
  position: relative;
  padding-left: 22px;
}
.kyg-page .why__qs p::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-teal-light);
  box-shadow: 0 0 0 3px rgba(37, 181, 171, 0.18);
  font-weight: 600;
}
.kyg-page .why__because {
  font-family: var(--ff);
  font-weight: 600;
  font-size: clamp(26px, 3.2vw, 38px);
  letter-spacing: -0.018em;
  line-height: 1.15;
  color: var(--ink-1);
  margin-top: 18px;
}

/* Big number visual */
.kyg-page .why__visual {
  position: relative;
  border-radius: var(--r-lg);
  overflow: hidden;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  background: var(--c-cream-2);
}
.kyg-page .why__visual-img {
  position: absolute;
  top: -12%;
  left: 0;
  width: 100%;
  height: 124%;
  object-fit: cover;
  z-index: 0;
  will-change: transform;
}
.kyg-page .why__visual-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(31, 26, 20, 0.15) 0%,
    rgba(31, 26, 20, 0.55) 70%,
    rgba(31, 26, 20, 0.85) 100%
  );
  z-index: 1;
}
.kyg-page .why__visual-inner {
  position: relative;
  z-index: 2;
  margin-top: auto;
  padding: 36px;
  color: #fff;
}
.kyg-page .why__visual-num {
  font-family: var(--ff);
  font-weight: 500;
  font-size: clamp(86px, 12vw, 168px);
  line-height: 0.85;
  letter-spacing: -0.05em;
  color: #fff;
}
.kyg-page .why__visual-num span {
  font-weight: 300;
  background: linear-gradient(120deg, #fff 0%, var(--c-peach-2) 50%, var(--c-teal-light) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.kyg-page .why__visual-cap {
  font-size: 14px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.85);
  max-width: 280px;
  margin-top: 18px;
}

/* ========= What is KYG - body silhouette + floating cards ========= */
.kyg-page .what .s-head {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.kyg-page .what .s-head .lead {
  margin-left: auto;
  margin-right: auto;
}
.kyg-page .what .s-head .eyebrow {
  margin-left: auto;
  margin-right: auto;
}

.kyg-page .what__stage {
  position: relative;
  max-width: 1080px;
  margin: 0 auto;
  min-height: clamp(760px, 94vw, 980px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kyg-page .what__body {
  position: relative;
  z-index: 1;
  height: clamp(740px, 92vw, 980px);
  width: auto;
  aspect-ratio: 32 / 62;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  overflow: visible;
}
.kyg-page .what__body svg {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}
.kyg-page .what__body-img {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  filter: drop-shadow(0 18px 28px rgba(14, 77, 75, 0.18)) drop-shadow(0 6px 12px rgba(45, 32, 18, 0.1));
  animation: bodyHover 6s ease-in-out infinite alternate;
}
@keyframes bodyHover {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-12px) scale(1.012);
  }
}

.kyg-page .what__floats {
  display: contents;
}

.kyg-page .what__float {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 16px 26px 16px 16px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--r-md);
  box-shadow:
    0 18px 48px rgba(45, 32, 18, 0.12),
    0 4px 12px rgba(45, 32, 18, 0.06);
  animation: floatGentle var(--dur, 7s) ease-in-out infinite alternate;
  animation-delay: var(--dly, 0s);
  transition:
    box-shadow 0.6s var(--e-out),
    border-color 0.4s var(--e-out);
  will-change: transform;
}
.kyg-page .what__float:hover {
  box-shadow:
    0 28px 64px rgba(45, 32, 18, 0.18),
    0 6px 16px rgba(45, 32, 18, 0.08);
  border-color: rgba(37, 181, 171, 0.4);
}
.kyg-page .what__float-ico {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--c-peach) 0%, var(--c-peach-2) 100%);
  color: var(--c-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kyg-page .what__float-ico svg {
  width: 24px;
  height: 24px;
}
.kyg-page .what__float-name {
  font-weight: 600;
  font-size: 17px;
  color: var(--ink-1);
  letter-spacing: -0.008em;
  white-space: nowrap;
}

/* Positions */
.kyg-page .what__float--1 {
  top: 2%;
  left: 2%;
  --dur: 8s;
  --dly: -0s;
}
.kyg-page .what__float--2 {
  top: 2%;
  right: 2%;
  --dur: 7s;
  --dly: -2s;
}
.kyg-page .what__float--3 {
  top: 44%;
  left: -2%;
  --dur: 9s;
  --dly: -1s;
}
.kyg-page .what__float--4 {
  top: 44%;
  right: -2%;
  --dur: 8s;
  --dly: -3s;
}
.kyg-page .what__float--5 {
  bottom: 4%;
  left: 4%;
  --dur: 7.5s;
  --dly: -4s;
}
.kyg-page .what__float--6 {
  bottom: 4%;
  right: 4%;
  --dur: 8.5s;
  --dly: -2.5s;
}

@keyframes floatGentle {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-14px);
  }
}

.kyg-page .what__tag-wrap {
  text-align: center;
  margin-top: 32px;
}
.kyg-page .what__tag {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px 14px 14px;
  border-radius: 999px;
  background: var(--ink-1);
  color: var(--c-cream);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.005em;
}
.kyg-page .what__tag-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--c-teal-light);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

@media (max-width: 880px) {
  .kyg-page .what__stage {
    min-height: auto;
    flex-direction: column;
    gap: 32px;
  }
  .kyg-page .what__body {
    height: 480px;
    aspect-ratio: 32 / 62;
  }
  .kyg-page .what__floats {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
  }
  .kyg-page .what__float {
    position: static !important;
    animation: none !important;
    width: 100%;
  }
}

/* ========= Wellness package - image-dominant cards with hover reveal ========= */
.kyg-page .pkg__cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
  margin-top: 8px;
}
.kyg-page .pkg-card {
  position: relative;
  border-radius: var(--r-md);
  overflow: hidden;
  aspect-ratio: 4 / 5.4;
  display: flex;
  flex-direction: column;
  background: var(--c-cream-2);
  transition:
    transform 0.8s var(--e-out),
    box-shadow 0.8s var(--e-out);
  isolation: isolate;
}
.kyg-page .pkg-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 32px 70px rgba(45, 32, 18, 0.18);
}
.kyg-page .pkg-card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 1.3s var(--e-out),
    filter 0.6s var(--e-out);
  z-index: 0;
}
.kyg-page .pkg-card:hover .pkg-card__img {
  transform: scale(1.08);
}
.kyg-page .pkg-card__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(31, 26, 20, 0) 30%, rgba(31, 26, 20, 0.65) 70%, rgba(31, 26, 20, 0.92) 100%);
  z-index: 1;
  transition: opacity 0.5s var(--e-out);
}
.kyg-page .pkg-card__num {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 2;
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 600;
  color: #fff;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
}
.kyg-page .pkg-card__corner {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-1);
  transition:
    transform 0.6s var(--e-out),
    background 0.35s var(--e-out);
}
.kyg-page .pkg-card:hover .pkg-card__corner {
  background: var(--c-teal-light);
  color: #fff;
  transform: rotate(-45deg);
}

.kyg-page .pkg-card__body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px 26px 26px;
  z-index: 2;
  color: #fff;
}
.kyg-page .pkg-card__title {
  font-family: var(--ff);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.1;
}
.kyg-page .pkg-card__sub {
  font-size: 13.5px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 8px;
  max-width: 90%;
}
.kyg-page .pkg-card__reveal {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    max-height 0.65s var(--e-out),
    opacity 0.55s var(--e-out),
    margin-top 0.55s var(--e-out);
}
.kyg-page .pkg-card:hover .pkg-card__reveal {
  max-height: 260px;
  opacity: 1;
  margin-top: 14px;
}
.kyg-page .pkg-card__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
}
.kyg-page .pkg-card__list li {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.85);
  padding-left: 18px;
  position: relative;
  line-height: 1.4;
}
.kyg-page .pkg-card__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 10px;
  height: 1.5px;
  background: var(--c-teal-light);
  border-radius: 2px;
}
.kyg-page .pkg-card__quote {
  margin-top: 12px;
  font-size: 12.5px;
  font-style: italic;
  font-weight: 500;
  color: var(--c-peach-2);
}

/* ========= Report preview ========= */
.kyg-page .report__grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: center;
}
.kyg-page .report__mock {
  position: relative;
  padding: 40px;
  border-radius: var(--r-lg);
  background:
    radial-gradient(60% 50% at 100% 0%, rgba(248, 228, 204, 0.5), transparent 60%),
    linear-gradient(155deg, var(--c-cream-2) 0%, var(--c-peach) 100%);
  box-shadow: var(--sh-2);
}
.kyg-page .report__doc {
  background: #fff;
  border-radius: var(--r-md);
  padding: 28px;
  box-shadow: 0 18px 50px rgba(45, 32, 18, 0.1);
  position: relative;
}
.kyg-page .report__doc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--ink-line);
}
.kyg-page .report__doc-lab {
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--ink-3);
}
.kyg-page .report__doc-title {
  font-family: var(--ff);
  font-weight: 600;
  font-size: 18px;
  color: var(--ink-1);
  margin-top: 4px;
}
.kyg-page .report__doc-mark {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-teal-light), var(--c-teal));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}
.kyg-page .report__metric {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--ink-line);
}
.kyg-page .report__metric:last-child {
  border-bottom: none;
}
.kyg-page .report__metric-name {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink-2);
}
.kyg-page .report__metric-bar {
  position: relative;
  height: 7px;
  border-radius: 7px;
  background: var(--c-cream-2);
  overflow: hidden;
}
.kyg-page .report__metric-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, var(--c-teal-light), var(--c-teal));
  border-radius: 7px;
}
.kyg-page .report__metric-status {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 999px;
}
.kyg-page .r-stat-1 {
  background: #fde6dc;
  color: #b5482b;
}
.kyg-page .r-stat-2 {
  background: #fff1d4;
  color: #9a6c0f;
}
.kyg-page .r-stat-3 {
  background: rgba(37, 181, 171, 0.16);
  color: var(--c-teal);
}
.kyg-page .r-stat-4 {
  background: #e8f0dc;
  color: #557a30;
}

.kyg-page .report__doc-foot {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--ink-line);
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--ink-3);
}
.kyg-page .report__float {
  position: absolute;
  right: -18px;
  bottom: -18px;
  padding: 14px 18px;
  background: #fff;
  border-radius: var(--r-sm);
  box-shadow: 0 18px 50px rgba(45, 32, 18, 0.16);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 240px;
}
.kyg-page .report__float-ico {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: var(--ink-1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kyg-page .report__float-ico svg {
  width: 18px;
  height: 18px;
}
.kyg-page .report__float-text {
  font-size: 12.5px;
  line-height: 1.35;
  color: var(--ink-2);
}
.kyg-page .report__float-text b {
  display: block;
  color: var(--ink-1);
  font-weight: 600;
  margin-bottom: 2px;
}

.kyg-page .report__feats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 36px;
}
.kyg-page .report__feat {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid var(--ink-line);
  transition: all 0.5s var(--e-out);
}
.kyg-page .report__feat:hover {
  background: #fff;
  border-color: rgba(31, 26, 20, 0.16);
  transform: translateY(-2px);
}
.kyg-page .report__feat-ico {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--c-peach) 0%, var(--c-peach-2) 100%);
  color: var(--c-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kyg-page .report__feat-ico svg {
  width: 18px;
  height: 18px;
}
.kyg-page .report__feat-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--ink-1);
}

/* ========= GENEous Care (dark warm break) ========= */
.kyg-page .care {
  position: relative;
  border-radius: var(--r-2xl);
  margin: 0 var(--gutter);
  overflow: hidden;
}
.kyg-page .care__inner {
  padding: clamp(60px, 7vw, 96px) clamp(40px, 6vw, 80px);
  position: relative;
  z-index: 1;
}
.kyg-page .care__grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: center;
}
.kyg-page .care__items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 32px 0;
}
.kyg-page .care__item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-sm);
  font-size: 14.5px;
  color: var(--c-cream);
  transition: all 0.5s var(--e-out);
}
.kyg-page .care__item:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(37, 181, 171, 0.4);
  transform: translateX(4px);
}
.kyg-page .care__item-num {
  font-family: var(--ff);
  font-weight: 700;
  font-size: 13px;
  color: var(--c-teal-bright);
  letter-spacing: 0.06em;
  min-width: 20px;
}
.kyg-page .care__pills-lab {
  font-size: 11.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--c-peach-2);
  margin: 36px 0 14px;
}
.kyg-page .care__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.kyg-page .care__pill {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--c-cream);
  transition: all 0.4s var(--e-out);
}
.kyg-page .care__pill:hover {
  background: rgba(248, 228, 204, 0.15);
  border-color: var(--c-peach-2);
}
.kyg-page .care__hl {
  margin-top: 32px;
  padding: 20px 26px;
  border-radius: var(--r-sm);
  background: linear-gradient(135deg, rgba(37, 181, 171, 0.18), rgba(248, 228, 204, 0.1));
  border: 1px solid rgba(37, 181, 171, 0.32);
  font-family: var(--ff);
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.012em;
  color: #fff;
  line-height: 1.3;
}
.kyg-page .care__visual {
  position: relative;
  border-radius: var(--r-lg);
  overflow: hidden;
  aspect-ratio: 4 / 4.6;
  box-shadow: 0 36px 80px rgba(0, 0, 0, 0.36);
}
.kyg-page .care__visual img {
  position: absolute;
  top: -12%;
  left: 0;
  width: 100%;
  height: 124%;
  object-fit: cover;
  transition: transform 1.4s var(--e-out);
}
.kyg-page .care__visual:hover img {
  transform: scale(1.04);
}
.kyg-page .care__visual-tag {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: rgba(31, 26, 20, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  color: #fff;
}
.kyg-page .care__visual-tag::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-teal-bright);
  box-shadow: 0 0 0 4px rgba(42, 195, 162, 0.3);
  animation: pulse 2.4s ease-in-out infinite;
}

/* ========= How it works ========= */
.kyg-page .how__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 64px;
}
.kyg-page .how__head-text {
  max-width: 520px;
}
.kyg-page .how__head-r {
  max-width: 420px;
  padding-bottom: 6px;
}
.kyg-page .how__head-r p {
  font-size: 15px;
  color: var(--ink-2);
  line-height: 1.6;
}
.kyg-page .steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  position: relative;
}
.kyg-page .steps::before {
  content: '';
  position: absolute;
  top: 44px;
  left: 8%;
  right: 8%;
  height: 1.5px;
  background: repeating-linear-gradient(90deg, var(--c-teal-light) 0 4px, transparent 4px 12px);
  z-index: 0;
  opacity: 0.5;
}
.kyg-page .step {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}
.kyg-page .step__circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--c-cream);
  border: 1.5px solid var(--ink-line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-1);
  position: relative;
  transition: all 0.6s var(--e-out);
  margin-bottom: 24px;
  align-self: flex-start;
}
.kyg-page .step:hover .step__circle {
  background: var(--ink-1);
  color: var(--c-cream);
  border-color: var(--ink-1);
  transform: translateY(-4px) rotate(-3deg);
}
.kyg-page .step__circle svg {
  width: 34px;
  height: 34px;
  stroke-width: 1.5;
}
.kyg-page .step__num {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--c-peach-2);
  color: var(--ink-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 700;
  border: 3px solid var(--c-cream);
  transition: all 0.5s var(--e-out);
}
.kyg-page .step:hover .step__num {
  background: var(--c-teal-light);
  color: #fff;
}
.kyg-page .step__title {
  font-family: var(--ff);
  font-weight: 600;
  font-size: 16.5px;
  line-height: 1.25;
  letter-spacing: -0.012em;
  margin-bottom: 8px;
  color: var(--ink-1);
}
.kyg-page .step__desc {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--ink-3);
}

/* ========= Who is this for ========= */
.kyg-page .who__grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 80px;
  align-items: center;
}
.kyg-page .who__visual {
  position: relative;
  border-radius: var(--r-lg);
  overflow: hidden;
  aspect-ratio: 4 / 4.6;
  box-shadow: var(--sh-2);
}
.kyg-page .who__visual img {
  position: absolute;
  top: -12%;
  left: 0;
  width: 100%;
  height: 124%;
  object-fit: cover;
  will-change: transform;
}
.kyg-page .who__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 32px;
}
.kyg-page .who-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--ink-line);
  border-radius: 999px;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--ink-1);
  transition: all 0.5s var(--e-out);
  cursor: default;
}
.kyg-page .who-chip:hover {
  background: var(--ink-1);
  color: var(--c-cream);
  border-color: var(--ink-1);
  transform: translateY(-3px);
}
.kyg-page .who-chip svg {
  width: 16px;
  height: 16px;
  color: var(--c-teal);
  transition: color 0.35s var(--e-out);
}
.kyg-page .who-chip:hover svg {
  color: var(--c-teal-bright);
}

/* ========= Senior Care ========= */
.kyg-page .senior {
  background:
    radial-gradient(60% 50% at 100% 0%, rgba(243, 213, 178, 0.55), transparent 60%),
    radial-gradient(50% 50% at 0% 100%, rgba(248, 228, 204, 0.45), transparent 60%);
}
.kyg-page .senior__grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: center;
}
.kyg-page .senior__visual {
  position: relative;
  border-radius: var(--r-lg);
  overflow: hidden;
  aspect-ratio: 4 / 4.4;
  box-shadow: var(--sh-2);
}
.kyg-page .senior__visual img {
  position: absolute;
  top: -12%;
  left: 0;
  width: 100%;
  height: 124%;
  object-fit: cover;
  will-change: transform;
}
.kyg-page .senior__pills {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 32px 0;
}
.kyg-page .senior__pill {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid var(--ink-line);
  border-radius: var(--r-sm);
  transition: all 0.5s var(--e-out);
}
.kyg-page .senior__pill:hover {
  background: #fff;
  border-color: var(--c-teal-light);
  transform: translateY(-3px);
  box-shadow: var(--sh-1);
}
.kyg-page .senior__pill-ico {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--c-peach) 0%, var(--c-peach-2) 100%);
  color: var(--c-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kyg-page .senior__pill-ico svg {
  width: 20px;
  height: 20px;
}
.kyg-page .senior__pill-text {
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.3;
  color: var(--ink-1);
}
.kyg-page .senior__hl {
  font-family: var(--ff);
  font-weight: 600;
  font-size: clamp(22px, 2.6vw, 30px);
  letter-spacing: -0.018em;
  line-height: 1.25;
  color: var(--ink-1);
  margin-top: 28px;
  max-width: 540px;
}

/* ========= Health Decoded ========= */
.kyg-page .decoded__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.kyg-page .dcard {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--r-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--ink-line);
  transition: all 0.7s var(--e-out);
  aspect-ratio: 4 / 4.4;
  isolation: isolate;
}
.kyg-page .dcard:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 60px rgba(45, 32, 18, 0.16);
  border-color: rgba(31, 26, 20, 0.16);
}
.kyg-page .dcard__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transition: transform 1.4s var(--e-out);
}
.kyg-page .dcard:hover .dcard__img {
  transform: scale(1.06);
}
.kyg-page .dcard__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(31, 26, 20, 0) 30%, rgba(31, 26, 20, 0.55) 70%, rgba(31, 26, 20, 0.9) 100%);
  z-index: 1;
}
.kyg-page .dcard__body {
  position: relative;
  z-index: 2;
  margin-top: auto;
  padding: 24px 26px 26px;
  color: #fff;
}
.kyg-page .dcard__tag {
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--c-peach-2);
  display: inline-flex;
}
.kyg-page .dcard__title {
  font-family: var(--ff);
  font-weight: 600;
  font-size: 20px;
  line-height: 1.2;
  letter-spacing: -0.012em;
  margin-top: 10px;
  color: #fff;
}
.kyg-page .dcard__desc {
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 8px;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    max-height 0.55s var(--e-out),
    opacity 0.45s var(--e-out),
    margin-top 0.45s var(--e-out);
}
.kyg-page .dcard:hover .dcard__desc {
  max-height: 120px;
  opacity: 1;
  margin-top: 10px;
}
.kyg-page .dcard__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}
.kyg-page .dcard__link svg {
  width: 14px;
  height: 14px;
  transition: transform 0.5s var(--e-out);
}
.kyg-page .dcard:hover .dcard__link svg {
  transform: translateX(4px);
}

.kyg-page .dcard--cta {
  background: linear-gradient(160deg, var(--dark-1) 0%, var(--dark-2) 100%);
  border: none;
}
.kyg-page .dcard--cta::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(60% 70% at 80% 20%, rgba(37, 181, 171, 0.25), transparent 60%);
}
.kyg-page .dcard--cta .dcard__body {
  padding: 32px;
}
.kyg-page .dcard--cta .dcard__title {
  font-size: 24px;
}
.kyg-page .dcard--cta .dcard__desc {
  max-height: 120px;
  opacity: 1;
  margin-top: 14px;
  color: rgba(250, 246, 239, 0.75);
}

/* ========= Trust & Privacy ========= */
.kyg-page .privacy__grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: center;
}
.kyg-page .privacy__shield {
  position: relative;
  aspect-ratio: 1 / 1.1;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 900px;
}
.kyg-page .privacy__shield svg {
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition:
    transform 0.25s var(--e-out),
    filter 0.6s var(--e-out);
  filter: drop-shadow(0 16px 32px rgba(14, 77, 75, 0.28));
  will-change: transform;
}
.kyg-page .privacy__shield:hover svg {
  filter: drop-shadow(0 26px 50px rgba(14, 77, 75, 0.4));
}
.kyg-page .privacy__shield::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(50% 50% at 50% 50%, rgba(37, 181, 171, 0.18) 0%, transparent 60%);
  animation: meshDrift 22s ease-in-out infinite alternate;
}
.kyg-page .privacy__items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 32px;
}
.kyg-page .privacy__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--ink-line);
  border-radius: var(--r-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-1);
  transition: all 0.5s var(--e-out);
}
.kyg-page .privacy__item:hover {
  background: #fff;
  border-color: var(--c-teal-light);
  transform: translateY(-2px);
}
.kyg-page .privacy__item svg {
  width: 18px;
  height: 18px;
  color: var(--c-teal);
  flex-shrink: 0;
}

/* ========= The Movement (dark) ========= */
.kyg-page .movement {
  background: linear-gradient(180deg, var(--dark-1) 0%, var(--dark-2) 100%);
  border-radius: var(--r-2xl);
  margin: 0 var(--gutter);
  overflow: hidden;
  position: relative;
}
.kyg-page .movement::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(50% 60% at 90% 10%, rgba(248, 228, 204, 0.16), transparent 60%),
    radial-gradient(60% 60% at 10% 90%, rgba(37, 181, 171, 0.18), transparent 60%);
  animation: meshDrift 28s ease-in-out infinite alternate;
}
.kyg-page .movement__inner {
  position: relative;
  z-index: 3;
  padding: clamp(60px, 7vw, 96px) clamp(40px, 6vw, 80px);
}

/* Layered animated backdrop for the Movement section */
.kyg-page .movement__bgfx {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}
/* Large drifting glow orbs (most visible layer) */
.kyg-page .movement__bgfx::before {
  content: '';
  position: absolute;
  inset: -15%;
  background:
    radial-gradient(circle 280px at 14% 22%, rgba(37, 181, 171, 0.32), transparent 65%),
    radial-gradient(circle 320px at 82% 32%, rgba(248, 228, 204, 0.22), transparent 65%),
    radial-gradient(circle 260px at 28% 78%, rgba(243, 213, 178, 0.2), transparent 65%),
    radial-gradient(circle 340px at 86% 82%, rgba(37, 181, 171, 0.26), transparent 65%),
    radial-gradient(circle 220px at 50% 50%, rgba(37, 181, 171, 0.18), transparent 65%);
  animation: orbsDrift 18s ease-in-out infinite alternate;
}
/* Brighter, larger particles */
.kyg-page .movement__bgfx::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(3px 3px at 12% 22%, rgba(37, 181, 171, 0.85), transparent 60%),
    radial-gradient(2.5px 2.5px at 88% 18%, rgba(248, 228, 204, 0.8), transparent 60%),
    radial-gradient(3.5px 3.5px at 30% 78%, rgba(37, 181, 171, 0.75), transparent 60%),
    radial-gradient(2.5px 2.5px at 72% 86%, rgba(37, 181, 171, 0.7), transparent 60%),
    radial-gradient(2px 2px at 55% 40%, rgba(255, 255, 255, 0.65), transparent 60%),
    radial-gradient(3px 3px at 8% 60%, rgba(243, 213, 178, 0.7), transparent 60%),
    radial-gradient(3px 3px at 95% 55%, rgba(248, 228, 204, 0.7), transparent 60%),
    radial-gradient(2px 2px at 42% 12%, rgba(255, 255, 255, 0.55), transparent 60%),
    radial-gradient(2.5px 2.5px at 22% 48%, rgba(37, 181, 171, 0.65), transparent 60%),
    radial-gradient(3px 3px at 78% 62%, rgba(248, 228, 204, 0.6), transparent 60%),
    radial-gradient(2px 2px at 5% 38%, rgba(37, 181, 171, 0.6), transparent 60%),
    radial-gradient(2.5px 2.5px at 65% 8%, rgba(243, 213, 178, 0.6), transparent 60%),
    radial-gradient(2px 2px at 38% 88%, rgba(255, 255, 255, 0.55), transparent 60%),
    radial-gradient(3px 3px at 62% 72%, rgba(37, 181, 171, 0.6), transparent 60%),
    radial-gradient(2px 2px at 18% 92%, rgba(248, 228, 204, 0.55), transparent 60%);
  animation: particlesDrift 20s ease-in-out infinite alternate;
  filter: blur(0.3px);
}
@keyframes particlesDrift {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(14px, -18px, 0);
  }
  100% {
    transform: translate3d(-12px, 14px, 0);
  }
}
@keyframes orbsDrift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.85;
  }
  50% {
    transform: translate3d(-32px, 22px, 0) scale(1.08);
    opacity: 1;
  }
  100% {
    transform: translate3d(24px, -18px, 0) scale(0.94);
    opacity: 0.9;
  }
}

/* SVG wave overlay sits between bgfx and inner */
.kyg-page .movement__waves {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.22;
}
.kyg-page .movement__waves svg {
  width: 100%;
  height: 100%;
}

.kyg-page .movement__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  margin-top: 56px;
}
.kyg-page .movement__item {
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  padding-top: 22px;
}
.kyg-page .movement__item-num {
  font-family: var(--ff);
  font-weight: 600;
  font-size: 13px;
  color: var(--c-peach-2);
  letter-spacing: 0.22em;
}
.kyg-page .movement__item-text {
  font-family: var(--ff);
  font-weight: 600;
  font-size: 19px;
  color: var(--c-cream);
  line-height: 1.3;
  margin-top: 12px;
  letter-spacing: -0.012em;
}
.kyg-page .movement__hl {
  font-family: var(--ff);
  font-weight: 500;
  font-size: clamp(34px, 4.6vw, 60px);
  margin-top: 72px;
  letter-spacing: -0.028em;
  line-height: 1.06;
  color: var(--c-cream);
}
.kyg-page .movement__hl span {
  background: linear-gradient(110deg, var(--c-peach-2) 0%, var(--c-teal-light) 50%, var(--c-peach-2) 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradShift 9s ease-in-out infinite;
}

/* ========= Final CTA ========= */
.kyg-page .finalcta {
  padding: clamp(96px, 11vw, 160px) 0;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.kyg-page .finalcta__inner {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.kyg-page .finalcta__h {
  font-family: var(--ff);
  font-weight: 500;
  font-size: clamp(40px, 5.6vw, 78px);
  line-height: 0.98;
  letter-spacing: -0.032em;
  color: var(--ink-1);
}
.kyg-page .finalcta__h em {
  font-style: normal;
  display: block;
  font-weight: 600;
}
.kyg-page .finalcta__sub {
  font-size: clamp(17px, 1.4vw, 21px);
  color: var(--ink-2);
  margin-top: 22px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}
.kyg-page .finalcta__btns {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 42px;
  flex-wrap: wrap;
}

/* Floating squircle photo frames flanking the CTA copy */
.kyg-page .finalcta__floats {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  perspective: 1400px;
  perspective-origin: 50% 40%;
}
.kyg-page .finalcta__photo {
  position: absolute;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--c-cream);
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 38px 70px -12px rgba(45, 32, 18, 0.28),
    0 18px 32px -8px rgba(45, 32, 18, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  will-change: transform;
  opacity: 0.86;
  transform-style: preserve-3d;
  transition:
    transform 0.8s var(--e-out),
    box-shadow 0.8s var(--e-out),
    opacity 0.6s var(--e-out);
}
.kyg-page .finalcta__photo:hover {
  opacity: 1;
  box-shadow:
    0 50px 90px -14px rgba(45, 32, 18, 0.36),
    0 22px 40px -10px rgba(45, 32, 18, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}
.kyg-page .finalcta__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(0.88) contrast(1.01);
  animation: ctaPhotoBob var(--bob-dur, 7s) ease-in-out infinite alternate;
  animation-delay: var(--bob-dly, 0s);
  will-change: transform;
}
.kyg-page .finalcta__photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(250, 246, 239, 0) 60%, rgba(250, 246, 239, 0.18) 100%);
  pointer-events: none;
  z-index: 2;
}

/* Position the 4 photos: 2 left, 2 right - each with its own 3D tilt */
.kyg-page .finalcta__photo--tl {
  top: 8%;
  left: 4%;
  width: clamp(170px, 18vw, 240px);
  aspect-ratio: 4/5;
  --bob-dur: 7.5s;
  --bob-dly: 0s;
  --tilt: rotateY(14deg) rotateX(-6deg) rotateZ(-3deg);
}
.kyg-page .finalcta__photo--bl {
  bottom: 8%;
  left: 8%;
  width: clamp(190px, 20vw, 270px);
  aspect-ratio: 5/4;
  --bob-dur: 8.5s;
  --bob-dly: -2s;
  --tilt: rotateY(12deg) rotateX(4deg) rotateZ(2deg);
}
.kyg-page .finalcta__photo--tr {
  top: 10%;
  right: 5%;
  width: clamp(200px, 21vw, 280px);
  aspect-ratio: 5/4;
  --bob-dur: 8s;
  --bob-dly: -3s;
  --tilt: rotateY(-14deg) rotateX(-5deg) rotateZ(3deg);
}
.kyg-page .finalcta__photo--br {
  bottom: 6%;
  right: 4%;
  width: clamp(170px, 18vw, 240px);
  aspect-ratio: 4/5;
  --bob-dur: 9s;
  --bob-dly: -1.2s;
  --tilt: rotateY(-12deg) rotateX(5deg) rotateZ(-2deg);
}

@keyframes ctaPhotoBob {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-6px) scale(1.015);
  }
}

@media (max-width: 980px) {
  .kyg-page .finalcta__photo--tl {
    width: 130px;
    top: 4%;
    left: 2%;
  }
  .kyg-page .finalcta__photo--bl {
    width: 140px;
    bottom: 4%;
    left: 4%;
  }
  .kyg-page .finalcta__photo--tr {
    width: 150px;
    top: 6%;
    right: 2%;
  }
  .kyg-page .finalcta__photo--br {
    width: 130px;
    bottom: 3%;
    right: 2%;
  }
}
@media (max-width: 680px) {
  .kyg-page .finalcta__floats {
    display: none;
  }
}

/* ========= Responsive ========= */
@media (max-width: 1180px) {
  .kyg-page .megamenu__inner {
    grid-template-columns: 1fr 1fr;
  }
  .kyg-page .hero__inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .kyg-page .hero__aside {
    align-items: flex-start;
  }
  .kyg-page .hero {
    min-height: auto;
    padding-top: 48px;
    padding-bottom: 64px;
  }
  .kyg-page .hero__h {
    font-size: clamp(40px, 8vw, 76px);
  }
  .kyg-page .why__grid,
  .kyg-page .what__grid,
  .kyg-page .report__grid,
  .kyg-page .care__grid,
  .kyg-page .who__grid,
  .kyg-page .senior__grid,
  .kyg-page .privacy__grid {
    grid-template-columns: 1fr;
    gap: 56px;
  }
  .kyg-page .pkg__cards {
    grid-template-columns: 1fr 1fr;
  }
  .kyg-page .steps {
    grid-template-columns: repeat(5, minmax(160px, 1fr));
    overflow-x: auto;
    padding-bottom: 16px;
  }
  .kyg-page .steps::before {
    display: none;
  }
  .kyg-page .decoded__grid {
    grid-template-columns: 1fr 1fr;
  }
  .kyg-page .movement__list {
    grid-template-columns: 1fr 1fr;
  }
  .kyg-page .footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
  .kyg-page .how__head {
    flex-direction: column;
    align-items: flex-start;
  }
  .kyg-page .what__items,
  .kyg-page .care__items,
  .kyg-page .senior__pills {
    grid-template-columns: 1fr;
  }
  .kyg-page .care,
  .kyg-page .movement {
    margin: 0;
    border-radius: 0;
  }
  .kyg-page .hero__media {
    border-radius: 0;
  }
}
@media (max-width: 720px) {
  .kyg-page .nav__links {
    display: none;
  }
  .kyg-page .nav__burger {
    display: flex;
  }
  .kyg-page .nav__cta .btn--ghost {
    display: none;
  }
  .kyg-page .nav__inner {
    height: 68px;
  }
  .kyg-page .hero__floater {
    display: none;
  }
  .kyg-page .pkg__cards {
    grid-template-columns: 1fr;
  }
  .kyg-page .decoded__grid {
    grid-template-columns: 1fr;
  }
  .kyg-page .movement__list {
    grid-template-columns: 1fr;
  }
  .kyg-page .footer__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .kyg-page .why__qs {
    padding: 22px 22px;
  }
  .kyg-page .privacy__items,
  .kyg-page .why__list,
  .kyg-page .report__feats {
    grid-template-columns: 1fr;
  }
}

/* ========================================================================
   Overrides: next/font wiring, reduced base scale, extra responsive cover.
   ======================================================================== */
.kyg-page {
  /* Use the next/font-loaded Figtree / Hind variables defined by the layout. */
  --ff: var(--font-figtree), 'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ff-i: var(--font-hind), 'Hind', var(--font-figtree), 'Figtree', sans-serif;

  /* Shrink the type scale ~15% vs the kyg.html original and clamp the big steps. */
  --fs-xs: 11px;
  --fs-sm: 13px;
  --fs-md: 15px;
  --fs-lg: 16px;
  --fs-xl: 19px;
  --fs-2xl: clamp(22px, 2.4vw, 26px);
  --fs-3xl: clamp(26px, 3.2vw, 32px);
  --fs-4xl: clamp(32px, 4.2vw, 42px);
  --fs-5xl: clamp(40px, 5.4vw, 56px);
  --fs-6xl: clamp(48px, 7.4vw, 72px);

  font-family: var(--ff);
  font-size: var(--fs-md);
  color: var(--ink-1);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Stop the parallax floaters causing horizontal scroll. */
.kyg-page {
  overflow-x: hidden;
}

@media (max-width: 1180px) {
  .kyg-page {
    --gutter: clamp(16px, 3vw, 36px);
    --r-2xl: 44px;
    --r-xl: 36px;
  }
  .kyg-page .hero__h {
    font-size: clamp(34px, 6.4vw, 56px);
  }
  .kyg-page .hero__sub {
    font-size: var(--fs-md);
  }
}

@media (max-width: 880px) {
  .kyg-page {
    --fs-xs: 11px;
    --fs-sm: 12px;
    --fs-md: 14px;
    --fs-lg: 15px;
    --fs-xl: 17px;
  }
  .kyg-page .megamenu__inner {
    grid-template-columns: 1fr !important;
  }
  .kyg-page .hero__cta {
    flex-wrap: wrap;
  }
  .kyg-page .hero__cta .btn {
    width: 100%;
    justify-content: center;
  }
  .kyg-page .pkg__cards {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 720px) {
  .kyg-page {
    --gutter: 18px;
    --r-2xl: 32px;
    --r-xl: 28px;
    --r-lg: 24px;
  }
  .kyg-page .hero {
    padding-top: 32px;
    padding-bottom: 48px;
  }
  .kyg-page .hero__h {
    font-size: clamp(28px, 9vw, 40px);
    line-height: 1.1;
  }
  .kyg-page .hero__sub {
    font-size: 14px;
    line-height: 1.5;
  }
  .kyg-page .hero__pill {
    font-size: 11px;
    padding: 8px 12px;
  }
  .kyg-page .hero__cta .btn {
    padding: 12px 18px;
    font-size: 14px;
  }
  .kyg-page .nav__cta {
    gap: 8px;
  }
  .kyg-page .nav__cta .btn--ghost {
    display: none;
  }
  .kyg-page .footer {
    padding: 48px 0 32px;
  }
  .kyg-page .footer__brandline {
    font-size: clamp(40px, 14vw, 64px);
  }
}

@media (max-width: 420px) {
  .kyg-page {
    --gutter: 14px;
  }
  .kyg-page .nav__logo svg {
    width: 110px;
  }
  .kyg-page .btn {
    font-size: 13px;
    padding: 10px 14px;
  }
  .kyg-page .hero__h {
    font-size: clamp(26px, 9vw, 34px);
  }
}

@media (max-width: 980px) {
  .kyg-page .nav__cta .btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  .kyg-page .nav__cta .btn .ico {
    width: 14px;
    height: 14px;
  }
}

/* ========================================================================
   Fixed nav + 100vh hero
   ======================================================================== */
.kyg-page .nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.kyg-page .nav__inner {
  height: 72px;
}

/* Hero: exact 100vh with content centered and the heading sized to fit. */
.kyg-page .hero {
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  padding: 0;
  display: flex;
  align-items: center;
}
.kyg-page .hero__media {
  border-radius: 0;
}
.kyg-page .hero__inner {
  padding-top: 96px;
  padding-bottom: 32px;
}
.kyg-page .hero__copy {
  max-width: min(1100px, 100%);
}
.kyg-page .hero__h {
  font-size: clamp(34px, 5.8vw, 84px);
  line-height: 1.02;
}
.kyg-page .hero__h-line {
  display: block;
}
/* Keep each line on a single row at desktop widths where we have the space. */
@media (min-width: 1024px) {
  .kyg-page .hero__h-line {
    white-space: nowrap;
  }
}
.kyg-page .hero__sub {
  margin-top: 20px;
}
.kyg-page .hero__cta {
  margin-top: 28px;
}

/* Tablet */
@media (max-width: 1180px) {
  .kyg-page .nav__inner {
    height: 64px;
  }
  .kyg-page .hero__inner {
    padding-top: 84px;
    padding-bottom: 28px;
  }
  .kyg-page .hero__pill {
    margin-bottom: 22px;
  }
}

/* Small tablet / large phone */
@media (max-width: 880px) {
  .kyg-page .nav__inner {
    height: 60px;
  }
  .kyg-page .hero__inner {
    padding-top: 76px;
    padding-bottom: 24px;
  }
  .kyg-page .hero__h {
    font-size: clamp(30px, 7.4vw, 56px);
  }
  .kyg-page .hero__pill {
    margin-bottom: 18px;
    font-size: 13px;
    padding: 8px 18px 8px 8px;
  }
  .kyg-page .hero__pill-dot {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
}

/* Phones */
@media (max-width: 720px) {
  .kyg-page .nav__inner {
    height: 56px;
    gap: 12px;
  }
  .kyg-page .nav__logo svg {
    height: 28px;
  }
  .kyg-page .hero__inner {
    padding-top: 68px;
    padding-bottom: 20px;
  }
  .kyg-page .hero__h {
    font-size: clamp(26px, 8vw, 40px);
    line-height: 1.04;
  }
  .kyg-page .hero__sub {
    font-size: 14px;
    line-height: 1.5;
    margin-top: 14px;
    max-width: none;
  }
  .kyg-page .hero__cta {
    margin-top: 20px;
    gap: 10px;
  }
  .kyg-page .hero__cta .btn {
    width: 100%;
    padding: 12px 18px;
    font-size: 14px;
  }
  .kyg-page .hero__pill {
    margin-bottom: 14px;
    font-size: 11px;
    padding: 6px 14px 6px 6px;
  }
  .kyg-page .hero__pill-dot {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }
}

/* Extra small (down to 320px) */
@media (max-width: 420px) {
  .kyg-page {
    --gutter: 14px;
  }
  .kyg-page .nav__inner {
    height: 52px;
    gap: 8px;
  }
  .kyg-page .nav__logo svg {
    height: 22px;
  }
  .kyg-page .nav__cta {
    gap: 6px;
  }
  .kyg-page .nav__cta .btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  .kyg-page .nav__cta .btn .ico {
    width: 12px;
    height: 12px;
  }
  .kyg-page .hero__inner {
    padding-top: 64px;
    padding-bottom: 16px;
  }
  .kyg-page .hero__h {
    font-size: clamp(22px, 8.5vw, 32px);
    line-height: 1.08;
    letter-spacing: -0.02em;
  }
  .kyg-page .hero__sub {
    font-size: 13px;
    margin-top: 12px;
  }
  .kyg-page .hero__cta {
    margin-top: 16px;
  }
  .kyg-page .hero__cta .btn {
    padding: 11px 14px;
    font-size: 13px;
  }
  .kyg-page .hero__pill {
    margin-bottom: 12px;
    font-size: 10.5px;
    padding: 5px 12px 5px 5px;
    gap: 8px;
  }
  .kyg-page .hero__pill-dot {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
}

@media (max-width: 360px) {
  .kyg-page {
    --gutter: 12px;
  }
  .kyg-page .nav__cta .btn--primary {
    padding: 6px 10px;
  }
  .kyg-page .nav__cta .btn--primary svg {
    display: none;
  }
  .kyg-page .hero__h {
    font-size: clamp(20px, 8.8vw, 28px);
  }
  .kyg-page .hero__sub {
    font-size: 12.5px;
  }
  .kyg-page .hero__cta .btn {
    font-size: 12.5px;
    padding: 10px 12px;
  }
}

/* ========================================================================
   Generic responsive hardening for ALL sections down to 320px
   ======================================================================== */

/* Stop any element from causing horizontal scroll. */
.kyg-page img,
.kyg-page svg,
.kyg-page video {
  max-width: 100%;
  height: auto;
}

/* Generic container fluidity */
@media (max-width: 720px) {
  .kyg-page section {
    padding-left: 0;
    padding-right: 0;
  }
  .kyg-page .container,
  .kyg-page .container--wide {
    padding-left: var(--gutter);
    padding-right: var(--gutter);
  }
}

/* Tighten all grid layouts on small screens to single column */
@media (max-width: 720px) {
  .kyg-page .why__grid,
  .kyg-page .what__grid,
  .kyg-page .report__grid,
  .kyg-page .care__grid,
  .kyg-page .who__grid,
  .kyg-page .senior__grid,
  .kyg-page .privacy__grid,
  .kyg-page .pkg__cards,
  .kyg-page .decoded__grid,
  .kyg-page .movement__list,
  .kyg-page .footer__grid,
  .kyg-page .what__items,
  .kyg-page .care__items,
  .kyg-page .senior__pills,
  .kyg-page .privacy__items,
  .kyg-page .why__list,
  .kyg-page .report__feats,
  .kyg-page .steps {
    grid-template-columns: 1fr !important;
    gap: 16px;
  }
}

@media (max-width: 420px) {
  .kyg-page section {
    padding-top: 48px;
    padding-bottom: 48px;
  }
  .kyg-page h2,
  .kyg-page .section__h {
    font-size: clamp(22px, 6.8vw, 30px);
    line-height: 1.15;
  }
  .kyg-page p {
    font-size: 14px;
    line-height: 1.55;
  }
  .kyg-page .btn {
    padding: 10px 14px;
    font-size: 13px;
  }
  .kyg-page .eyebrow {
    font-size: 11px;
  }
  .kyg-page .footer__brandline {
    font-size: clamp(34px, 14vw, 56px);
    line-height: 1;
  }
  .kyg-page .trust__item {
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .kyg-page section {
    padding-top: 40px;
    padding-bottom: 40px;
  }
  .kyg-page h2,
  .kyg-page .section__h {
    font-size: clamp(20px, 7vw, 26px);
  }
}

/* ========================================================================
   Trust marquee: keep the glowing dot inline with its text at every width.
   ======================================================================== */
.kyg-page .trust__label {
  flex-wrap: nowrap;
  white-space: nowrap;
}
.kyg-page .trust__label-dot {
  flex-shrink: 0;
  display: inline-block;
}
.kyg-page .trust__label > span {
  display: inline-flex;
  align-items: center;
}
.kyg-page .trust__item {
  flex-shrink: 0; /* the marquee items must never compress */
  flex-wrap: nowrap;
}
.kyg-page .trust__item svg {
  flex-shrink: 0;
}
.kyg-page .trust__item-dot {
  flex-shrink: 0;
  align-self: center;
}

/* On narrow screens the decorative side-lines on the label squeeze the dot off
   the line; collapse them and keep just \`dot + text\` on one row. */
@media (max-width: 560px) {
  .kyg-page .trust__label::before,
  .kyg-page .trust__label::after {
    display: none;
  }
  .kyg-page .trust__label {
    gap: 8px;
    font-size: 11px;
    letter-spacing: 0.18em;
  }
}

@media (max-width: 420px) {
  .kyg-page .trust {
    padding: 36px 0;
  }
  .kyg-page .trust__track {
    gap: 40px;
  }
  .kyg-page .trust__item {
    font-size: 13px;
    gap: 10px;
  }
  .kyg-page .trust__item svg {
    width: 22px;
    height: 22px;
  }
}
`;

// Tests section was added to html/KYG.html after the initial convert-kyg.py
// run, so its CSS is appended here as a second scoped block. Same .kyg-page
// prefix means it composes safely with KYG_PAGE_CSS above.
const KYG_TESTS_CSS = `/* ============================================================
   OUR TESTS - product slider section
   ============================================================ */
.kyg-page .tests {
  position:relative;
  overflow:hidden;
}
.kyg-page .tests .s-head {
  text-align:center;
  margin-left:auto; margin-right:auto;
  max-width: 760px;
}
.tests .s-head .eyebrow{ justify-content:center; }

/* Per-test color tokens, applied via data-theme on cards & tabs */
.kyg-page .tests {
  --t-wellness-50:  #E9F5EE;
  --t-wellness-100: #D7ECDF;
  --t-wellness-500: #2F8C5C;
  --t-wellness-700: #1F6B43;

  --t-roots-50:  #ECEAFC;
  --t-roots-100: #DCD8FB;
  --t-roots-500: #6F61E8;
  --t-roots-700: #4E40C2;

  --t-women-50:  #FBE9F0;
  --t-women-100: #F8D4E1;
  --t-women-500: #C73C70;
  --t-women-700: #9A2855;

  --t-men-50:   #E5EFFA;
  --t-men-100:  #D0E2F7;
  --t-men-500:  #1F62B8;
  --t-men-700:  #154A8E;

  --t-matri-50:  #FAEBD9;
  --t-matri-100: #F5D7B0;
  --t-matri-500: #B66B16;
  --t-matri-700: #8B4F0E;
}

/* ===== Two-column split ===== */
.kyg-page .tests__split {
  margin-top: clamp(40px, 5vw, 64px);
  display:grid;
  grid-template-columns: 1.05fr .95fr;
  gap: clamp(24px, 2.6vw, 40px);
  align-items: start;
}

/* ----- LEFT: standalone Wellness panel ----- */
.tests__left{ min-width: 0; }
.kyg-page .wr-panel {
  --t-accent-50: var(--t-wellness-50);
  --t-accent-100: var(--t-wellness-100);
  --t-accent-500: var(--t-wellness-500);
  --t-accent-700: var(--t-wellness-700);
  position: relative;
  background: #fff;
  border: 1px solid var(--ink-line);
  border-radius: var(--r-lg);
  padding: clamp(26px, 2.8vw, 40px);
  box-shadow: 0 2px 6px rgba(45,32,18,.04), 0 18px 50px -24px rgba(45,32,18,.18);
  display:flex;
  flex-direction:column;
  overflow:hidden;
}
.kyg-page .wr-panel::before {
  content:"";
  position:absolute;
  right:-140px; bottom:-140px;
  width: 360px; height: 360px;
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--t-accent-50), transparent 72%);
  pointer-events:none; z-index:0;
}
.wr-panel > *{ position: relative; z-index:1; }
.kyg-page .wr-panel__head {
  padding-bottom: clamp(18px, 1.8vw, 24px);
  border-bottom: 1px solid var(--ink-line);
}
.kyg-page .wr-panel__tag {
  display:inline-flex; align-items:center;
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--t-accent-50);
  color: var(--t-accent-700);
  font-size: 11.5px; font-weight: 700;
  letter-spacing: .14em; text-transform: uppercase;
}
.kyg-page .wr-panel__title {
  font-family: var(--ff);
  font-size: clamp(26px, 2.6vw, 34px);
  font-weight: 600; line-height: 1.08;
  letter-spacing: -.02em; color: var(--ink-1);
  margin-top: 16px;
}
.kyg-page .wr-panel__desc {
  font-size: clamp(14.5px, 1.05vw, 16px);
  line-height: 1.55; color: var(--ink-2);
  margin-top: 12px;
}
.wr-panel__body{ padding-top: clamp(20px, 2vw, 26px); }
.kyg-page .wr-panel__sub-lab {
  font-size: 12px; font-weight: 700;
  letter-spacing: .16em; text-transform: uppercase;
  color: var(--ink-3); margin-bottom: 16px;
}
.kyg-page .wr-panel__foot {
  margin-top: clamp(22px, 2.4vw, 30px);
  padding-top: clamp(18px, 2vw, 24px);
  border-top: 1px solid var(--ink-line);
  display:flex; align-items:center; justify-content:space-between;
  gap: 16px; flex-wrap: wrap;
}
.wr-panel__pills{ display:flex; flex-wrap:wrap; gap:8px; }
.kyg-page .wr-panel__pill {
  display:inline-flex; align-items:center;
  padding: 7px 13px; border-radius: 999px;
  background: rgba(31,26,20,.04);
  border: 1px solid var(--ink-line);
  font-size: 12px; font-weight: 500;
  color: var(--ink-3); letter-spacing: -.005em;
}
.kyg-page .wr-panel__cta {
  display:inline-flex; align-items:center; gap:10px; padding:12px 22px; border-radius:9999px; color:#fff; font-family:var(--ff); font-size:14.5px; font-weight:600; letter-spacing:-.005em; border:0; cursor:pointer;
  background: var(--t-accent-500);
  transition: background .35s var(--e-out), transform .45s var(--e-out), box-shadow .45s var(--e-out);
}
.wr-panel__cta svg{ width:14px; height:14px; transition: transform .45s var(--e-out); }
.kyg-page .wr-panel__cta:hover {
  background: var(--t-accent-700);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -8px rgba(31,107,67,.45);
}
.wr-panel__cta:hover svg{ transform: translateX(3px); }

/* ----- RIGHT: package carousel ----- */
.tests__right{ position: relative; min-width: 0; }
.kyg-page .tests__right-head {
  display:flex; align-items:center; justify-content:space-between;
  gap: 16px; margin-bottom: 16px;
}
.kyg-page .tests__right-lab {
  font-size: 12px; font-weight: 700;
  letter-spacing: .16em; text-transform: uppercase;
  color: var(--ink-3);
}
.kyg-page .tests__track-wrap {
  position:relative;
  border-radius: var(--r-lg);
}
.kyg-page .tests__track {
  display:flex;
  align-items: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-radius: var(--r-lg);
}
.tests__track::-webkit-scrollbar{ display:none; }

.kyg-page .test-card {
  flex: 0 0 100%;
  width: 100%;
  scroll-snap-align: center;
  background: #fff;
  border-radius: var(--r-lg);
  border: 1px solid var(--ink-line);
  padding: clamp(26px, 2.8vw, 40px);
  box-shadow: 0 2px 6px rgba(45,32,18,.04), 0 18px 50px -24px rgba(45,32,18,.18);
  display:flex;
  flex-direction:column;
  position:relative;
  overflow:hidden;
}
/* Decorative accent blob bottom-right */
.kyg-page .test-card::before {
  content:"";
  position:absolute;
  right: -140px;
  bottom: -140px;
  width: 360px; height: 360px;
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--t-accent-50), transparent 72%);
  pointer-events: none;
  z-index: 0;
}

/* Apply theme accent per card */
.test-card[data-theme="wellness"]{ --t-accent-50: var(--t-wellness-50); --t-accent-100: var(--t-wellness-100); --t-accent-500: var(--t-wellness-500); --t-accent-700: var(--t-wellness-700); }
.test-card[data-theme="roots"]{    --t-accent-50: var(--t-roots-50);    --t-accent-100: var(--t-roots-100);    --t-accent-500: var(--t-roots-500);    --t-accent-700: var(--t-roots-700); }
.test-card[data-theme="women"]{    --t-accent-50: var(--t-women-50);    --t-accent-100: var(--t-women-100);    --t-accent-500: var(--t-women-500);    --t-accent-700: var(--t-women-700); }
.test-card[data-theme="men"]{      --t-accent-50: var(--t-men-50);      --t-accent-100: var(--t-men-100);      --t-accent-500: var(--t-men-500);      --t-accent-700: var(--t-men-700); }
.test-card[data-theme="matri"]{    --t-accent-50: var(--t-matri-50);    --t-accent-100: var(--t-matri-100);    --t-accent-500: var(--t-matri-500);    --t-accent-700: var(--t-matri-700); }

/* Card header */
.kyg-page .test-card__head {
  position:relative;
  z-index:1;
  padding-bottom: clamp(18px, 1.8vw, 26px);
  border-bottom: 1px solid var(--ink-line);
}
.kyg-page .test-card__tag {
  display:inline-flex; align-items:center;
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--t-accent-50);
  color: var(--t-accent-700);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.kyg-page .test-card__title {
  font-family: var(--ff);
  font-size: clamp(26px, 2.6vw, 36px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -.02em;
  color: var(--ink-1);
  margin-top: 18px;
}
.kyg-page .test-card__desc {
  font-size: clamp(15px, 1.15vw, 17px);
  line-height: 1.55;
  color: var(--ink-2);
  margin-top: 14px;
  max-width: 620px;
}

/* Card body */
.kyg-page .test-card__body {
  position:relative;
  z-index:1;
  padding-top: clamp(20px, 2vw, 28px);
}
.kyg-page .test-card__sub-lab {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 16px;
}
.kyg-page .test-card__list {
  display:flex; flex-direction:column;
  gap: 12px;
}
.kyg-page .test-card__list li {
  display:flex; align-items:flex-start; gap:14px;
  font-size: clamp(15px, 1.1vw, 17px);
  line-height: 1.45;
  color: var(--ink-1);
  letter-spacing: -.005em;
}
.kyg-page .test-card__check {
  flex: 0 0 22px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--t-accent-50);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--t-accent-500);
  margin-top: 1px;
}
.test-card__check svg{ width: 12px; height: 12px; stroke-width: 2.4; }

/* ===== My Wellness Report - 4 sub-test cards inside the parent card ===== */
.kyg-page .wr-grid {
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(14px, 1.4vw, 20px);
}
.kyg-page .wr-card {
  background: var(--c-cream);
  border: 1px solid var(--ink-line);
  border-radius: var(--r-sm);
  padding: clamp(18px, 1.8vw, 24px);
  display:flex;
  flex-direction:column;
  transition: transform .45s var(--e-out), box-shadow .45s var(--e-out), border-color .45s var(--e-out);
}
.kyg-page .wr-panel .wr-card:hover {
  transform: translateY(-3px);
  border-color: var(--t-accent-100);
  box-shadow: 0 12px 28px -12px rgba(45,32,18,.22);
}
.kyg-page .wr-card__head {
  display:flex; align-items:center; gap:12px;
  margin-bottom: 14px;
}
.kyg-page .wr-card__ico {
  flex:0 0 38px;
  width:38px; height:38px;
  border-radius: 11px;
  background: var(--t-accent-50);
  color: var(--t-accent-500);
  display:inline-flex; align-items:center; justify-content:center;
}
.wr-card__ico svg{ width:20px; height:20px; stroke-width:1.9; }
.kyg-page .wr-card__name {
  font-family: var(--ff);
  font-size: clamp(16px, 1.4vw, 19px);
  font-weight: 600;
  letter-spacing: -.01em;
  color: var(--ink-1);
  line-height: 1.1;
}
.kyg-page .wr-card__sub {
  font-size: 13.5px;
  line-height: 1.45;
  color: var(--ink-2);
  margin-bottom: 14px;
}
.kyg-page .wr-card__list {
  display:flex; flex-direction:column; gap: 9px;
  margin-top: auto;
}
.kyg-page .wr-card__list li {
  display:flex; align-items:flex-start; gap:10px;
  font-size: 13.5px;
  line-height: 1.4;
  color: var(--ink-1);
}
.kyg-page .wr-card__list .wr-check {
  flex:0 0 16px;
  width:16px; height:16px;
  color: var(--t-accent-500);
  margin-top: 1px;
}
.wr-card__list .wr-check svg{ width:16px; height:16px; stroke-width:2.6; }
.kyg-page .wr-card__tagline {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--t-accent-50);
  color: var(--t-accent-700);
  font-size: 13px;
  font-weight: 600;
  font-style: italic;
  line-height: 1.35;
}
/* Per-subcard accent so each maps to its own report theme */
.wr-card[data-sub="diet"]{    --t-accent-50: var(--t-wellness-50); --t-accent-100: var(--t-wellness-100); --t-accent-500: var(--t-wellness-500); --t-accent-700: var(--t-wellness-700); }
.wr-card[data-sub="weight"]{  --t-accent-50: var(--t-men-50);      --t-accent-100: var(--t-men-100);      --t-accent-500: var(--t-men-500);      --t-accent-700: var(--t-men-700); }
.wr-card[data-sub="fitness"]{ --t-accent-50: var(--t-roots-50);    --t-accent-100: var(--t-roots-100);    --t-accent-500: var(--t-roots-500);    --t-accent-700: var(--t-roots-700); }
.wr-card[data-sub="detox"]{   --t-accent-50: var(--t-matri-50);    --t-accent-100: var(--t-matri-100);    --t-accent-500: var(--t-matri-500);    --t-accent-700: var(--t-matri-700); }

/* Highlight callout */
.kyg-page .test-card__hl {
  margin-top: clamp(22px, 2.4vw, 30px);
  padding: 18px 22px;
  border-radius: var(--r-sm);
  background: var(--t-accent-50);
  border-left: 4px solid var(--t-accent-500);
}
.kyg-page .test-card__hl-lab {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--t-accent-700);
  display:block;
  margin-bottom: 6px;
}
.kyg-page .test-card__hl-text {
  font-size: clamp(15px, 1.15vw, 17px);
  font-weight: 600;
  color: var(--t-accent-700);
  line-height: 1.4;
  letter-spacing: -.005em;
}

/* Card footer */
.kyg-page .test-card__foot {
  position:relative;
  z-index:1;
  margin-top: auto;
  padding-top: clamp(20px, 2vw, 26px);
  border-top: 1px solid var(--ink-line);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.test-card__body{ padding-bottom: clamp(8px, 1.2vw, 16px); }
.kyg-page .test-card__pills {
  display:flex; flex-wrap:wrap; gap:8px;
}
.kyg-page .test-card__pill {
  display:inline-flex; align-items:center;
  padding: 7px 14px;
  border-radius: 999px;
  background: rgba(31,26,20,.04);
  border: 1px solid var(--ink-line);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink-3);
  letter-spacing: -.005em;
}
.kyg-page .test-card__cta {
  display:inline-flex; align-items:center; gap:10px; padding:13px 24px; border-radius:9999px; color:#fff; font-family:var(--ff); font-size:14.5px; font-weight:600; letter-spacing:-.005em; cursor:pointer; border:0;
  background: var(--t-accent-500);
  transition: background .35s var(--e-out), transform .5s var(--e-out), box-shadow .5s var(--e-out);
}
.kyg-page .test-card__cta:hover {
  background: var(--t-accent-700);
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(45,32,18,.18);
}
.kyg-page .test-card__cta svg {
  width: 14px; height: 14px;
  transition: transform .5s var(--e-out);
}
.test-card__cta:hover svg{ transform: translateX(3px); }

/* ===== Nav arrows + dots ===== */
.kyg-page .tests__nav {
  display:flex;
  align-items:center;
  gap: 10px;
}
.kyg-page .tests__arrow {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--ink-line);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--ink-1);
  cursor:pointer;
  transition: transform .35s var(--e-out),
              background .35s var(--e-out),
              border-color .35s var(--e-out),
              color .35s var(--e-out),
              box-shadow .35s var(--e-out);
  box-shadow: 0 2px 8px -2px rgba(45,32,18,.10);
}
.tests__arrow svg{ width: 16px; height: 16px; stroke-width: 2; }
.kyg-page .tests__arrow:hover:not(:disabled) {
  background: var(--ink-1);
  color: var(--c-cream);
  border-color: var(--ink-1);
  box-shadow: 0 10px 24px -8px rgba(31,26,20,.4);
}
.kyg-page .tests__arrow:disabled {
  opacity: .3;
  cursor: not-allowed;
}
.kyg-page .tests__dots {
  display:flex; align-items:center; justify-content:center; gap: 10px;
  margin-top: 20px;
}
.kyg-page .tests__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(31,26,20,.18);
  border: 0;
  cursor: pointer;
  padding: 0;
  transition: transform .35s var(--e-out), background .35s var(--e-out), width .35s var(--e-out);
}
.kyg-page .tests__dot.is-active {
  background: var(--ink-1);
  width: 28px;
  border-radius: 999px;
}
.kyg-page .tests__dot:hover:not(.is-active) {
  background: rgba(31,26,20,.4);
  transform: scale(1.2);
}

/* ===== Bundles ===== */
.kyg-page .tests__bundles-head {
  display:flex; align-items:center;
  gap: 18px;
  justify-content:center;
  margin-top: clamp(64px, 7vw, 96px);
  margin-bottom: clamp(30px, 3.4vw, 44px);
}
.kyg-page .tests__bundles-head-line {
  flex: 1;
  max-width: 90px;
  height: 1px;
  background: var(--ink-line);
}
.kyg-page .tests__bundles-head-text {
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.kyg-page .tests__bundles {
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.kyg-page .bundle-card {
  background: rgba(255,255,255,.7);
  border: 1.5px solid var(--ink-line);
  border-radius: var(--r-md);
  padding: 28px 28px 26px;
  transition: transform .55s var(--e-out),
              box-shadow .55s var(--e-out),
              background .35s var(--e-out),
              border-color .35s var(--e-out);
  display:flex; flex-direction:column;
  position:relative;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
}
.kyg-page .bundle-card:hover {
  transform: translateY(-6px);
  background: #fff;
  border-color: rgba(31,26,20,.16);
  box-shadow: 0 18px 44px rgba(45,32,18,.12);
}
.bundle-card[data-theme="couple"]{    --t-accent-500: var(--t-women-500);  --t-accent-700: var(--t-women-700); }
.bundle-card[data-theme="family"]{    --t-accent-500: var(--t-wellness-500);--t-accent-700: var(--t-wellness-700); }
.bundle-card[data-theme="complete"]{  --t-accent-500: var(--t-roots-500);   --t-accent-700: var(--t-roots-700); }

.kyg-page .bundle-card__head {
  display:flex; align-items:center; gap:12px;
  margin-bottom: 14px;
}
.kyg-page .bundle-card__ico {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(31,26,20,.04);
  display:inline-flex; align-items:center; justify-content:center;
  color: var(--t-accent-500);
}
.bundle-card__ico svg{ width: 20px; height: 20px; stroke-width: 1.8; }
.kyg-page .bundle-card__title {
  font-family: var(--ff);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -.012em;
  color: var(--ink-1);
}
.kyg-page .bundle-card__desc {
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--ink-3);
  margin-bottom: 22px;
  flex: 1;
}
.kyg-page .bundle-card__cta {
  display:inline-flex; align-items:center; gap:8px; font-family:var(--ff); font-size:14.5px; font-weight:600; letter-spacing:-.005em;
  color: var(--t-accent-500);
  transition: color .35s var(--e-out), gap .35s var(--e-out);
}
.kyg-page .bundle-card__cta svg {
  width: 14px; height: 14px;
  stroke-width: 2;
  transition: transform .45s var(--e-out);
}
.kyg-page .bundle-card:hover .bundle-card__cta {
  color: var(--t-accent-700);
  gap: 12px;
}
.kyg-page .bundle-card:hover .bundle-card__cta svg {
  transform: translateX(3px);
}

/* ===== Responsive ===== */
@media (max-width: 1180px){
  .tests__bundles{ grid-template-columns: repeat(3, 1fr); }
  .tests__split{ grid-template-columns: 1fr; gap: 28px; }
}
@media (max-width: 880px){
  .tests__bundles{ grid-template-columns: 1fr; }
  .test-card__foot{ flex-direction: column; align-items: flex-start; }
  .test-card__cta{ width: 100%; justify-content: center; }
  .wr-panel__foot{ flex-direction: column; align-items: flex-start; }
  .wr-panel__cta{ width: 100%; justify-content: center; }
}
@media (max-width: 560px){
  .test-card{ padding: 24px; }
  .test-card__title{ font-size: 24px; }
  .wr-panel{ padding: 24px; }
  .wr-panel__title{ font-size: 24px; }
  .tests__arrow{ width: 40px; height: 40px; }
  .wr-grid{ grid-template-columns: 1fr; }
}`;

// Polish layer - see scripts/polish-landing.py. Loaded last so it wins
// the cascade on ties (hero jitter fix, mobile menu, responsive gaps).
const KYG_POLISH_CSS = `/* =============================================================
   Polish pass - jitter fix, mobile menu overlay, responsive
   tightening for small screens. Loads AFTER KYG_PAGE_CSS and
   KYG_TESTS_CSS so these rules win the cascade on ties.
   ============================================================= */

/* ---------- Hero image jitter fix ---------- */
.kyg-page .hero__media {
  /* Isolate the media layer's painting so the parallaxed image
     does not invalidate adjacent sections every scroll tick. */
  contain: paint;
}
.kyg-page .hero__media-img {
  /* Force a dedicated compositor layer. backface-visibility is the
     long-standing trick; the translateZ baseline composes with the
     scroll-driven translate3d the JS writes on top. */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0) scale(1.04);
  /* Filter rasterisation can be expensive while transform changes;
     keep the look but pre-bake it as a one-shot rather than per-frame. */
  image-rendering: -webkit-optimize-contrast;
}

/* ---------- General responsive tightening ---------- */
@media (max-width: 1180px) {
  .kyg-page section.s {
    padding: clamp(48px, 6vw, 80px) 0;
  }
  .kyg-page .s-head {
    margin-bottom: clamp(40px, 5vw, 64px);
  }
  .kyg-page .tests__split {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 880px) {
  .kyg-page .hero {
    padding: 16px 0 56px;
  }
  .kyg-page .hero__inner {
    padding-top: 36px;
  }
  .kyg-page .hero__pill {
    font-size: 13.5px;
    padding: 10px 18px 10px 10px;
    margin-bottom: 24px;
  }
  .kyg-page .hero__h {
    font-size: clamp(36px, 9vw, 64px);
  }
  .kyg-page .hero__sub {
    font-size: 16px;
    margin-top: 20px;
  }
  .kyg-page .hero__cta .btn {
    flex: 1 1 calc(50% - 7px);
    min-width: 160px;
    justify-content: center;
  }
  .kyg-page .trust__track {
    gap: 48px;
  }
  .kyg-page .trust__item {
    font-size: 16px;
  }
  .kyg-page .tests__bundles {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .kyg-page .wr-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 560px) {
  .kyg-page {
    --gutter: 18px;
  }
  .kyg-page .container {
    padding: 0 var(--gutter);
  }
  .kyg-page section.s {
    padding: 56px 0;
  }
  .kyg-page .nav__inner {
    height: 64px;
  }
  .kyg-page .nav__logo svg {
    height: 30px;
  }
  .kyg-page .hero__cta {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .kyg-page .hero__cta .btn {
    width: 100%;
  }
  .kyg-page .h1 {
    font-size: clamp(28px, 8vw, 42px);
  }
  .kyg-page .h2 {
    font-size: clamp(24px, 7vw, 36px);
  }
  .kyg-page .lead {
    font-size: 16px;
  }
  .kyg-page .eyebrow {
    font-size: 14px;
    gap: 10px;
  }
  .kyg-page .wr-panel {
    padding: 24px;
  }
  .kyg-page .wr-panel__title {
    font-size: 26px;
  }
  .kyg-page .test-card {
    padding: 24px;
  }
  .kyg-page .test-card__title {
    font-size: 24px;
  }
  .kyg-page .bundle-card {
    padding: 22px;
  }
}

@media (max-width: 380px) {
  .kyg-page .hero__h {
    font-size: 32px;
    line-height: 1.04;
  }
  .kyg-page .hero__pill span:not(.hero__pill-dot) {
    font-size: 12.5px;
  }
  .kyg-page .btn {
    padding: 13px 22px;
    font-size: 14px;
  }
}

/* Respect reduced-motion preferences - disable parallax animations. */
@media (prefers-reduced-motion: reduce) {
  .kyg-page,
  .kyg-page *,
  .kyg-page *::before,
  .kyg-page *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .kyg-page .hero__media-img {
    transform: scale(1.04) !important;
  }
}

/* =================================================================
   Hard responsive overrides - addresses the bugs visible in the
   mobile screenshots:
     - what-section floating cards overflow the right viewport edge
       because .what__float-name had white-space: nowrap forcing the
       2-col grid wider than the viewport.
     - report__float used right:-18px which spilled out of an
       overflow:visible parent and triggered horizontal scroll.
     - finalcta photo frames are 18–21vw with absolute positioning
       and clip past viewport on phones.
     - belt-and-braces overflow lock on html/body/.kyg-page so nothing
       can ever introduce horizontal scroll.
   ================================================================= */
html,
body {
  overflow-x: hidden;
  max-width: 100vw;
}
.kyg-page {
  overflow-x: clip;
  max-width: 100vw;
}

@media (max-width: 880px) {
  /* What section - let card labels wrap; shrink iconography. */
  .kyg-page .what__stage {
    width: 100%;
    max-width: 100%;
  }
  .kyg-page .what__floats {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
    width: 100% !important;
  }
  .kyg-page .what__float {
    position: static !important;
    animation: none !important;
    width: 100% !important;
    min-width: 0 !important;
    padding: 12px 14px 12px 12px !important;
    gap: 10px !important;
  }
  .kyg-page .what__float-name {
    white-space: normal !important;
    font-size: 14px !important;
    line-height: 1.2 !important;
  }
  .kyg-page .what__float-ico {
    width: 40px !important;
    height: 40px !important;
    border-radius: 12px !important;
  }
  .kyg-page .what__float-ico svg {
    width: 20px !important;
    height: 20px !important;
  }
  .kyg-page .what__body {
    height: 380px !important;
    margin: 0 auto;
  }

  /* Report - float card was overflowing right edge. Tuck it inside. */
  .kyg-page .report__mock {
    padding: 28px !important;
    margin-right: 0 !important;
  }
  .kyg-page .report__float {
    right: 8px !important;
    bottom: -12px !important;
    max-width: calc(100% - 16px) !important;
  }

  /* Final CTA - photo frames overflowed on phones. Anchor inside. */
  .kyg-page .finalcta__floats {
    display: none !important;
  }

  /* Trust marquee - items were too dense on small screens. */
  .kyg-page .trust {
    padding: 36px 0 32px;
  }
  .kyg-page .trust__track {
    gap: 36px;
  }
  .kyg-page .trust__item {
    font-size: 15px;
  }
  .kyg-page .trust__item svg {
    width: 22px;
    height: 22px;
  }

  /* Why section - quote box padding on tight viewports. */
  .kyg-page .why__qs {
    padding: 24px 22px !important;
  }
  .kyg-page .why__visual {
    min-height: 380px !important;
  }
  .kyg-page .why__visual-inner {
    padding: 24px !important;
  }

  /* Care + Movement break sections - no horizontal margin on mobile
     so the rounded panels sit flush, full-bleed. */
  .kyg-page .care,
  .kyg-page .movement {
    margin: 0 !important;
    border-radius: 0 !important;
  }
  .kyg-page .care__inner,
  .kyg-page .movement__inner {
    padding: 48px var(--gutter) !important;
  }
  .kyg-page .care__items,
  .kyg-page .care__pills {
    grid-template-columns: 1fr !important;
  }

  /* Senior section pills + Movement list to single column. */
  .kyg-page .senior__pills {
    grid-template-columns: 1fr !important;
  }
  .kyg-page .movement__list {
    grid-template-columns: 1fr 1fr !important;
  }

  /* Decoded cards - stack 1 column. */
  .kyg-page .decoded__grid {
    grid-template-columns: 1fr !important;
  }

  /* Privacy items single column. */
  .kyg-page .privacy__items {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 560px) {
  /* What section - collapse to single column when 2 cols still feel cramped. */
  .kyg-page .what__floats {
    grid-template-columns: 1fr !important;
  }
  .kyg-page .what__body {
    height: 320px !important;
  }

  /* Movement list to 1 column. */
  .kyg-page .movement__list {
    grid-template-columns: 1fr !important;
  }

  /* Report mock + float - float becomes inline below the mock. */
  .kyg-page .report__float {
    position: static !important;
    margin-top: 14px !important;
    max-width: 100% !important;
    right: auto !important;
    bottom: auto !important;
  }
  .kyg-page .report__mock {
    padding: 22px !important;
  }
  .kyg-page .report__doc {
    padding: 22px !important;
  }

  /* Care item rows - tighten. */
  .kyg-page .care__item {
    padding: 12px 14px;
    font-size: 13.5px;
  }
  .kyg-page .care__hl {
    padding: 16px 20px;
    font-size: 17px;
  }

  /* Senior pills full-width. */
  .kyg-page .senior__pill {
    padding: 14px 16px;
  }

  /* How-it-works steps row → vertical list. */
  .kyg-page .steps {
    grid-template-columns: 1fr !important;
    overflow-x: visible !important;
    gap: 16px !important;
  }
  .kyg-page .step {
    flex-direction: row !important;
    align-items: center !important;
    gap: 16px !important;
  }
  .kyg-page .step__circle {
    margin-bottom: 0 !important;
    width: 64px !important;
    height: 64px !important;
    flex-shrink: 0;
  }
  .kyg-page .step__circle svg {
    width: 26px !important;
    height: 26px !important;
  }
}

@media (max-width: 420px) {
  /* Movement list 1 column on very small screens. */
  .kyg-page .movement__list {
    grid-template-columns: 1fr !important;
    gap: 18px !important;
  }
  .kyg-page .movement__hl {
    font-size: 28px !important;
  }
  /* Footer columns stack - already 1fr at 720px but ensure padding. */
  .kyg-page .footer__inner,
  .kyg-page .footer__grid {
    padding: 0 !important;
  }
}

/* =================================================================
   Modifier classes that replace the inline gridColumn:span 2
   styles. JSX used to set style={{gridColumn:'span 2'}} which is an
   inline style - that beats stylesheet rules without !important,
   so when the parent grid collapsed to 1fr on mobile the spanning
   item kept asking for "span 2" and the layout broke (right column
   stayed visible at 425px, viewer saw a 2-col grid instead of 1).
   Class-based approach lets the cascade work normally.
   ================================================================= */
.kyg-page .report__feat--wide,
.kyg-page .privacy__item--wide {
  grid-column: span 2;
}
@media (max-width: 880px) {
  .kyg-page .report__feat--wide,
  .kyg-page .privacy__item--wide {
    grid-column: auto;
  }
}

/* Belt-and-braces: at small viewports force every report/privacy
   feature card to one column row, even if some future contributor
   re-adds inline gridColumn styles. The [style] attribute selector
   plus !important wins against inline styles per the CSS cascade. */
@media (max-width: 720px) {
  .kyg-page .report__feats,
  .kyg-page .privacy__items {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  .kyg-page .report__feats > *,
  .kyg-page .privacy__items > * {
    grid-column: auto !important;
  }
  .kyg-page .report__feat,
  .kyg-page .privacy__item {
    padding: 14px 16px !important;
  }
  .kyg-page .report__feat-text,
  .kyg-page .privacy__item {
    font-size: 14px !important;
    line-height: 1.4 !important;
  }
}

/* =================================================================
   Footer 2×2 nav layout on mobile.
   The footer__grid is a single grid containing the brand block plus
   two .footer__nav-col wrappers (each holds two link lists). On
   desktop those wrappers use display:contents so their children
   participate directly in the 5-column grid (brand + 4 lists). On
   mobile the wrappers become flex columns so each side flows as a
   continuous vertical stack - no grid-row alignment gap when the
   two halves have different item counts. That was the bug from
   the 320px screenshot: Wellness Package had 5 items, Care had 4,
   so the right column showed empty space before COMPANY appeared.
   ================================================================= */
.kyg-page .footer__nav-col {
  display: contents;
}
@media (max-width: 880px) {
  .kyg-page .footer__grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 32px 24px !important;
  }
  .kyg-page .footer__brand {
    grid-column: 1 / -1;
    max-width: none;
  }
  .kyg-page .footer__nav-col {
    display: flex;
    flex-direction: column;
    gap: 28px;
    min-width: 0;
  }
  .kyg-page .footer__col-title {
    font-size: 12px;
  }
  .kyg-page .footer__list a {
    font-size: 14px;
  }
}

@media (max-width: 420px) {
  /* Keep the two side-by-side stacks at the smallest viewports. */
  .kyg-page .footer__grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 28px 16px !important;
  }
  .kyg-page .footer__brand {
    grid-column: 1 / -1;
  }
  .kyg-page .footer__nav-col {
    gap: 24px;
  }
}

/* =================================================================
   ≤ 360 px (iPhone SE 1st-gen / Galaxy Fold portrait).
   Footer titles "WELLNESS PACKAGE" / "PRIVACY & TRUST" were wrapping
   because the 12px font + 0.22em letter-spacing exceeded the ~134px
   half-column width. Shrink type, tighten gutter, reduce letter-
   spacing, and pad the subscribe input so nothing overflows.
   ================================================================= */
@media (max-width: 360px) {
  .kyg-page {
    --gutter: 14px;
  }
  /* Footer micro-typography. */
  .kyg-page .footer__grid {
    gap: 22px 12px !important;
  }
  .kyg-page .footer__col-title {
    font-size: 10.5px !important;
    letter-spacing: 0.14em !important;
    margin-bottom: 14px !important;
  }
  .kyg-page .footer__list a {
    font-size: 13px !important;
  }
  .kyg-page .footer__list li + li {
    margin-top: 8px;
  }
  /* Brand logo SVG: constrain by explicit height so the wide viewBox
     (729 x 318) cannot blow up width. Using max-width alone wasn't enough
     because inline SVGs without explicit dimensions can render at viewBox
     size when only max-width is set. */
  .kyg-page .footer__logo {
    margin-bottom: 16px !important;
  }
  .kyg-page .footer__logo svg {
    height: 36px !important;
    width: auto !important;
    max-width: 160px;
  }
  .kyg-page .footer__tag {
    font-size: 13.5px;
    line-height: 1.55;
    margin-bottom: 18px !important;
  }
  .kyg-page .footer__brand {
    max-width: 100% !important;
  }
  /* Footer outer padding tightened at narrow viewports. */
  .kyg-page .footer {
    padding-top: 56px !important;
    padding-bottom: 28px !important;
  }
  .kyg-page .footer__bottom {
    padding-top: 24px !important;
    margin-top: 32px !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 12px !important;
  }
  /* Newsletter form: keep input and button in same row but compact. */
  .kyg-page .footer__newsletter {
    flex-wrap: nowrap;
  }
  .kyg-page .footer__newsletter input {
    min-width: 0;
    flex: 1 1 0;
    padding: 12px 14px;
    font-size: 13px;
  }
  .kyg-page .footer__newsletter button {
    padding: 10px 16px;
    font-size: 13px;
    flex-shrink: 0;
  }

  /* Nav: shrink the logo and pad less so Order Kit + burger fit. */
  .kyg-page .nav__logo svg {
    height: 26px !important;
  }
  .kyg-page .nav__cta .btn {
    padding: 9px 14px !important;
    font-size: 12.5px !important;
  }
  .kyg-page .nav__burger {
    width: 38px !important;
    height: 38px !important;
  }
  .kyg-page .nav__inner {
    gap: 8px !important;
  }

  /* Hero: prevent giant headline from forcing horizontal scroll. */
  .kyg-page .hero__h {
    font-size: 30px !important;
  }
  .kyg-page .hero__pill {
    font-size: 12px !important;
    padding: 9px 14px 9px 9px !important;
  }
  .kyg-page .hero__pill-dot {
    width: 26px !important;
    height: 26px !important;
    font-size: 12px !important;
  }
  .kyg-page .hero__sub {
    font-size: 15px;
  }

  /* Tests carousel: tighter card padding. */
  .kyg-page .test-card,
  .kyg-page .wr-panel,
  .kyg-page .bundle-card {
    padding: 20px !important;
  }
  .kyg-page .wr-panel__title,
  .kyg-page .test-card__title {
    font-size: 22px !important;
  }

  /* Trust marquee: smaller items. */
  .kyg-page .trust__item {
    font-size: 13px;
  }
  .kyg-page .trust__item svg {
    width: 18px;
    height: 18px;
  }

  /* Generic typography clamp so nothing overflows. */
  .kyg-page .h1 {
    font-size: clamp(24px, 7.6vw, 34px);
  }
  .kyg-page .h2 {
    font-size: clamp(22px, 7vw, 30px);
  }
}

/* =================================================================
   <=320px (iPhone 5/SE 1st-gen portrait, Galaxy Fold cover screen).
   Final tightening for the smallest realistic viewport. Targeted at
   the footer (the previously visible bug) plus a few other spots
   where 340-360px sizing is still too generous.
   ================================================================= */
@media (max-width: 320px) {
  .kyg-page {
    --gutter: 12px;
  }

  /* Footer brand: even smaller logo, tighter spacing. */
  .kyg-page .footer__logo {
    margin-bottom: 14px !important;
  }
  .kyg-page .footer__logo svg {
    height: 30px !important;
    width: auto !important;
    max-width: 140px;
  }
  .kyg-page .footer__tag {
    font-size: 13px !important;
    margin-bottom: 16px !important;
  }
  .kyg-page .footer__newsletter {
    padding: 3px !important;
  }
  .kyg-page .footer__newsletter input {
    padding: 10px 12px !important;
    font-size: 12.5px !important;
  }
  .kyg-page .footer__newsletter button {
    padding: 9px 14px !important;
    font-size: 12.5px !important;
  }

  /* Footer outer chrome: tighter on the smallest screens. */
  .kyg-page .footer {
    padding-top: 48px !important;
    padding-bottom: 24px !important;
  }
  .kyg-page .footer__grid {
    gap: 22px 10px !important;
    margin-bottom: 36px !important;
  }
  .kyg-page .footer__col-title {
    font-size: 10px !important;
    letter-spacing: 0.12em !important;
    margin-bottom: 12px !important;
  }
  .kyg-page .footer__list a {
    font-size: 12.5px !important;
  }
  .kyg-page .footer__list li + li {
    margin-top: 6px !important;
  }

  /* Brandline footer text at very small widths. */
  .kyg-page .footer__brandline {
    font-size: clamp(28px, 12vw, 44px) !important;
    line-height: 1 !important;
  }
  .kyg-page .footer__bottom {
    font-size: 11.5px !important;
  }

  /* Nav: even more compact so OrderKit + burger never overflow. */
  .kyg-page .nav__logo svg {
    height: 22px !important;
  }
  .kyg-page .nav__inner {
    height: 60px !important;
    gap: 6px !important;
  }

  /* Hero: clamp headline harder and reduce vertical padding. */
  .kyg-page .hero {
    padding-bottom: 56px !important;
  }
  .kyg-page .hero__h {
    font-size: 26px !important;
    line-height: 1 !important;
  }

  /* Sections: compact vertical padding. */
  .kyg-page section.s,
  .kyg-page section {
    padding-top: 36px !important;
    padding-bottom: 36px !important;
  }
}
`;

export default function HomePage() {
  useEffect(() => {
    (function () {
      // ===== Reveal on scroll =====
      const reveals = document.querySelectorAll('.reveal, .reveal-r');
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
              }
            });
          },
          { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
        );
        reveals.forEach((el) => io.observe(el));
      } else {
        reveals.forEach((el) => el.classList.add('is-in'));
      }

      // ===== Parallax (rAF, transform translate3d, clamped to keep images inside rounded frames) =====
      const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('.parallax'));
      const ctaParallaxEls = Array.from(document.querySelectorAll<HTMLElement>('.parallax-cta'));
      const heroImg = document.getElementById('heroImg');
      let ticking = false;

      function applyParallax() {
        const sy = window.scrollY;
        const winH = window.innerHeight;
        parallaxEls.forEach((el) => {
          const parent = el.parentElement;
          if (!parent) return;
          const rect = parent.getBoundingClientRect();
          if (rect.bottom > -200 && rect.top < winH + 200) {
            // Progress: -1 (entering bottom) → 0 (centered) → +1 (leaving top)
            const center = rect.top + rect.height / 2;
            const progress = (center - winH / 2) / ((winH + rect.height) / 2);
            const clamped = Math.max(-1, Math.min(1, progress));
            // ±48px range - clearly visible movement, sits inside the 12% buffer
            const speed = parseFloat(el.dataset.speed ?? '') || 0.14;
            const offset = -clamped * (48 + speed * 100);
            el.style.transform = `translate3d(0, ${Math.round(offset)}px, 0)`;
          }
        });
        // CTA floating photos: drift upward as user scrolls toward footer, with 3D tilt preserved
        ctaParallaxEls.forEach((el) => {
          const section = el.closest('.finalcta');
          if (!section) return;
          const rect = section.getBoundingClientRect();
          if (rect.bottom > -300 && rect.top < winH + 300) {
            const center = rect.top + rect.height / 2;
            const progress = (center - winH / 2) / ((winH + rect.height) / 2);
            const clamped = Math.max(-1, Math.min(1, progress));
            const speed = parseFloat(el.dataset.ctaSpeed ?? '') || 0.12;
            const offset = -clamped * (80 + speed * 200);
            const tilt = getComputedStyle(el).getPropertyValue('--tilt').trim() || '';
            el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) ${tilt}`;
          }
        });
        if (heroImg) {
          // Hero gets the strongest effect, capped at 180px
          const o = Math.min(sy * 0.32, 180);
          // Whole-pixel rounding stops the sub-pixel jitter the compositor
          // produces when transform values change by fractional amounts
          // every scroll tick on high-refresh displays.
          heroImg.style.transform = `translate3d(0, ${Math.round(o)}px, 0) scale(1.04)`;
        }
        ticking = false;
      }
      function onParallaxScroll() {
        if (!ticking) {
          window.requestAnimationFrame(applyParallax);
          ticking = true;
        }
      }
      window.addEventListener('scroll', onParallaxScroll, { passive: true });
      window.addEventListener('resize', applyParallax);
      applyParallax();

      // ===== Cursor-follow 3D tilt on the Trust shield =====
      const shield = document.querySelector<HTMLElement>('.privacy__shield');
      if (shield) {
        let raf: number | null = null;
        let rxTarget = 0,
          ryTarget = 0;
        let rxCurrent = 0,
          ryCurrent = 0;
        const MAX_TILT = 14; // degrees

        const animate = () => {
          // Eased follow for buttery motion
          rxCurrent += (rxTarget - rxCurrent) * 0.12;
          ryCurrent += (ryTarget - ryCurrent) * 0.12;
          shield.style.setProperty('--rx', rxCurrent.toFixed(2) + 'deg');
          shield.style.setProperty('--ry', ryCurrent.toFixed(2) + 'deg');
          if (Math.abs(rxTarget - rxCurrent) > 0.01 || Math.abs(ryTarget - ryCurrent) > 0.01) {
            raf = requestAnimationFrame(animate);
          } else {
            raf = null;
          }
        };

        // Listen on whole window so it follows from anywhere on the page (subtle effect)
        window.addEventListener(
          'mousemove',
          (e) => {
            const rect = shield.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (window.innerWidth / 2);
            const dy = (e.clientY - cy) / (window.innerHeight / 2);
            // Clamp + nonlinearity for natural feel
            const nx = Math.max(-1, Math.min(1, dx));
            const ny = Math.max(-1, Math.min(1, dy));
            ryTarget = nx * MAX_TILT;
            rxTarget = -ny * MAX_TILT;
            if (!raf) raf = requestAnimationFrame(animate);
          },
          { passive: true }
        );

        // Stronger response on direct hover
        shield.addEventListener('mouseenter', () => {
          shield.style.transition = 'none';
        });
        shield.addEventListener('mouseleave', () => {
          rxTarget = 0;
          ryTarget = 0;
          if (!raf) raf = requestAnimationFrame(animate);
        });
      }

      // ===== Smooth scroll for in-page anchors =====
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
          const id = link.getAttribute('href');
          if (id && id.length > 1) {
            const target = document.querySelector(id);
            if (target) {
              e.preventDefault();
              const offset = 80;
              const top = target.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }
        });
      });

      // ===== Package carousel (right column) =====
      const testsTrack = document.getElementById('testsTrack');
      if (testsTrack) {
        const cards = Array.from(testsTrack.querySelectorAll<HTMLElement>('.test-card'));
        const dots = Array.from(document.querySelectorAll<HTMLElement>('.tests__dot'));
        const prevBtn = document.getElementById('testsPrev') as HTMLButtonElement | null;
        const nextBtn = document.getElementById('testsNext') as HTMLButtonElement | null;
        let currentIndex = 0;
        let isProgrammatic = false;
        let scrollTimer: number | undefined;

        const scrollToCard = (index: number) => {
          const card = cards[index];
          if (!card) return;
          isProgrammatic = true;
          testsTrack.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
          window.setTimeout(() => {
            isProgrammatic = false;
          }, 600);
        };

        const setActive = (index: number) => {
          currentIndex = Math.max(0, Math.min(cards.length - 1, index));
          cards.forEach((c, i) => c.classList.toggle('is-current', i === currentIndex));
          dots.forEach((d, i) => {
            const on = i === currentIndex;
            d.classList.toggle('is-active', on);
            d.setAttribute('aria-selected', on ? 'true' : 'false');
          });
          if (prevBtn) prevBtn.disabled = currentIndex === 0;
          if (nextBtn) nextBtn.disabled = currentIndex === cards.length - 1;
        };

        const goTo = (index: number) => {
          setActive(index);
          scrollToCard(currentIndex);
        };

        // Detect closest card to viewport centre on free scroll (touch/trackpad)
        const findClosestCardIndex = () => {
          const trackRect = testsTrack.getBoundingClientRect();
          const centerX = trackRect.left + trackRect.width / 2;
          let closest = 0;
          let minDist = Infinity;
          cards.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const d = Math.abs(cx - centerX);
            if (d < minDist) {
              minDist = d;
              closest = i;
            }
          });
          return closest;
        };

        testsTrack.addEventListener(
          'scroll',
          () => {
            if (isProgrammatic) return;
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(() => {
              const idx = findClosestCardIndex();
              if (idx !== currentIndex) setActive(idx);
            }, 90);
          },
          { passive: true }
        );

        dots.forEach((dot) => {
          dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index ?? '', 10)));
        });
        if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

        // Keyboard navigation when slider in focus
        testsTrack.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(currentIndex + 1);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goTo(currentIndex - 1);
          }
        });
        testsTrack.setAttribute('tabindex', '0');

        const equalizeHeights = () => {
          cards.forEach((c) => {
            c.style.minHeight = '';
          });
          // Defer to next frame so natural heights are measured first
          window.requestAnimationFrame(() => {
            let max = 0;
            cards.forEach((c) => {
              max = Math.max(max, c.scrollHeight);
            });
            cards.forEach((c) => {
              c.style.minHeight = max + 'px';
            });
          });
        };

        setActive(0);
        equalizeHeights();
        // Re-equalize once fonts/images settle
        window.setTimeout(equalizeHeights, 300);
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(equalizeHeights);
        }

        // Re-align current card on resize
        let resizeTimer: number | undefined;
        window.addEventListener('resize', () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => {
            equalizeHeights();
            isProgrammatic = true;
            testsTrack.scrollLeft = cards[currentIndex] ? cards[currentIndex].offsetLeft : 0;
            window.setTimeout(() => {
              isProgrammatic = false;
            }, 200);
          }, 120);
        });
      }
    })();
  }, []);

  return (
    <div className="kyg-page">
      {/* Scoped CSS: see KYG_PAGE_CSS constant above. dangerouslySetInnerHTML so React treats it as static and does not re-process on each render. */}
      <style dangerouslySetInnerHTML={{ __html: KYG_PAGE_CSS }} />
      <style dangerouslySetInnerHTML={{ __html: KYG_TESTS_CSS }} />
      <style dangerouslySetInnerHTML={{ __html: KYG_POLISH_CSS }} />

      {/* ============================================================
     HERO - Full-width photographic with editorial overlay
     ============================================================ */}
      <section className="hero">
        <div className="hero__media">
          <img
            className="hero__media-img"
            id="heroImg"
            src="/kyg/950448a92b6b.jpg"
            alt="An Indian family at home, a father and son share a moment at a laptop while the mother and daughter cook together in the kitchen"
          />
          <div className="hero__media-veil"></div>
          <div className="hero__media-grain"></div>
        </div>

        <div className="container container--wide">
          <div className="hero__inner">
            <div className="hero__copy reveal">
              <div className="hero__pill">
                <span className="hero__pill-dot">✦</span>
                <span>India's first wellness-led DNA experience</span>
              </div>
              <h1 className="hero__h">
                Your body already carries
                <em>
                  <span className="grad-text">clues about your future.</span>
                </em>
              </h1>
              <p className="hero__sub">
                Understand your body better through personalized wellness and genetic insights designed for modern
                India.
              </p>
              {/* CTA-HIDDEN: hero CTAs */}
              {false && (
                <div className="hero__cta">
                  <a href="#wellness" className="btn btn--primary">
                    Start your wellness journey
                    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <a href="#care" className="btn btn--ghost">
                    Talk to GENEous Care
                  </a>
                </div>
              )}{' '}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     TRUST MARQUEE
     ============================================================ */}
      <section className="trust" aria-label="Why people trust KYG">
        <div className="trust__label">
          <span className="trust__label-dot"></span>
          <span>Trusted by India's wellness seekers</span>
        </div>
        <div className="trust__track" id="trustTrack">
          {/* Duplicated content for seamless marquee */}
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4M12 22a10 10 0 110-20 10 10 0 010 20z" />
            </svg>{' '}
            Saliva-Based DNA Wellness Test
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
            </svg>{' '}
            Personalized Wellness Insights
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>{' '}
            4 Comprehensive Wellness Reports
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>{' '}
            GENEous Care Counseling
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>{' '}
            Trusted Certified Labs
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>{' '}
            Built for Indian Biology
          </div>
          <span className="trust__item-dot"></span>
          {/* duplicate */}
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4M12 22a10 10 0 110-20 10 10 0 010 20z" />
            </svg>{' '}
            Saliva-Based DNA Wellness Test
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
            </svg>{' '}
            Personalized Wellness Insights
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>{' '}
            4 Comprehensive Wellness Reports
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>{' '}
            GENEous Care Counseling
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>{' '}
            Trusted Certified Labs
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>{' '}
            Built for Indian Biology
          </div>
          <span className="trust__item-dot"></span>
        </div>
      </section>

      {/* ============================================================
     WHY KYG EXISTS
     ============================================================ */}
      <section className="s why" id="why">
        <div className="container container--wide">
          <div className="why__grid">
            <div className="why__left reveal">
              <div className="eyebrow">Why KYG exists</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Most people know their Aadhaar number better than their <span className="grad-text">health risks.</span>
              </h2>

              <p className="lead" style={{ marginTop: '28px', maxWidth: '540px' } as React.CSSProperties}>
                You track:
              </p>
              <div className="why__track">
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1v22M5 5h11a4 4 0 010 8H8a4 4 0 000 8h12" />
                  </svg>{' '}
                  your money
                </div>
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h4l3-9 4 18 3-9h4" />
                  </svg>{' '}
                  your calories
                </div>
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19V6l11-3v13" />
                    <circle cx="6" cy="19" r="3" />
                    <circle cx="17" cy="16" r="3" />
                  </svg>{' '}
                  your steps
                </div>
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>{' '}
                  your sleep
                </div>
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 17l6-6 4 4 8-8" />
                    <path d="M14 7h7v7" />
                  </svg>{' '}
                  your investments
                </div>
              </div>

              <p
                style={
                  {
                    fontSize: '19px',
                    fontWeight: '600',
                    color: 'var(--ink-1)',
                    marginBottom: '10px',
                  } as React.CSSProperties
                }
              >
                But do you really understand your own body?
              </p>

              <div className="why__qs">
                <div className="why__qs-lab">Questions worth asking</div>
                <p>Why does the same diet work differently for different people?</p>
                <p>Why do some people recover faster?</p>
                <p>Why do certain health conditions run in families?</p>
                <p>Why do some foods suit one person but not another?</p>
              </div>

              <div className="why__because">Because every body is different.</div>

              <p
                style={
                  {
                    marginTop: '24px',
                    fontSize: '16.5px',
                    lineHeight: '1.65',
                    color: 'var(--ink-2)',
                    maxWidth: '560px',
                  } as React.CSSProperties
                }
              >
                KYG helps you understand your body better through personalized wellness intelligence powered by
                genetics, lifestyle science, and expert guidance.
              </p>
            </div>

            <div className="why__visual reveal-r" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <img
                className="why__visual-img parallax"
                data-speed="0.15"
                src="https://images.unsplash.com/photo-1604881991720-f91add269bed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="A thoughtful Indian woman in warm natural light"
              />
              <div className="why__visual-veil"></div>
              <div className="why__visual-inner">
                <div className="why__visual-num">
                  1<span>in</span>1
                </div>
                <p className="why__visual-cap">
                  There is no one else with your exact genetic blueprint. That's the point. And the opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     WHAT IS KYG  · body silhouette surrounded by floating cards
     ============================================================ */}
      <section className="s what" id="what">
        <div className="container container--wide">
          <div className="s-head reveal">
            <div className="eyebrow">What is KYG?</div>
            <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
              Think of it as your body's <span className="grad-text">instruction manual.</span>
            </h2>
            <p className="lead" style={{ marginTop: '24px', maxWidth: '640px' } as React.CSSProperties}>
              KYG combines genetic insights with wellness intelligence to help you understand how your body naturally
              responds.
            </p>
          </div>

          <div className="what__stage reveal" style={{ '--rd': '.15s' } as React.CSSProperties}>
            <div className="what__body">
              <img
                className="what__body-img"
                src="/kyg/c347b61299d8.png"
                alt="Wireframe human body figure showing the genetic data points across the body"
              />
            </div>

            <div className="what__floats">
              <div className="what__float what__float--1">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6c0-1.7 1.3-3 3-3h12c1.7 0 3 1.3 3 3 0 1.7-1.3 3-3 3H6c-1.7 0-3-1.3-3-3zM5 9l1.5 12h11L19 9" />
                  </svg>
                </div>
                <div className="what__float-name">Nutrition</div>
              </div>
              <div className="what__float what__float--2">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6.5 6.5l11 11" />
                    <rect x="14" y="2" width="6" height="6" rx="1" />
                    <rect x="4" y="16" width="6" height="6" rx="1" />
                  </svg>
                </div>
                <div className="what__float-name">Fitness</div>
              </div>
              <div className="what__float what__float--3">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <div className="what__float-name">Lifestyle</div>
              </div>
              <div className="what__float what__float--4">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <div className="what__float-name">Metabolism</div>
              </div>
              <div className="what__float what__float--5">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L4 7v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V7l-8-5z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div className="what__float-name">Preventive Care</div>
              </div>
              <div className="what__float what__float--6">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h4l3-9 4 18 3-9h4" />
                  </svg>
                </div>
                <div className="what__float-name">Recovery</div>
              </div>
            </div>
          </div>

          <div className="what__tag-wrap reveal" style={{ '--rd': '.3s' } as React.CSSProperties}>
            <div className="what__tag">
              <span className="what__tag-dot">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              Health Without Guesswork.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     WELLNESS PACKAGE - image-first cards, hover reveals details
     ============================================================ */}
      <section className="s s--peach" id="wellness">
        <div className="container container--wide">
          <div className="s-head reveal">
            <div className="eyebrow">The Wellness Package</div>
            <h2 className="h1">
              One test. <span className="grad-text">4 personalized</span> wellness reports.
            </h2>
            <p className="lead" style={{ marginTop: '18px', maxWidth: '680px' } as React.CSSProperties}>
              Your Wellness Package is designed to help you move beyond generic health advice and understand what
              actually works for your body.
            </p>
          </div>

          <div className="pkg__cards">
            <article className="pkg-card reveal" style={{ '--rd': '0s' } as React.CSSProperties}>
              <img
                className="pkg-card__img"
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A vibrant healthy bowl of fresh produce"
                loading="lazy"
              />
              <div className="pkg-card__veil"></div>
              <div className="pkg-card__num">Report 01</div>
              <div className="pkg-card__corner">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pkg-card__body">
                <h3 className="pkg-card__title">My Diet</h3>
                <p className="pkg-card__sub">Nutrition insights personalized for your body.</p>
                <div className="pkg-card__reveal">
                  <ul className="pkg-card__list">
                    <li>Vitamin &amp; micronutrient tendencies</li>
                    <li>Food sensitivities</li>
                    <li>Macro nutrient response</li>
                    <li>Gluten &amp; lactose response</li>
                    <li>Salt &amp; caffeine sensitivity</li>
                  </ul>
                  <p className="pkg-card__quote">Same diet. Different bodies.</p>
                </div>
              </div>
            </article>

            <article className="pkg-card reveal" style={{ '--rd': '.08s' } as React.CSSProperties}>
              <img
                className="pkg-card__img"
                src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A person walking outdoors at golden hour"
                loading="lazy"
              />
              <div className="pkg-card__veil"></div>
              <div className="pkg-card__num">Report 02</div>
              <div className="pkg-card__corner">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pkg-card__body">
                <h3 className="pkg-card__title">My Weight</h3>
                <p className="pkg-card__sub">Understand your metabolism and weight-related tendencies.</p>
                <div className="pkg-card__reveal">
                  <ul className="pkg-card__list">
                    <li>Weight management response</li>
                    <li>Fat storage tendencies</li>
                    <li>Eating behavior patterns</li>
                    <li>Sweet cravings &amp; satiety</li>
                    <li>Lipid profile tendencies</li>
                  </ul>
                  <p className="pkg-card__quote">Move beyond generic weight-loss advice.</p>
                </div>
              </div>
            </article>

            <article className="pkg-card reveal" style={{ '--rd': '.16s' } as React.CSSProperties}>
              <img
                className="pkg-card__img"
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A person doing yoga at sunrise"
                loading="lazy"
              />
              <div className="pkg-card__veil"></div>
              <div className="pkg-card__num">Report 03</div>
              <div className="pkg-card__corner">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pkg-card__body">
                <h3 className="pkg-card__title">My Fitness</h3>
                <p className="pkg-card__sub">Train smarter with insights into your body's fitness response.</p>
                <div className="pkg-card__reveal">
                  <ul className="pkg-card__list">
                    <li>Exercise response</li>
                    <li>Strength &amp; endurance tendencies</li>
                    <li>Recovery response</li>
                    <li>Injury risk insights</li>
                    <li>Aerobic &amp; anaerobic capacity</li>
                  </ul>
                  <p className="pkg-card__quote">Not every body responds the same way.</p>
                </div>
              </div>
            </article>

            <article className="pkg-card reveal" style={{ '--rd': '.24s' } as React.CSSProperties}>
              <img
                className="pkg-card__img"
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Soft water and natural calm"
                loading="lazy"
              />
              <div className="pkg-card__veil"></div>
              <div className="pkg-card__num">Report 04</div>
              <div className="pkg-card__corner">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pkg-card__body">
                <h3 className="pkg-card__title">My Detox</h3>
                <p className="pkg-card__sub">Understand how your body responds to stress and detoxification.</p>
                <div className="pkg-card__reveal">
                  <ul className="pkg-card__list">
                    <li>Oxidative stress response</li>
                    <li>Detoxification pathways</li>
                    <li>Water-soluble toxin response</li>
                    <li>Fat-soluble toxin response</li>
                    <li>Lifestyle detox support insights</li>
                  </ul>
                  <p className="pkg-card__quote">Recovery and detox matter too.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================
     OUR TESTS - product slider section
     ============================================================ */}
      <section className="s tests" id="tests">
        <div className="container container--wide">
          <div className="s-head s-head--center reveal">
            <div className="eyebrow">Our Tests</div>
            <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
              Which one <span className="grad-text">is you?</span>
            </h2>
            <p className="lead" style={{ marginTop: '24px' } as React.CSSProperties}>
              Five ways to know yourself better. All from a simple saliva kit.
            </p>
          </div>

          {/* Two-column split: Wellness panel (left) · package carousel (right) */}
          <div className="tests__split">
            {/* ============ LEFT: My Wellness Report (standalone) ============ */}
            <div className="tests__left reveal" style={{ '--rd': '.05s' } as React.CSSProperties}>
              <article className="wr-panel" data-theme="wellness">
                <div className="wr-panel__head">
                  <span className="wr-panel__tag">Most Popular · Wellness</span>
                  <h3 className="wr-panel__title">My Wellness Report</h3>
                  <p className="wr-panel__desc">
                    Your body has been operating on guesswork. Diet, weight, fitness, detox - all decoded from your
                    unique DNA. One saliva kit, four life-changing answers.
                  </p>
                </div>
                <div className="wr-panel__body">
                  <div className="wr-panel__sub-lab">What's Included - 4 Reports</div>
                  <div className="wr-grid">
                    {/* Sub-card: My Diet DNA */}
                    <div className="wr-card" data-sub="diet">
                      <div className="wr-card__head">
                        <span className="wr-card__ico">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 11h18M5 11a7 7 0 0 1 14 0M5 11v1a7 7 0 0 0 14 0v-1M12 4V2" />
                          </svg>
                        </span>
                        <span className="wr-card__name">My Diet DNA</span>
                      </div>
                      <p className="wr-card__sub">Nutrition insights personalised for your body.</p>
                      <ul className="wr-card__list">
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Vitamin & micronutrient tendencies
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Macro nutrient response
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Food sensitivities
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Gluten & lactose response
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Salt & caffeine sensitivity
                        </li>
                      </ul>
                      <p className="wr-card__tagline">Same diet. Different bodies.</p>
                    </div>

                    {/* Sub-card: My Weight DNA */}
                    <div className="wr-card" data-sub="weight">
                      <div className="wr-card__head">
                        <span className="wr-card__ico">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 3v3M5.5 7h13M7 7l-2.5 8a4 4 0 0 0 8 0L10 7M14 7l2.5 8a4 4 0 0 0 8 0L22 7" />
                          </svg>
                        </span>
                        <span className="wr-card__name">My Weight DNA</span>
                      </div>
                      <p className="wr-card__sub">Understand your metabolism and weight-related tendencies.</p>
                      <ul className="wr-card__list">
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Weight management response
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Fat storage tendencies
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Eating behaviour patterns
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Sweet cravings & satiety response
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Lipid profile tendencies
                        </li>
                      </ul>
                      <p className="wr-card__tagline">Your diet didn't fail. Your plan did.</p>
                    </div>

                    {/* Sub-card: My Fitness DNA */}
                    <div className="wr-card" data-sub="fitness">
                      <div className="wr-card__head">
                        <span className="wr-card__ico">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="13" cy="4" r="1.6" />
                            <path d="M11 8l-2 4 3 2 1 6M9 12l-3 1M13 14l3 3M11 8l4-1 3 3" />
                          </svg>
                        </span>
                        <span className="wr-card__name">My Fitness DNA</span>
                      </div>
                      <p className="wr-card__sub">Train smarter - based on how you're built.</p>
                      <ul className="wr-card__list">
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Response to exercise
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Power vs endurance profile
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Aerobic & anaerobic capacity
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Injury risk & recovery speed
                        </li>
                      </ul>
                      <p className="wr-card__tagline">Sprinter or marathon runner? Your genes know.</p>
                    </div>

                    {/* Sub-card: My Detox DNA */}
                    <div className="wr-card" data-sub="detox">
                      <div className="wr-card__head">
                        <span className="wr-card__ico">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2.7s6 6.3 6 10.3a6 6 0 0 1-12 0c0-4 6-10.3 6-10.3z" />
                          </svg>
                        </span>
                        <span className="wr-card__name">My Detox DNA</span>
                      </div>
                      <p className="wr-card__sub">How well does your body clean itself out?</p>
                      <ul className="wr-card__list">
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Fat soluble toxin clearance
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Water soluble toxin clearance
                        </li>
                        <li>
                          <span className="wr-check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Oxidative stress response
                        </li>
                      </ul>
                      <p className="wr-card__tagline">Your body + Delhi's air. Know your risk.</p>
                    </div>
                  </div>
                </div>
                <div className="wr-panel__foot">
                  <div className="wr-panel__pills">
                    <span className="wr-panel__pill">Saliva kit</span>
                    <span className="wr-panel__pill">No needles</span>
                    <span className="wr-panel__pill">NABL labs</span>
                    <span className="wr-panel__pill">WhatsApp counselling</span>
                  </div>
                  {/* CTA-HIDDEN: Wellness panel CTA */}
                  {false && (
                    <a href="#" className="wr-panel__cta">
                      Get your kit
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}{' '}
                </div>
              </article>
            </div>

            {/* ============ RIGHT: package carousel ============ */}
            <div className="tests__right reveal" style={{ '--rd': '.12s' } as React.CSSProperties}>
              <div className="tests__right-head">
                <span className="tests__right-lab">More ways to know yourself</span>
                <div className="tests__nav">
                  <button className="tests__arrow" id="testsPrev" type="button" aria-label="Previous test" disabled>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="tests__arrow" id="testsNext" type="button" aria-label="Next test">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="tests__track-wrap">
                <div
                  className="tests__track"
                  id="testsTrack"
                  role="region"
                  aria-label="Test cards"
                  aria-roledescription="carousel"
                >
                  {/* Card - Know Your Roots */}
                  <article className="test-card is-current" data-theme="roots" data-index="0">
                    <div className="test-card__head">
                      <span className="test-card__tag">Ancestry</span>
                      <h3 className="test-card__title">Know Your Roots - Ancestors In Me</h3>
                      <p className="test-card__desc">
                        Where did you really come from? Your DNA carries the story of everyone who came before you -
                        across continents, across centuries.
                      </p>
                    </div>
                    <div className="test-card__body">
                      <div className="test-card__sub-lab">What's Included</div>
                      <ul className="test-card__list">
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Percentage breakdown of your ethnic origins
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          South Asian, Southeast Asian, Central Asian heritage mapping
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Links to West Caucasian, East African, Armenian, Amerindian populations
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          42,000+ SNP genotyping via Illumina iScan
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Your personal Gene Journey narrative report
                        </li>
                      </ul>
                      <div className="test-card__hl">
                        <span className="test-card__hl-lab">Highlight</span>
                        <span className="test-card__hl-text">KYC done. Ab apni asli identity jaano.</span>
                      </div>
                    </div>
                    <div className="test-card__foot">
                      <div className="test-card__pills">
                        <span className="test-card__pill">Perfect NRI gift</span>
                        <span className="test-card__pill">Family heritage</span>
                        <span className="test-card__pill">Curiosity buy</span>
                      </div>
                      {/* CTA-HIDDEN: test card CTA */}
                      {false && (
                        <a href="#" className="test-card__cta">
                          Get your kit
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}{' '}
                    </div>
                  </article>

                  {/* Card - Women's Health */}
                  <article className="test-card" data-theme="women" data-index="1">
                    <div className="test-card__head">
                      <span className="test-card__tag">Women's Health</span>
                      <h3 className="test-card__title">Know Your Future - She</h3>
                      <p className="test-card__desc">
                        Know your risk before it becomes your reality. Five conditions that matter most to Indian women
                        - decoded from your DNA.
                      </p>
                    </div>
                    <div className="test-card__body">
                      <div className="test-card__sub-lab">What's Included</div>
                      <ul className="test-card__list">
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Polycystic Ovary Syndrome (PCOS) risk
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Pregnancy loss & abnormal reproductive function risk
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Peripartum (post-pregnancy) depression risk
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Osteoporosis & bone density risk
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Rheumatoid arthritis predisposition
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Personalised lifestyle & nutrition recommendations
                        </li>
                      </ul>
                      <div className="test-card__hl">
                        <span className="test-card__hl-lab">Highlight</span>
                        <span className="test-card__hl-text">
                          1 in 5 Indian women has PCOS. Most don't know why. You can.
                        </span>
                      </div>
                    </div>
                    <div className="test-card__foot">
                      <div className="test-card__pills">
                        <span className="test-card__pill">Pre-conception</span>
                        <span className="test-card__pill">Young couples</span>
                        <span className="test-card__pill">Women 25–45</span>
                      </div>
                      {/* CTA-HIDDEN: test card CTA */}
                      {false && (
                        <a href="#" className="test-card__cta">
                          Get your kit
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}{' '}
                    </div>
                  </article>

                  {/* Card - Men's Health */}
                  <article className="test-card" data-theme="men" data-index="2">
                    <div className="test-card__head">
                      <span className="test-card__tag">Men's Health</span>
                      <h3 className="test-card__title">Know Your Future - He</h3>
                      <p className="test-card__desc">
                        Men rarely get tested until something goes wrong. Know your genetic risks early - so you never
                        have to be caught off guard.
                      </p>
                    </div>
                    <div className="test-card__body">
                      <div className="test-card__sub-lab">What's Included</div>
                      <ul className="test-card__list">
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Pituitary-testicular endocrine function risk
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Male fertility & reproductive function risk (azoospermia)
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Spot baldness risk (Alopecia Areata)
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Good / Average / Poor risk grading per condition
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Personalised diet & lifestyle recommendations
                        </li>
                      </ul>
                      <div className="test-card__hl">
                        <span className="test-card__hl-lab">Highlight</span>
                        <span className="test-card__hl-text">
                          Male infertility affects 1 in 8 couples. Know your side of the story.
                        </span>
                      </div>
                    </div>
                    <div className="test-card__foot">
                      <div className="test-card__pills">
                        <span className="test-card__pill">Pre-marriage</span>
                        <span className="test-card__pill">Couples planning</span>
                        <span className="test-card__pill">Men 25–45</span>
                      </div>
                      {/* CTA-HIDDEN: test card CTA */}
                      {false && (
                        <a href="#" className="test-card__cta">
                          Get your kit
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}{' '}
                    </div>
                  </article>

                  {/* Card - Pre-Matrimonial */}
                  <article className="test-card" data-theme="matri" data-index="3">
                    <div className="test-card__head">
                      <span className="test-card__tag">Pre-Matrimonial</span>
                      <h3 className="test-card__title">Know Before You Begin</h3>
                      <p className="test-card__desc">
                        You checked the kundali. You met the family. Now know what your genes say - before you begin
                        life together.
                      </p>
                    </div>
                    <div className="test-card__body">
                      <div className="test-card__sub-lab">What's Included - For Both Partners</div>
                      <ul className="test-card__list">
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Full Women's Health Report (PCOS, pregnancy, osteoporosis, RA, depression)
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Full Men's Health Report (fertility, hormones, alopecia)
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Carrier screening insights for hereditary conditions
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Joint genetic counselling session via WhatsApp
                        </li>
                        <li>
                          <span className="test-card__check">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          Two at-home saliva kits - one for each partner
                        </li>
                      </ul>
                      <div className="test-card__hl">
                        <span className="test-card__hl-lab">Highlight</span>
                        <span className="test-card__hl-text">Rishta pakka karne se pehle - genes milao.</span>
                      </div>
                    </div>
                    <div className="test-card__foot">
                      <div className="test-card__pills">
                        <span className="test-card__pill">For couples</span>
                        <span className="test-card__pill">Pre-wedding</span>
                        <span className="test-card__pill">Family planning</span>
                      </div>
                      {/* CTA-HIDDEN: test card CTA */}
                      {false && (
                        <a href="#" className="test-card__cta">
                          Get your kits
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}{' '}
                    </div>
                  </article>
                </div>
              </div>

              {/* Dots */}
              <div className="tests__dots" role="tablist" aria-label="Test navigation">
                <button
                  className="tests__dot is-active"
                  type="button"
                  data-index="0"
                  aria-label="Go to slide 1"
                ></button>
                <button className="tests__dot" type="button" data-index="1" aria-label="Go to slide 2"></button>
                <button className="tests__dot" type="button" data-index="2" aria-label="Go to slide 3"></button>
                <button className="tests__dot" type="button" data-index="3" aria-label="Go to slide 4"></button>
              </div>
            </div>
          </div>

          {/* Bundles */}
          <div className="tests__bundles-head reveal" style={{ '--rd': '.05s' } as React.CSSProperties}>
            <span className="tests__bundles-head-line"></span>
            <span className="tests__bundles-head-text">Or Bundle & Save</span>
            <span className="tests__bundles-head-line"></span>
          </div>

          <div className="tests__bundles reveal" style={{ '--rd': '.1s' } as React.CSSProperties}>
            <a href="#" className="bundle-card" data-theme="couple">
              <div className="bundle-card__head">
                <div className="bundle-card__ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h4 className="bundle-card__title">Couple's Blueprint</h4>
              </div>
              <p className="bundle-card__desc">Wellness + Women's Health + Men's Health</p>
              {/* CTA-HIDDEN: bundle card CTA */}
              {false && (
                <span className="bundle-card__cta">
                  View bundle
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              )}{' '}
            </a>

            <a href="#" className="bundle-card" data-theme="family">
              <div className="bundle-card__head">
                <div className="bundle-card__ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="20" r="2" />
                    <circle cx="19" cy="20" r="2" />
                    <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6" />
                  </svg>
                </div>
                <h4 className="bundle-card__title">Family Starter</h4>
              </div>
              <p className="bundle-card__desc">Women's Health + Men's Health + Ancestry</p>
              {/* CTA-HIDDEN: bundle card CTA */}
              {false && (
                <span className="bundle-card__cta">
                  View bundle
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              )}{' '}
            </a>

            <a href="#" className="bundle-card" data-theme="complete">
              <div className="bundle-card__head">
                <div className="bundle-card__ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <h4 className="bundle-card__title">The Complete You</h4>
              </div>
              <p className="bundle-card__desc">All 5 reports. The most complete picture of you.</p>
              {/* CTA-HIDDEN: bundle card CTA */}
              {false && (
                <span className="bundle-card__cta">
                  View bundle
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              )}{' '}
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
     REPORT PREVIEW
     ============================================================ */}
      <section className="s report" id="report">
        <div className="container container--wide">
          <div className="report__grid">
            <div className="report__mock reveal">
              <div
                style={
                  { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' } as React.CSSProperties
                }
              >
                <span
                  style={
                    {
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#E07258',
                      opacity: '.65',
                    } as React.CSSProperties
                  }
                ></span>
                <span
                  style={
                    {
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#E8B14E',
                      opacity: '.65',
                    } as React.CSSProperties
                  }
                ></span>
                <span
                  style={
                    {
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#6BB87B',
                      opacity: '.65',
                    } as React.CSSProperties
                  }
                ></span>
                <span
                  style={
                    {
                      marginLeft: 'auto',
                      fontSize: '11px',
                      letterSpacing: '.18em',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      color: 'var(--ink-3)',
                    } as React.CSSProperties
                  }
                >
                  your-report · kyg
                </span>
              </div>

              <div className="report__doc">
                <div className="report__doc-head">
                  <div>
                    <div className="report__doc-lab">Report · My Diet</div>
                    <div className="report__doc-title">Nutrition &amp; Sensitivity Profile</div>
                  </div>
                  <div className="report__doc-mark">KYG</div>
                </div>

                <div className="report__metric">
                  <div className="report__metric-name">Vitamin D response</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '36%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-1">Below avg</div>
                </div>
                <div className="report__metric">
                  <div className="report__metric-name">Caffeine metabolism</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '78%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-2">Fast</div>
                </div>
                <div className="report__metric">
                  <div className="report__metric-name">Lactose tolerance</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '62%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-3">Typical</div>
                </div>
                <div className="report__metric">
                  <div className="report__metric-name">Salt sensitivity</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '84%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-2">Elevated</div>
                </div>
                <div className="report__metric">
                  <div className="report__metric-name">Omega-3 response</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '58%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-4">Balanced</div>
                </div>

                <div className="report__doc-foot">
                  <span>27 markers analyzed</span>
                  <span>Reviewed by GENEous Care</span>
                </div>
              </div>

              <div className="report__float">
                <div className="report__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div className="report__float-text">
                  <b>Plain English</b>
                  Every result, explained.
                </div>
              </div>
            </div>

            <div className="reveal" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <div className="eyebrow">Your Report</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Personalized insights, <span className="grad-text">backed by science.</span>
              </h2>
              <p className="lead" style={{ marginTop: '24px' } as React.CSSProperties}>
                Your report is designed to simplify complex genetic science into practical wellness understanding.
              </p>
              <p
                style={
                  {
                    marginTop: '18px',
                    color: 'var(--ink-2)',
                    fontSize: '16px',
                    lineHeight: '1.6',
                  } as React.CSSProperties
                }
              >
                Each insight includes your genetic response, simplified interpretation, wellness implications, food
                recommendations, lifestyle guidance, and actionable next steps.
              </p>

              <div className="report__feats">
                <div className="report__feat">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    </svg>
                  </div>
                  <div className="report__feat-text">Easy-to-understand summaries</div>
                </div>
                <div className="report__feat">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>
                  <div className="report__feat-text">Color-coded wellness indicators</div>
                </div>
                <div className="report__feat">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                  <div className="report__feat-text">Personalized recommendations</div>
                </div>
                <div className="report__feat">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="report__feat-text">Lifestyle-focused interpretation</div>
                </div>
                <div className="report__feat report__feat--wide">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="report__feat-text">
                    Wellness-oriented guidance. Not clinical jargon, not generic advice.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     GENEous CARE (dark warm break)
     ============================================================ */}
      <section className="s" style={{ paddingTop: '0' } as React.CSSProperties}>
        <div className="care s--dark">
          <div className="care__inner">
            <div className="care__grid">
              <div className="reveal">
                <div className="eyebrow eyebrow--light">GENEous Care</div>
                <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                  Because reports alone are <span className="grad-text">not enough.</span>
                </h2>
                <p className="lead" style={{ marginTop: '24px', maxWidth: '540px' } as React.CSSProperties}>
                  Most people receive health reports and don't know what to do next.
                </p>
                <p className="lead" style={{ marginTop: '14px', maxWidth: '540px' } as React.CSSProperties}>
                  That's where GENEous Care comes in. KYG combines genetic intelligence with human guidance to help you:
                </p>
                <div className="care__items">
                  <div className="care__item">
                    <span className="care__item-num">01</span>
                    understand your wellness report
                  </div>
                  <div className="care__item">
                    <span className="care__item-num">02</span>
                    reduce confusion
                  </div>
                  <div className="care__item">
                    <span className="care__item-num">03</span>
                    make informed lifestyle decisions
                  </div>
                  <div className="care__item">
                    <span className="care__item-num">04</span>
                    take meaningful next steps
                  </div>
                </div>
                <div className="care__pills-lab">What's included</div>
                <div className="care__pills">
                  <span className="care__pill">Pre-Test Guidance</span>
                  <span className="care__pill">Post-Test Counseling</span>
                  <span className="care__pill">Lifestyle Discussions</span>
                  <span className="care__pill">Wellness Guidance</span>
                  <span className="care__pill">Personalized Support</span>
                </div>
                <div className="care__hl">Human understanding meets genetic intelligence.</div>
                {/* CTA-HIDDEN: Care section CTA */}
                {false && (
                  <div style={{ marginTop: '36px' } as React.CSSProperties}>
                    <a href="#" className="btn btn--accent">
                      Book a free consultation
                      <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                )}{' '}
              </div>

              <div className="care__visual reveal-r" style={{ '--rd': '.15s' } as React.CSSProperties}>
                <div className="care__visual-tag">Available 7 days a week</div>
                <img
                  className="parallax"
                  data-speed="0.12"
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="A GENEous Care counselor in a warm, supportive conversation"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     HOW IT WORKS
     ============================================================ */}
      <section className="s how" id="how">
        <div className="container container--wide">
          <div className="how__head reveal">
            <div className="how__head-text">
              <div className="eyebrow">How It Works</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Simple. Private. <span className="grad-text">Personalized.</span>
              </h2>
            </div>
            <div className="how__head-r">
              <p>Five gentle steps from kit-in-box to actionable insight, supported by humans, not just algorithms.</p>
            </div>
          </div>

          <div className="steps">
            <div className="step reveal" style={{ '--rd': '0s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8h22l-2 18a3 3 0 01-3 3H10a3 3 0 01-3-3L5 8z" />
                  <path d="M11 8V5a5 5 0 0110 0v3" />
                  <path d="M14 16h4M16 14v4" />
                </svg>
                <span className="step__num">1</span>
              </div>
              <div className="step__title">Order Your Wellness Package</div>
              <div className="step__desc">Choose your personalized wellness journey.</div>
            </div>

            <div className="step reveal" style={{ '--rd': '.08s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4h8v22a3 3 0 01-3 3h-2a3 3 0 01-3-3V4z" />
                  <path d="M14 10h4M13 16h6" />
                  <circle cx="16" cy="22" r="2" fill="currentColor" opacity=".3" stroke="none" />
                </svg>
                <span className="step__num">2</span>
              </div>
              <div className="step__title">Collect Your Saliva Sample</div>
              <div className="step__desc">Simple, non-invasive, and convenient.</div>
            </div>

            <div className="step reveal" style={{ '--rd': '.16s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 6 Q16 14 22 6" />
                  <path d="M10 16 Q16 24 22 16" />
                  <path d="M10 26 Q16 18 22 26" />
                  <line x1="13" y1="9" x2="13" y2="13" />
                  <line x1="19" y1="9" x2="19" y2="13" />
                  <line x1="13" y1="19" x2="13" y2="23" />
                  <line x1="19" y1="19" x2="19" y2="23" />
                </svg>
                <span className="step__num">3</span>
              </div>
              <div className="step__title">Advanced Genetic Analysis</div>
              <div className="step__desc">Processed through trusted certified genomics laboratory partners.</div>
            </div>

            <div className="step reveal" style={{ '--rd': '.24s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="7" y="4" width="18" height="24" rx="2" />
                  <line x1="11" y1="11" x2="21" y2="11" />
                  <line x1="11" y1="16" x2="21" y2="16" />
                  <line x1="11" y1="21" x2="17" y2="21" />
                  <circle cx="22" cy="23" r="3" fill="currentColor" opacity=".25" stroke="none" />
                </svg>
                <span className="step__num">4</span>
              </div>
              <div className="step__title">Receive Personalized Reports</div>
              <div className="step__desc">Easy-to-understand wellness insights designed for real-life application.</div>
            </div>

            <div className="step reveal" style={{ '--rd': '.32s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M27 18a3 3 0 01-3 3H10l-5 5V8a3 3 0 013-3h18a3 3 0 013 3z" />
                  <line x1="11" y1="11" x2="21" y2="11" />
                  <line x1="11" y1="15" x2="17" y2="15" />
                </svg>
                <span className="step__num">5</span>
              </div>
              <div className="step__title">Talk to a GENEous Care Expert</div>
              <div className="step__desc">
                Understand what your results actually mean for your lifestyle and wellness goals.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     WHO IS THIS FOR
     ============================================================ */}
      <section className="s who" id="who">
        <div className="container container--wide">
          <div className="who__grid">
            <div className="who__visual reveal">
              <img
                className="parallax"
                data-speed="0.14"
                src="/kyg/4c2cb66bab2c.jpg"
                alt="A focused Indian tennis player on court, representing the active KYG community"
              />
            </div>

            <div className="reveal" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <div className="eyebrow">Who Is This For?</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Built for people who want <span className="grad-text">smarter wellness decisions.</span>
              </h2>
              <p
                style={
                  {
                    marginTop: '24px',
                    fontSize: '17px',
                    color: 'var(--ink-2)',
                    lineHeight: '1.6',
                    maxWidth: '560px',
                  } as React.CSSProperties
                }
              >
                KYG fits into the lives of people who care about understanding their bodies, not just managing them.
              </p>

              <div className="who__chips">
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h4l3-9 4 18 3-9h4" />
                  </svg>
                  Fitness-conscious individuals
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                  </svg>
                  Wellness seekers
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                  Busy professionals
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Preventive healthcare adopters
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 14s1 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                  </svg>
                  Struggling with generic diets
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 11a4 4 0 018 0" />
                    <path d="M9 16h6" />
                  </svg>
                  Curious about personalized wellness
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Adults focused on long-term health
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  Families prioritizing preventive care
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     KYG SENIOR CARE
     ============================================================ */}
      <section className="s senior" id="senior">
        <div className="container container--wide">
          <div className="senior__grid">
            <div className="reveal">
              <div className="eyebrow">KYG Senior Care</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Your parents deserve <span className="grad-text">informed healthcare too.</span>
              </h2>
              <p className="lead" style={{ marginTop: '24px', maxWidth: '540px' } as React.CSSProperties}>
                As India enters an era of rising lifestyle diseases and chronic health conditions, preventive wellness
                for parents becomes more important than ever.
              </p>
              <p
                style={
                  {
                    fontSize: '11.5px',
                    letterSpacing: '.22em',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    color: 'var(--c-teal)',
                    marginTop: '36px',
                  } as React.CSSProperties
                }
              >
                KYG Senior Care focuses on:
              </p>
              <div className="senior__pills">
                <div className="senior__pill">
                  <div className="senior__pill-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                  <div className="senior__pill-text">Healthy aging &amp; wellness understanding</div>
                </div>
                <div className="senior__pill">
                  <div className="senior__pill-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="6" width="16" height="14" rx="2" />
                      <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                      <path d="M12 11v6M9 14h6" />
                    </svg>
                  </div>
                  <div className="senior__pill-text">Medication compatibility awareness</div>
                </div>
                <div className="senior__pill">
                  <div className="senior__pill-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12h4l3-9 4 18 3-9h4" />
                    </svg>
                  </div>
                  <div className="senior__pill-text">Cardiac &amp; diabetes-related insights</div>
                </div>
                <div className="senior__pill">
                  <div className="senior__pill-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <div className="senior__pill-text">Preventive health literacy</div>
                </div>
              </div>
              <div className="senior__hl">
                Better understanding. Better care. <span className="grad-text">Better aging.</span>
              </div>
              {/* CTA-HIDDEN: Senior section CTA */}
              {false && (
                <div style={{ marginTop: '32px' } as React.CSSProperties}>
                  <a href="#" className="btn btn--ghost">
                    Explore Senior Care
                    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              )}{' '}
            </div>

            <div className="senior__visual reveal-r" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <img
                className="parallax"
                data-speed="0.14"
                src="/kyg/a42282e02776.jpg"
                alt="A senior Indian couple reading documents together at home"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     HEALTH DECODED - image-dominant article cards with hover reveal
     ============================================================ */}
      <section className="s decoded" id="decoded">
        <div className="container container--wide">
          <div className="s-head reveal">
            <div className="eyebrow">Health Decoded</div>
            <h2 className="h1">
              Breaking everyday <span className="grad-text">wellness myths.</span>
            </h2>
            <p className="lead" style={{ marginTop: '18px', maxWidth: '680px' } as React.CSSProperties}>
              Bite-sized, science-grounded reads that help you make sense of what works, and what doesn't, for your
              body.
            </p>
          </div>

          <div className="decoded__grid">
            <article className="dcard reveal" style={{ '--rd': '0s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A bowl of fresh, colorful food"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Nutrition</div>
                <h3 className="dcard__title">Why your diet may not be working</h3>
                <p className="dcard__desc">The "perfect" diet is the one that fits your biology. Not someone else's.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard reveal" style={{ '--rd': '.08s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Two different healthy meals"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Food &amp; Body</div>
                <h3 className="dcard__title">Why some foods suit some people better</h3>
                <p className="dcard__desc">Sensitivities, tolerances, and metabolism vary genetically. Here's why.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard reveal" style={{ '--rd': '.16s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Person stretching outdoors"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Fitness</div>
                <h3 className="dcard__title">Why two people respond differently to exercise</h3>
                <p className="dcard__desc">From muscle response to recovery. Your genes write a different program.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard reveal" style={{ '--rd': '.24s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A calm scene of water"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Recovery</div>
                <h3 className="dcard__title">Why recovery differs from person to person</h3>
                <p className="dcard__desc">Some bodies bounce back overnight. Others need a different rhythm.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard reveal" style={{ '--rd': '.32s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Generic wellness advice"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Wellness</div>
                <h3 className="dcard__title">Why generic wellness advice fails many people</h3>
                <p className="dcard__desc">When the rules are written for "everyone", nobody really benefits.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard dcard--cta reveal" style={{ '--rd': '.40s' } as React.CSSProperties}>
              <div className="dcard__body">
                <div className="dcard__tag">Explore more</div>
                <h3 className="dcard__title">Health Decoded is a growing library.</h3>
                <p className="dcard__desc">
                  New articles every week, written for real people in real life. Subscribe and never miss a beat.
                </p>
                <a className="dcard__link" href="#">
                  Explore Health Decoded
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================
     TRUST & PRIVACY
     ============================================================ */}
      <section className="s privacy" id="privacy">
        <div className="container container--wide">
          <div className="privacy__grid">
            <div className="reveal">
              <div className="eyebrow">Trust &amp; Privacy</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Your data <span className="grad-text">stays yours.</span>
              </h2>
              <p className="lead" style={{ marginTop: '24px', maxWidth: '540px' } as React.CSSProperties}>
                We understand that health and genetic information is deeply personal.
              </p>
              <p
                style={
                  {
                    marginTop: '14px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: 'var(--ink-2)',
                    maxWidth: '540px',
                  } as React.CSSProperties
                }
              >
                That's why KYG focuses on privacy-focused systems, secure data handling, trusted certified lab
                partnerships, and confidential wellness reporting.
              </p>

              <div className="privacy__items">
                <div className="privacy__item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Trusted Certified Lab Partners
                </div>
                <div className="privacy__item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Secure Data Handling
                </div>
                <div className="privacy__item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Privacy-Focused Systems
                </div>
                <div className="privacy__item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Scientific &amp; Expert-Backed
                </div>
                <div className="privacy__item privacy__item--wide">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8" />
                  </svg>
                  Confidential Wellness Reports, only shared with you
                </div>
              </div>
            </div>

            <div className="privacy__shield reveal-r" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <svg
                viewBox="0 0 280 320"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '82%', height: '82%', position: 'relative', zIndex: '1' } as React.CSSProperties}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="shieldBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0E4D4B" />
                    <stop offset="100%" stopColor="#1A2220" />
                  </linearGradient>
                  <linearGradient id="shieldLight" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
                    <stop offset="55%" stopColor="#fff" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="shieldGlow" cx="50%" cy="55%" r="55%">
                    <stop offset="0%" stopColor="#25B5AB" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#25B5AB" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Outer halo glow */}
                <circle cx="140" cy="170" r="140" fill="url(#shieldGlow)" />

                {/* Back depth layer */}
                <path
                  d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                  fill="#15605D"
                  opacity="0.35"
                  transform="translate(4,5)"
                />

                {/* Main shield */}
                <path
                  d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                  fill="url(#shieldBody)"
                />

                {/* Top-light overlay for 3D feel */}
                <path
                  d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                  fill="url(#shieldLight)"
                />

                {/* Inner border outline */}
                <path
                  d="M 140 42 L 226 70 L 224 168 C 224 220 188 264 140 286 C 92 264 56 220 56 168 L 58 70 Z"
                  fill="none"
                  stroke="rgba(248,228,204,0.15)"
                  strokeWidth="1.5"
                />

                {/* Big elegant check mark */}
                <path
                  d="M 92 162 L 128 198 L 196 130"
                  fill="none"
                  stroke="#FAF6EF"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Subtle corner accent dots */}
                <circle cx="82" cy="86" r="2.5" fill="#25B5AB" opacity="0.7" />
                <circle cx="198" cy="86" r="2.5" fill="#F3D5B2" opacity="0.7" />
                <circle cx="60" cy="178" r="2" fill="#F3D5B2" opacity="0.5" />
                <circle cx="220" cy="178" r="2" fill="#25B5AB" opacity="0.55" />
                <circle cx="100" cy="246" r="1.8" fill="#25B5AB" opacity="0.45" />
                <circle cx="180" cy="246" r="1.8" fill="#F3D5B2" opacity="0.45" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     THE MOVEMENT (dark warm break)
     ============================================================ */}
      <section className="s" style={{ paddingBottom: '0' } as React.CSSProperties}>
        <div className="movement s--dark">
          <div className="movement__bgfx" aria-hidden="true"></div>
          <div className="movement__waves" aria-hidden="true">
            <svg viewBox="0 0 1200 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mvWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#25B5AB" stopOpacity="0" />
                  <stop offset="50%" stopColor="#25B5AB" stopOpacity="1" />
                  <stop offset="100%" stopColor="#25B5AB" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="mvWave2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F3D5B2" stopOpacity="0" />
                  <stop offset="50%" stopColor="#F3D5B2" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F3D5B2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path stroke="url(#mvWave1)" strokeWidth="1.4" fill="none">
                <animate
                  attributeName="d"
                  values="M 0 120 Q 300 60 600 120 T 1200 120;M 0 150 Q 300 90 600 150 T 1200 150;M 0 100 Q 300 40 600 100 T 1200 100;M 0 120 Q 300 60 600 120 T 1200 120"
                  dur="16s"
                  repeatCount="indefinite"
                />
              </path>
              <path stroke="url(#mvWave2)" strokeWidth="1.2" fill="none" opacity="0.7">
                <animate
                  attributeName="d"
                  values="M 0 240 Q 300 200 600 260 T 1200 240;M 0 260 Q 300 220 600 280 T 1200 260;M 0 220 Q 300 180 600 240 T 1200 220;M 0 240 Q 300 200 600 260 T 1200 240"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </path>
              <path stroke="url(#mvWave1)" strokeWidth="1" fill="none" opacity="0.6">
                <animate
                  attributeName="d"
                  values="M 0 380 Q 300 320 600 380 T 1200 380;M 0 400 Q 300 340 600 400 T 1200 400;M 0 360 Q 300 300 600 360 T 1200 360;M 0 380 Q 300 320 600 380 T 1200 380"
                  dur="18s"
                  repeatCount="indefinite"
                />
              </path>
              <path stroke="url(#mvWave2)" strokeWidth="0.9" fill="none" opacity="0.55">
                <animate
                  attributeName="d"
                  values="M 0 60 Q 400 20 800 60 T 1200 60;M 0 80 Q 400 40 800 80 T 1200 80;M 0 40 Q 400 0 800 40 T 1200 40;M 0 60 Q 400 20 800 60 T 1200 60"
                  dur="22s"
                  repeatCount="indefinite"
                />
              </path>
              <path stroke="url(#mvWave1)" strokeWidth="1" fill="none" opacity="0.5">
                <animate
                  attributeName="d"
                  values="M 0 440 Q 400 400 800 460 T 1200 440;M 0 460 Q 400 420 800 480 T 1200 460;M 0 420 Q 400 380 800 440 T 1200 420;M 0 440 Q 400 400 800 460 T 1200 440"
                  dur="24s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
          <div className="movement__inner">
            <div className="reveal">
              <div className="eyebrow eyebrow--light">The Movement</div>
              <h2 className="h1" style={{ marginTop: '22px', maxWidth: '680px' } as React.CSSProperties}>
                India's preventive wellness movement <span className="grad-text">starts here.</span>
              </h2>
              <p className="lead" style={{ marginTop: '24px', maxWidth: '640px' } as React.CSSProperties}>
                KYG is more than a wellness test. It's a movement toward:
              </p>
            </div>

            <div className="movement__list">
              <div className="movement__item reveal" style={{ '--rd': '0s' } as React.CSSProperties}>
                <div className="movement__item-num">01</div>
                <div className="movement__item-text">Smarter wellness decisions</div>
              </div>
              <div className="movement__item reveal" style={{ '--rd': '.08s' } as React.CSSProperties}>
                <div className="movement__item-num">02</div>
                <div className="movement__item-text">Preventive health awareness</div>
              </div>
              <div className="movement__item reveal" style={{ '--rd': '.16s' } as React.CSSProperties}>
                <div className="movement__item-num">03</div>
                <div className="movement__item-text">Personalized lifestyle understanding</div>
              </div>
              <div className="movement__item reveal" style={{ '--rd': '.24s' } as React.CSSProperties}>
                <div className="movement__item-num">04</div>
                <div className="movement__item-text">Future-ready healthcare thinking for India</div>
              </div>
            </div>

            <div className="movement__hl reveal" style={{ '--rd': '.3s' } as React.CSSProperties}>
              Future Ready Health. <span>Future Ready Bharat.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     FINAL CTA
     ============================================================ */}
      <section className="finalcta">
        <div className="finalcta__floats" aria-hidden="true">
          <div className="finalcta__photo finalcta__photo--tl parallax-cta" data-cta-speed="0.10">
            <img src="/kyg/8edd2bd58f53.jpg" alt="" />
          </div>
          <div className="finalcta__photo finalcta__photo--bl parallax-cta" data-cta-speed="0.16">
            <img src="/kyg/a4930f51ded1.jpg" alt="" />
          </div>
          <div className="finalcta__photo finalcta__photo--tr parallax-cta" data-cta-speed="0.14">
            <img src="/kyg/91608c2afbf8.jpg" alt="" />
          </div>
          <div className="finalcta__photo finalcta__photo--br parallax-cta" data-cta-speed="0.12">
            <img src="/kyg/07d054d6a059.jpg" alt="" />
          </div>
        </div>

        <div className="container finalcta__inner">
          <div className="reveal">
            <h2 className="finalcta__h">
              Your genes don't define your future.
              <em>
                <span className="grad-text">But they can help you understand your body better.</span>
              </em>
            </h2>
            <p className="finalcta__sub">Start your personalized wellness journey with KYG.</p>
            {/* CTA-HIDDEN: Final CTA buttons */}
            {false && (
              <div className="finalcta__btns">
                <a href="#wellness" className="btn btn--primary">
                  Begin your KYG journey
                  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="#care" className="btn btn--ghost">
                  Talk to GENEous Care
                </a>
              </div>
            )}{' '}
          </div>
        </div>
      </section>

      {/* ============================================================
     JS - sticky nav, mega menu, reveal animations, parallax
     ============================================================ */}
    </div>
  );
}

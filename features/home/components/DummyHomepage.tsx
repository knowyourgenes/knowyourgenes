'use client';

// =============================================================================
// DummyHomepage - a draft homepage built from KYG_Homepage.docx.
// -----------------------------------------------------------------------------
// Content: the "KYG - Homepage (AEO/GEO, four-product-parity)" copy deck.
// Theme:   reuses the live homepage's Warm-Modern design system (cream/peach/
//          teal). The scoped CSS below is the same token + utility foundation as
//          features/home/components/Homepage.tsx, re-scoped under `.kyg-dummy`
//          so it cannot collide with the live homepage's `.kyg-page` styles.
// This page is intentionally standalone (rendered only at /dummy-homepage); the
// live homepage at `/` is untouched.
// =============================================================================

import { useEffect, useRef } from 'react';

const PRODUCTS = {
  wellness: '/categories/wellness/my-wellness',
  womens: '/categories/wellness/womens-health',
  mens: '/categories/wellness/mens-health',
  ancestry: '/categories/wellness/ancestry',
} as const;

function Arrow() {
  return (
    <svg className="ico" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DUMMY_CSS = `
.kyg-dummy {
  --c-cream: #faf6ef; --c-cream-2: #f5eddf; --c-peach: #f8e4cc; --c-peach-2: #f3d5b2;
  --c-rose: #f0d5c0; --c-sand: #edddb8;
  --c-teal: #0e4d4b; --c-teal-2: #15605d; --c-teal-light: #25b5ab; --c-teal-bright: #2ac3a2;
  --ink-1: #1f1a14; --ink-2: #2d2a24; --ink-3: #6b6358; --ink-4: #b5ab9a;
  --ink-line: rgba(31, 26, 20, 0.08);
  --dark-1: #1a2220; --dark-2: #243230;
  --ff: 'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --r-xs: 12px; --r-sm: 18px; --r-md: 26px; --r-lg: 34px; --r-2xl: 56px;
  --e-out: cubic-bezier(0.22, 1, 0.36, 1);
  --e-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
  --gutter: clamp(20px, 4vw, 56px);
  --max-w: 1240px;
  --sh-1: 0 1px 2px rgba(45, 32, 18, 0.04), 0 4px 14px rgba(45, 32, 18, 0.04);
  --sh-2: 0 4px 16px rgba(45, 32, 18, 0.06), 0 18px 50px rgba(45, 32, 18, 0.08);
  --sh-3: 0 12px 36px rgba(45, 32, 18, 0.1), 0 40px 100px rgba(45, 32, 18, 0.14);
  font-family: var(--ff);
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink-1);
  background: var(--c-cream);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  position: relative;
  isolation: isolate;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
.kyg-dummy *, .kyg-dummy *::before, .kyg-dummy *::after { box-sizing: border-box; margin: 0; padding: 0; }
.kyg-dummy ul, .kyg-dummy ol { list-style: none; }
.kyg-dummy a { color: inherit; text-decoration: none; }
.kyg-dummy svg { display: block; }
.kyg-dummy ::selection { background: var(--c-teal); color: #fff; }

/* Warm animated mesh + grain (signature background) */
.kyg-dummy::before {
  content: ''; position: absolute; inset: 0; z-index: -2;
  background:
    radial-gradient(40vw 50vh at 12% 6%, rgba(248, 228, 204, 0.55) 0%, transparent 60%),
    radial-gradient(36vw 42vh at 88% 4%, rgba(243, 213, 178, 0.45) 0%, transparent 60%),
    radial-gradient(50vw 50vh at 78% 40%, rgba(240, 213, 192, 0.4) 0%, transparent 65%),
    radial-gradient(40vw 40vh at 15% 72%, rgba(245, 237, 223, 0.55) 0%, transparent 60%),
    var(--c-cream);
}
.kyg-dummy::after {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.18  0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>");
  opacity: 0.35; mix-blend-mode: multiply;
}

/* ---- container ---- */
.kyg-dummy .container { width: 100%; max-width: var(--max-w); margin: 0 auto; padding: 0 var(--gutter); }

/* ---- typography ---- */
.kyg-dummy .eyebrow {
  display: inline-flex; align-items: center; gap: 14px;
  font-size: 13px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--c-teal);
}
.kyg-dummy .eyebrow::before { content: ''; width: 40px; height: 2px; border-radius: 2px;
  background: linear-gradient(90deg, var(--c-teal), var(--c-teal-light)); }
.kyg-dummy .eyebrow--light { color: var(--c-peach-2); }
.kyg-dummy .eyebrow--light::before { background: var(--c-peach-2); }

.kyg-dummy .h-display { font-weight: 600; font-size: clamp(44px, 6.6vw, 92px); line-height: 0.98; letter-spacing: -0.035em; color: var(--ink-1); }
.kyg-dummy .h1 { font-weight: 600; font-size: clamp(34px, 4.8vw, 58px); line-height: 1.04; letter-spacing: -0.028em; color: var(--ink-1); }
.kyg-dummy .h2 { font-weight: 600; font-size: clamp(28px, 3.4vw, 44px); line-height: 1.1; letter-spacing: -0.022em; color: var(--ink-1); }
.kyg-dummy .h3 { font-weight: 600; font-size: clamp(21px, 2.1vw, 28px); line-height: 1.18; letter-spacing: -0.012em; color: var(--ink-1); }
.kyg-dummy .lead { font-size: clamp(17px, 1.4vw, 21px); line-height: 1.55; color: var(--ink-2); }
.kyg-dummy .muted { color: var(--ink-3); }

.kyg-dummy .grad-text {
  background: linear-gradient(110deg, var(--c-teal) 0%, var(--c-teal-2) 25%, var(--c-teal-light) 50%, var(--c-teal-2) 75%, var(--c-teal) 100%);
  background-size: 240% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: dhGrad 9s ease-in-out infinite;
}
@keyframes dhGrad { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

/* ---- buttons ---- */
.kyg-dummy .btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px 28px; border-radius: 999px; font-weight: 600; font-size: 15px; line-height: 1;
  letter-spacing: -0.005em; border: 1.5px solid transparent; cursor: pointer;
  transition: transform 0.5s var(--e-out), background 0.35s var(--e-out), color 0.35s var(--e-out), box-shadow 0.5s var(--e-out), border-color 0.35s var(--e-out);
}
.kyg-dummy .btn .ico { width: 16px; height: 16px; transition: transform 0.5s var(--e-out); }
.kyg-dummy .btn:hover .ico { transform: translateX(3px); }
.kyg-dummy .btn--primary { background: var(--ink-1); color: var(--c-cream); box-shadow: 0 10px 28px rgba(31, 26, 20, 0.18); }
.kyg-dummy .btn--primary:hover { background: var(--c-teal); transform: translateY(-3px); box-shadow: 0 18px 44px rgba(14, 77, 75, 0.32); }
.kyg-dummy .btn--accent { background: var(--c-teal-light); color: #fff; box-shadow: 0 10px 28px rgba(37, 181, 171, 0.32); }
.kyg-dummy .btn--accent:hover { background: var(--c-teal); transform: translateY(-3px); box-shadow: 0 18px 44px rgba(14, 77, 75, 0.36); }
.kyg-dummy .btn--ghost { background: transparent; color: var(--ink-1); border-color: rgba(31, 26, 20, 0.18); }
.kyg-dummy .btn--ghost:hover { background: var(--ink-1); color: var(--c-cream); border-color: var(--ink-1); transform: translateY(-3px); }
.kyg-dummy .btn--light { background: rgba(255, 255, 255, 0.92); color: var(--ink-1); backdrop-filter: blur(10px); }
.kyg-dummy .btn--light:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0, 0, 0, 0.18); }
.kyg-dummy .btn--text { padding: 8px 0; color: var(--ink-1); font-weight: 600; }
.kyg-dummy .btn--text:hover .ico { transform: translateX(5px); }

/* ---- reveal ---- */
.kyg-dummy .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.9s var(--e-out-soft), transform 0.9s var(--e-out-soft); transition-delay: var(--rd, 0s); }
.kyg-dummy .reveal.is-in { opacity: 1; transform: translateY(0); }

/* ---- section base ---- */
.kyg-dummy section.s { padding: clamp(52px, 6vw, 92px) 0; position: relative; }
.kyg-dummy .s--peach { background: linear-gradient(180deg, transparent 0%, rgba(248, 228, 204, 0.55) 50%, transparent 100%); }
.kyg-dummy .s--dark { background: var(--dark-1); color: var(--c-cream); overflow: hidden; }
.kyg-dummy .s--dark::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(50vw 60vh at 85% 12%, rgba(37, 181, 171, 0.18), transparent 60%),
    radial-gradient(40vw 50vh at 8% 92%, rgba(248, 228, 204, 0.1), transparent 60%);
}
.kyg-dummy .s--dark .h1, .kyg-dummy .s--dark .h2, .kyg-dummy .s--dark .h3, .kyg-dummy .s--dark .lead { color: var(--c-cream); }
.kyg-dummy .s--dark .muted { color: rgba(250, 246, 239, 0.65); }
.kyg-dummy .s-head { max-width: 760px; margin-bottom: clamp(40px, 5vw, 68px); }
.kyg-dummy .s-head--center { text-align: center; margin-left: auto; margin-right: auto; }
.kyg-dummy .s-head--center .lead, .kyg-dummy .s-head--center .eyebrow { margin-left: auto; margin-right: auto; }
.kyg-dummy .s-head .eyebrow { margin-bottom: 26px; }
.kyg-dummy .s-head .h1, .kyg-dummy .s-head .h2 { margin-bottom: 20px; }

/* ================= HERO ================= */
.kyg-dummy .dh-hero { padding: clamp(40px, 6vw, 80px) 0 clamp(48px, 6vw, 84px); }
.kyg-dummy .dh-hero__pill {
  display: inline-flex; align-items: center; gap: 12px; padding: 11px 22px; margin-bottom: 30px;
  background: var(--c-teal); color: var(--c-cream); border: 1px solid rgba(37, 181, 171, 0.32);
  border-radius: 999px; font-size: 13.5px; font-weight: 600; letter-spacing: 0.01em;
  box-shadow: 0 14px 32px -8px rgba(14, 77, 75, 0.4);
}
.kyg-dummy .dh-hero__pill span { opacity: 0.55; }
.kyg-dummy .dh-hero__h { font-weight: 600; font-size: clamp(40px, 6.2vw, 84px); line-height: 0.98; letter-spacing: -0.036em; color: var(--ink-1); max-width: 15ch; }
.kyg-dummy .dh-hero__sub { font-size: clamp(17px, 1.5vw, 21px); line-height: 1.5; color: var(--ink-2); margin-top: 26px; max-width: 640px; }
.kyg-dummy .dh-hero__cta { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 34px; }

/* four product anchors */
.kyg-dummy .dh-anchors { margin-top: clamp(36px, 4vw, 56px); border-top: 1px solid var(--ink-line); }
.kyg-dummy .dh-anchor {
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  padding: clamp(18px, 2.2vw, 26px) 4px; border-bottom: 1px solid var(--ink-line);
  transition: padding-left 0.5s var(--e-out), background 0.4s var(--e-out);
}
.kyg-dummy .dh-anchor:hover { padding-left: 18px; background: linear-gradient(90deg, rgba(37, 181, 171, 0.06), transparent 70%); }
.kyg-dummy .dh-anchor__q { font-weight: 600; font-size: clamp(19px, 2.1vw, 27px); letter-spacing: -0.02em; line-height: 1.2; color: var(--ink-1); }
.kyg-dummy .dh-anchor__r { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; font-weight: 600; font-size: clamp(14px, 1.3vw, 16px); color: var(--c-teal); }
.kyg-dummy .dh-anchor__r .ico { width: 17px; height: 17px; transition: transform 0.5s var(--e-out); }
.kyg-dummy .dh-anchor:hover .dh-anchor__r .ico { transform: translateX(4px); }
@media (max-width: 720px) { .kyg-dummy .dh-anchor { flex-direction: column; align-items: flex-start; gap: 8px; } }

/* hero stats bar */
.kyg-dummy .dh-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: clamp(40px, 5vw, 64px); }
.kyg-dummy .dh-stat {
  padding: 22px 24px; border-radius: var(--r-md); background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: var(--sh-1);
}
.kyg-dummy .dh-stat__num { font-size: clamp(26px, 2.6vw, 34px); font-weight: 600; letter-spacing: -0.02em; color: var(--ink-1); line-height: 1.05; }
.kyg-dummy .dh-stat__lab { font-size: 13px; color: var(--ink-3); margin-top: 6px; }
@media (max-width: 860px) { .kyg-dummy .dh-stats { grid-template-columns: 1fr 1fr; } }

/* ================= STORY ================= */
.kyg-dummy .dh-story__lead { font-weight: 600; font-size: clamp(24px, 3vw, 38px); letter-spacing: -0.02em; line-height: 1.2; color: var(--ink-1); max-width: 22ch; }
.kyg-dummy .dh-story__body { display: flex; flex-direction: column; gap: 18px; max-width: 620px; }
.kyg-dummy .dh-story__body p { font-size: 16.5px; line-height: 1.65; color: var(--ink-2); }
.kyg-dummy .dh-story__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: center; }
@media (max-width: 860px) { .kyg-dummy .dh-story__grid { grid-template-columns: 1fr; } }

/* ================= CHOOSE YOUR TEST (4 cards) ================= */
.kyg-dummy .dh-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
@media (max-width: 760px) { .kyg-dummy .dh-cards { grid-template-columns: 1fr; } }
.kyg-dummy .dh-card {
  position: relative; display: flex; flex-direction: column; overflow: hidden;
  padding: clamp(26px, 2.6vw, 34px); border-radius: var(--r-lg); background: #fff;
  border: 1px solid var(--ink-line); box-shadow: var(--sh-1);
  transition: transform 0.6s var(--e-out), box-shadow 0.6s var(--e-out), border-color 0.4s var(--e-out);
}
.kyg-dummy .dh-card:hover { transform: translateY(-6px); box-shadow: var(--sh-2); border-color: rgba(37, 181, 171, 0.35); }
.kyg-dummy .dh-card::before { content: ''; position: absolute; inset-inline: 0; top: 0; height: 5px; background: var(--bar, var(--c-teal-light)); }
.kyg-dummy .dh-card__kicker { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--bar, var(--c-teal)); }
.kyg-dummy .dh-card__title { margin-top: 12px; font-weight: 600; font-size: clamp(21px, 2vw, 27px); line-height: 1.2; letter-spacing: -0.02em; color: var(--ink-1); }
.kyg-dummy .dh-card__list { margin: 20px 0 24px; display: flex; flex-direction: column; gap: 10px; }
.kyg-dummy .dh-card__list li { position: relative; padding-left: 24px; font-size: 15px; line-height: 1.45; color: var(--ink-2); }
.kyg-dummy .dh-card__list li::before { content: ''; position: absolute; left: 0; top: 9px; width: 12px; height: 2px; border-radius: 2px; background: var(--bar, var(--c-teal-light)); }
.kyg-dummy .dh-card__cta { margin-top: auto; display: inline-flex; align-items: center; gap: 9px; font-weight: 600; font-size: 15px; color: var(--c-teal); }
.kyg-dummy .dh-card__cta .ico { width: 17px; height: 17px; transition: transform 0.5s var(--e-out); }
.kyg-dummy .dh-card:hover .dh-card__cta .ico { transform: translateX(4px); }

/* ================= STAT WALL ================= */
.kyg-dummy .dh-wall { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
@media (max-width: 760px) { .kyg-dummy .dh-wall { grid-template-columns: 1fr; } }
.kyg-dummy .dh-wall__item {
  padding: clamp(26px, 2.6vw, 36px); border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12);
}
.kyg-dummy .dh-wall__stat { font-weight: 600; font-size: clamp(22px, 2.4vw, 30px); line-height: 1.18; letter-spacing: -0.018em; color: var(--c-cream); }
.kyg-dummy .dh-wall__stat b { color: var(--c-teal-bright); }
.kyg-dummy .dh-wall__sub { margin-top: 12px; font-size: 15px; line-height: 1.55; color: rgba(250, 246, 239, 0.72); }
.kyg-dummy .dh-wall__tag { margin-top: 16px; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-peach-2); }
.kyg-dummy .dh-wall__ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(32px, 4vw, 48px); }

/* ================= REPORT PREVIEW ================= */
.kyg-dummy .dh-report { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
@media (max-width: 760px) { .kyg-dummy .dh-report { grid-template-columns: 1fr; } }
.kyg-dummy .dh-grade {
  padding: 26px; border-radius: var(--r-md); background: #fff; border: 1px solid var(--ink-line); box-shadow: var(--sh-1);
}
.kyg-dummy .dh-grade__tag { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; padding: 6px 14px; border-radius: 999px; }
.kyg-dummy .dh-grade__dot { width: 9px; height: 9px; border-radius: 50%; background: currentColor; }
.kyg-dummy .dh-grade__txt { margin-top: 16px; font-size: 15px; line-height: 1.5; color: var(--ink-2); }
.kyg-dummy .g-good { background: rgba(37, 181, 171, 0.14); color: var(--c-teal); }
.kyg-dummy .g-avg { background: #fff1d4; color: #9a6c0f; }
.kyg-dummy .g-poor { background: #fde6dc; color: #b5482b; }

/* ================= HOW IT WORKS ================= */
.kyg-dummy .dh-steps { display: flex; flex-direction: column; gap: 14px; }
.kyg-dummy .dh-step { display: grid; grid-template-columns: auto 1fr; gap: 24px; align-items: start; padding: 24px 28px; border-radius: var(--r-md); background: #fff; border: 1px solid var(--ink-line); box-shadow: var(--sh-1); }
.kyg-dummy .dh-step--dark { background: linear-gradient(160deg, var(--c-teal) 0%, #0a3f3d 100%); border-color: rgba(37, 181, 171, 0.22); color: var(--c-cream); }
.kyg-dummy .dh-step__num { font-weight: 600; font-size: 26px; letter-spacing: -0.02em; color: var(--c-teal); min-width: 42px; }
.kyg-dummy .dh-step--dark .dh-step__num { color: var(--c-teal-bright); }
.kyg-dummy .dh-step__title { font-weight: 600; font-size: 18px; letter-spacing: -0.02em; color: var(--ink-1); }
.kyg-dummy .dh-step--dark .dh-step__title { color: var(--c-cream); }
.kyg-dummy .dh-step__body { margin-top: 6px; font-size: 14.5px; line-height: 1.6; color: var(--ink-2); }
.kyg-dummy .dh-step--dark .dh-step__body { color: rgba(250, 246, 239, 0.8); }
@media (max-width: 620px) { .kyg-dummy .dh-step { grid-template-columns: 1fr; gap: 8px; } }

/* ================= CARE ================= */
.kyg-dummy .dh-care__grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(32px, 5vw, 72px); align-items: center; }
@media (max-width: 900px) { .kyg-dummy .dh-care__grid { grid-template-columns: 1fr; } }
.kyg-dummy .dh-care__body { display: flex; flex-direction: column; gap: 18px; }
.kyg-dummy .dh-care__body p { font-size: 16px; line-height: 1.65; color: rgba(250, 246, 239, 0.82); }
.kyg-dummy .dh-care__lead { font-size: clamp(18px, 1.7vw, 22px) !important; font-weight: 500; color: var(--c-peach-2) !important; }
.kyg-dummy .dh-chat { display: flex; flex-direction: column; gap: 12px; padding: 26px; border-radius: var(--r-lg); background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); }
.kyg-dummy .dh-bubble { max-width: 84%; padding: 13px 16px; font-size: 14px; line-height: 1.5; border-radius: 16px 16px 16px 6px; background: rgba(255, 255, 255, 0.08); color: var(--c-cream); }
.kyg-dummy .dh-bubble--me { align-self: flex-end; border-radius: 16px 16px 6px 16px; background: var(--c-teal-light); color: #fff; }

/* ================= TRUST ================= */
.kyg-dummy .dh-cert { border-radius: var(--r-lg); background: #fff; border: 1px solid var(--ink-line); box-shadow: var(--sh-1); overflow: hidden; }
.kyg-dummy .dh-cert__row { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 28px; padding: 22px 30px; border-bottom: 1px solid var(--ink-line); }
.kyg-dummy .dh-cert__row:last-child { border-bottom: none; }
.kyg-dummy .dh-cert__k { font-weight: 600; font-size: 15px; color: var(--ink-1); }
.kyg-dummy .dh-cert__v { font-size: 14.5px; line-height: 1.55; color: var(--ink-2); }
@media (max-width: 720px) { .kyg-dummy .dh-cert__row { grid-template-columns: 1fr; gap: 6px; } }
.kyg-dummy .dh-expert { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: start; margin-top: 20px; padding: 28px 30px; border-radius: var(--r-lg); background: linear-gradient(160deg, var(--c-teal), #0a3f3d); color: var(--c-cream); }
.kyg-dummy .dh-expert__badge { width: 56px; height: 56px; border-radius: 14px; background: var(--c-peach-2); color: var(--c-teal); display: grid; place-items: center; font-weight: 700; font-size: 18px; }
.kyg-dummy .dh-expert__name { font-weight: 600; font-size: 18px; }
.kyg-dummy .dh-expert__name span { font-weight: 500; color: var(--c-peach-2); }
.kyg-dummy .dh-expert__body { margin-top: 8px; font-size: 14.5px; line-height: 1.55; color: rgba(250, 246, 239, 0.9); }

/* ================= COMBOS ================= */
.kyg-dummy .dh-combos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 860px) { .kyg-dummy .dh-combos { grid-template-columns: 1fr; } }
.kyg-dummy .dh-combo { display: flex; flex-direction: column; padding: clamp(24px, 2.4vw, 30px); border-radius: var(--r-lg); background: #fff; border: 1px solid var(--ink-line); box-shadow: var(--sh-1); transition: transform 0.6s var(--e-out), box-shadow 0.6s var(--e-out); }
.kyg-dummy .dh-combo:hover { transform: translateY(-5px); box-shadow: var(--sh-2); }
.kyg-dummy .dh-combo__title { font-weight: 600; font-size: 21px; letter-spacing: -0.015em; color: var(--ink-1); }
.kyg-dummy .dh-combo__sub { margin-top: 8px; font-size: 14px; line-height: 1.45; color: var(--ink-3); }
.kyg-dummy .dh-combo__what { margin: 18px 0 22px; padding-top: 16px; border-top: 1px solid var(--ink-line); font-size: 14.5px; line-height: 1.5; color: var(--ink-2); }
.kyg-dummy .dh-combo__cta { margin-top: auto; display: inline-flex; align-items: center; gap: 9px; font-weight: 600; font-size: 14.5px; color: var(--c-teal); }
.kyg-dummy .dh-combo__cta .ico { width: 16px; height: 16px; }

/* ================= DECODED ================= */
.kyg-dummy .dh-decoded { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; padding: clamp(28px, 3vw, 44px); border-radius: var(--r-lg); background: rgba(255, 255, 255, 0.6); border: 1px dashed rgba(31, 26, 20, 0.18); }
.kyg-dummy .dh-decoded__note { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-top: 10px; }

/* ================= FAQ ================= */
.kyg-dummy .dh-faq { display: flex; flex-direction: column; gap: 12px; max-width: 900px; }
.kyg-dummy .dh-faq details { border-radius: var(--r-sm); background: #fff; border: 1px solid var(--ink-line); overflow: hidden; }
.kyg-dummy .dh-faq summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 26px; cursor: pointer; list-style: none; font-weight: 600; font-size: 16.5px; color: var(--ink-1); }
.kyg-dummy .dh-faq summary::-webkit-details-marker { display: none; }
.kyg-dummy .dh-faq__ico { position: relative; width: 26px; height: 26px; flex-shrink: 0; border-radius: 50%; background: rgba(37, 181, 171, 0.1); }
.kyg-dummy .dh-faq__ico::before, .kyg-dummy .dh-faq__ico::after { content: ''; position: absolute; left: 50%; top: 50%; background: var(--c-teal); border-radius: 2px; transform: translate(-50%, -50%); transition: opacity 0.3s var(--e-out), transform 0.3s var(--e-out); }
.kyg-dummy .dh-faq__ico::before { width: 12px; height: 2px; }
.kyg-dummy .dh-faq__ico::after { width: 2px; height: 12px; }
.kyg-dummy .dh-faq details[open] .dh-faq__ico::after { opacity: 0; transform: translate(-50%, -50%) rotate(90deg); }
.kyg-dummy .dh-faq__a { padding: 0 26px 22px; font-size: 15px; line-height: 1.65; color: var(--ink-2); }

/* ================= FINAL CTA ================= */
.kyg-dummy .dh-final { text-align: center; border-radius: var(--r-2xl); padding: clamp(52px, 7vw, 96px) clamp(28px, 6vw, 96px); background: linear-gradient(167deg, var(--c-teal) 0%, #0a3b39 55%, #052422 100%); color: var(--c-cream); box-shadow: var(--sh-3); position: relative; overflow: hidden; }
.kyg-dummy .dh-final::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(50% 60% at 80% 10%, rgba(37, 181, 171, 0.22), transparent 60%); }
.kyg-dummy .dh-final > * { position: relative; z-index: 1; }
.kyg-dummy .dh-final__h { font-weight: 600; font-size: clamp(30px, 4.2vw, 50px); line-height: 1.08; letter-spacing: -0.025em; }
.kyg-dummy .dh-final__h em { font-style: normal; display: block; color: var(--c-peach-2); }
.kyg-dummy .dh-final__sub { margin: 18px auto 0; max-width: 640px; font-size: 17px; line-height: 1.55; color: rgba(250, 246, 239, 0.85); }
.kyg-dummy .dh-final__ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin: 32px 0 22px; }
.kyg-dummy .dh-final__fine { font-size: 13px; color: rgba(250, 246, 239, 0.6); }
`;

export default function DummyHomepage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('.reveal');
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="kyg-dummy">
      <style dangerouslySetInnerHTML={{ __html: DUMMY_CSS }} />

      {/* ===================== 1 · HERO ===================== */}
      <section className="dh-hero">
        <div className="container">
          <div className="reveal">
            <div className="dh-hero__pill">
              Know Your Genes <span>·</span> 5 Genetic Reports <span>·</span> 1 Saliva Kit Per Test <span>·</span> NABL Certified Lab
            </div>
            <h1 className="dh-hero__h">
              Your body already carries <span className="grad-text">clues about your future.</span>
            </h1>
            <p className="dh-hero__sub">
              From how your body handles food and fitness, to health risks specific to you, to where your bloodline
              actually comes from — KYG turns one saliva sample into answers plain English can explain.
            </p>
            <div className="dh-hero__cta">
              <a href="#choose" className="btn btn--primary">
                Find My Test <Arrow />
              </a>
              <a href="#choose" className="btn btn--text muted">
                or explore all tests below ↓
              </a>
            </div>
          </div>

          {/* four product anchors */}
          <div className="dh-anchors reveal" style={{ ['--rd' as string]: '0.05s' }}>
            <a className="dh-anchor" href={PRODUCTS.wellness}>
              <span className="dh-anchor__q">What your body needs to eat, move, and recover.</span>
              <span className="dh-anchor__r">
                My Wellness <Arrow />
              </span>
            </a>
            <a className="dh-anchor" href={PRODUCTS.womens}>
              <span className="dh-anchor__q">The health risks specific to being a woman in India.</span>
              <span className="dh-anchor__r">
                Women&apos;s Health <Arrow />
              </span>
            </a>
            <a className="dh-anchor" href={PRODUCTS.mens}>
              <span className="dh-anchor__q">The health risks men rarely get tested for.</span>
              <span className="dh-anchor__r">
                Men&apos;s Health <Arrow />
              </span>
            </a>
            <a className="dh-anchor" href={PRODUCTS.ancestry}>
              <span className="dh-anchor__q">Where your bloodline actually comes from.</span>
              <span className="dh-anchor__r">
                Ancestors In Me <Arrow />
              </span>
            </a>
          </div>

          {/* stats bar */}
          <div className="dh-stats reveal">
            <div className="dh-stat">
              <div className="dh-stat__num">5</div>
              <div className="dh-stat__lab">Genetic reports</div>
            </div>
            <div className="dh-stat">
              <div className="dh-stat__num">52 + 42,000+</div>
              <div className="dh-stat__lab">Wellness traits · Ancestry markers</div>
            </div>
            <div className="dh-stat">
              <div className="dh-stat__num">NABL</div>
              <div className="dh-stat__lab">Certified lab</div>
            </div>
            <div className="dh-stat">
              <div className="dh-stat__num">7 days</div>
              <div className="dh-stat__lab">Results, every report</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 2 · THE KYG STORY ===================== */}
      <section className="s s--peach">
        <div className="container">
          <div className="dh-story__grid">
            <div className="reveal">
              <div className="eyebrow" style={{ marginBottom: 24 }}>
                The KYG Story
              </div>
              <p className="dh-story__lead">You know your Aadhaar number better than your own health risks.</p>
            </div>
            <div className="dh-story__body reveal" style={{ ['--rd' as string]: '0.08s' }}>
              <p>
                You track your money. Your calories. Your steps. Your sleep. Even your investments. But do you actually
                understand your own body?
              </p>
              <p>
                The diet that transformed your colleague. The workout everyone swears by. The health scare that runs in
                someone else&apos;s family but somehow skips theirs. If none of it lines up for you, it&apos;s not because
                you didn&apos;t try hard enough — your body was never given the instructions everyone else is following.
              </p>
              <p>
                KYG reads those instructions — whatever they cover for you. Diet and fitness. Hormones and fertility.
                Bone health and PCOS risk. Or the 50,000-year story of where you actually come from. One saliva sample,
                decoded in plain English.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 3 · CHOOSE YOUR TEST ===================== */}
      <section className="s" id="choose">
        <div className="container">
          <div className="s-head s-head--center reveal">
            <div className="eyebrow">Choose your test</div>
            <h2 className="h2">One saliva kit. Four ways to understand yourself.</h2>
            <p className="lead muted">
              Each test starts with the same 5-minute saliva collection at home. What it reveals is different. Pick the
              one that answers your question.
            </p>
          </div>

          <div className="dh-cards">
            <a className="dh-card reveal" href={PRODUCTS.wellness} style={{ ['--bar' as string]: '#2e7d5b' }}>
              <span className="dh-card__kicker">My Wellness</span>
              <h3 className="dh-card__title">Same diet. Same effort. Different results.</h3>
              <ul className="dh-card__list">
                <li>4 reports: Diet, Weight, Fitness, Detox</li>
                <li>52 traits from one saliva kit</li>
                <li>Results in 7 days</li>
              </ul>
              <span className="dh-card__cta">
                Explore My Wellness — Rs X,XXX <Arrow />
              </span>
            </a>

            <a className="dh-card reveal" href={PRODUCTS.womens} style={{ ['--bar' as string]: '#c0432f', ['--rd' as string]: '0.05s' }}>
              <span className="dh-card__kicker">Women&apos;s Health</span>
              <h3 className="dh-card__title">1 in 5 Indian women has PCOS. Most never learn why.</h3>
              <ul className="dh-card__list">
                <li>5 tests: PCOS, pregnancy loss, post-pregnancy depression, bone weakness, joint pain</li>
                <li>Results in 7 days</li>
              </ul>
              <span className="dh-card__cta">
                Explore Women&apos;s Health — Rs X,XXX <Arrow />
              </span>
            </a>

            <a className="dh-card reveal" href={PRODUCTS.mens} style={{ ['--bar' as string]: '#0e4d4b', ['--rd' as string]: '0.1s' }}>
              <span className="dh-card__kicker">Men&apos;s Health</span>
              <h3 className="dh-card__title">Men rarely get tested until something goes wrong.</h3>
              <ul className="dh-card__list">
                <li>3 tests: fertility, hormones, hair loss</li>
                <li>Results in 7 days</li>
              </ul>
              <span className="dh-card__cta">
                Explore Men&apos;s Health — Rs X,XXX <Arrow />
              </span>
            </a>

            <a className="dh-card reveal" href={PRODUCTS.ancestry} style={{ ['--bar' as string]: '#1e5f9e', ['--rd' as string]: '0.15s' }}>
              <span className="dh-card__kicker">Ancestors In Me</span>
              <h3 className="dh-card__title">KYC toh kar liya. Ab apni asli identity jaano.</h3>
              <ul className="dh-card__list">
                <li>42,000+ markers analysed across up to 10 global regions</li>
                <li>Includes your written Gene Journey story</li>
                <li>Results in 7 days</li>
              </ul>
              <span className="dh-card__cta">
                Explore Ancestors In Me — Rs X,XXX <Arrow />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ===================== 4 · THE STAT WALL ===================== */}
      <section className="s s--dark">
        <div className="container">
          <div className="s-head reveal">
            <div className="eyebrow eyebrow--light">The proof</div>
            <h2 className="h2">Four questions your genes have been answering the whole time.</h2>
          </div>
          <div className="dh-wall">
            <div className="dh-wall__item reveal">
              <p className="dh-wall__stat">
                Indians with the FTO gene risk variant on a high-carb diet had <b>2.46×</b> the obesity risk.
              </p>
              <p className="dh-wall__sub">
                We eat rice and roti every day. Most of us don&apos;t know which side of that statistic we&apos;re on.
              </p>
              <div className="dh-wall__tag">My Wellness</div>
            </div>
            <div className="dh-wall__item reveal" style={{ ['--rd' as string]: '0.05s' }}>
              <p className="dh-wall__stat">
                <b>1 in 5</b> Indian women has PCOS.
              </p>
              <p className="dh-wall__sub">Most spend years not knowing why their body behaves the way it does.</p>
              <div className="dh-wall__tag">Women&apos;s Health</div>
            </div>
            <div className="dh-wall__item reveal" style={{ ['--rd' as string]: '0.1s' }}>
              <p className="dh-wall__stat">
                <b>1 in 8</b> couples find it hard to have a baby.
              </p>
              <p className="dh-wall__sub">
                In almost half of those cases, the reason is with the man. Most never find out why.
              </p>
              <div className="dh-wall__tag">Men&apos;s Health</div>
            </div>
            <div className="dh-wall__item reveal" style={{ ['--rd' as string]: '0.15s' }}>
              <p className="dh-wall__stat">
                Most Indians can trace their family back 2-3 generations. Your DNA can trace it back <b>50,000 years.</b>
              </p>
              <p className="dh-wall__sub">
                Across continents, through civilisations, back to the first humans who walked out of Africa.
              </p>
              <div className="dh-wall__tag">Ancestors In Me</div>
            </div>
          </div>
          <div className="dh-wall__ctas reveal">
            <a href={PRODUCTS.wellness} className="btn btn--accent">
              Get my Wellness report <Arrow />
            </a>
            <a href={PRODUCTS.womens} className="btn btn--light">
              Check my Women&apos;s Health risk <Arrow />
            </a>
            <a href={PRODUCTS.mens} className="btn btn--light">
              Check my Men&apos;s Health risk <Arrow />
            </a>
            <a href={PRODUCTS.ancestry} className="btn btn--light">
              Discover my Ancestors <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ===================== 5 · SAMPLE REPORT PREVIEW ===================== */}
      <section className="s">
        <div className="container">
          <div className="s-head s-head--center reveal">
            <div className="eyebrow">Sample report</div>
            <h2 className="h2">This is what a KYG report looks like.</h2>
            <p className="lead muted">
              Every trait, in every report across every product, comes back the same way: your result, a risk level, and
              a plain-language explanation of what to do about it.
            </p>
          </div>
          <div className="dh-report">
            <div className="dh-grade reveal">
              <span className="dh-grade__tag g-good">
                <span className="dh-grade__dot" /> GOOD
              </span>
              <p className="dh-grade__txt">Low risk — your genes are in the normal range for this trait.</p>
            </div>
            <div className="dh-grade reveal" style={{ ['--rd' as string]: '0.05s' }}>
              <span className="dh-grade__tag g-avg">
                <span className="dh-grade__dot" /> AVERAGE
              </span>
              <p className="dh-grade__txt">Some tendency — follow the recommendations in your report.</p>
            </div>
            <div className="dh-grade reveal" style={{ ['--rd' as string]: '0.1s' }}>
              <span className="dh-grade__tag g-poor">
                <span className="dh-grade__dot" /> POOR
              </span>
              <p className="dh-grade__txt">Elevated tendency — act on the recommendations, and talk to a specialist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 6 · HOW IT WORKS ===================== */}
      <section className="s s--peach">
        <div className="container">
          <div className="s-head reveal">
            <div className="eyebrow">How it works</div>
            <h2 className="h2">From your door to your report.</h2>
            <p className="lead muted">No clinic, no needle, no hassle. Same process, whichever test you choose.</p>
          </div>
          <div className="dh-steps">
            {[
              {
                n: '01',
                t: 'Order online',
                b: 'Your kit arrives in 2 to 3 days. Saliva tube, instruction card, and a prepaid return envelope — everything included.',
              },
              {
                n: '02',
                t: 'Collect your sample at home in 5 minutes',
                b: "No needles, no fasting, no appointments. Open the tube, spit, seal. That's the whole collection.",
              },
              {
                n: '03',
                t: 'Drop it with the courier',
                b: "Prepaid, pre-labelled envelope. A courier picks it up from your address — track it in the KYG portal from the moment it's collected.",
              },
              {
                n: '04',
                t: 'Our lab processes your sample',
                b: "Neotech World Lab — NABL accredited, India's highest official lab certification. Illumina genotyping technology. A qualified scientist reviews every result before release.",
              },
              {
                n: '05',
                t: 'Your report unlocks in 7 days',
                b: 'Delivered to your KYG account, in plain English. Within 2 days, a GENEous Care counsellor reaches out to book your free 30-minute session.',
                dark: true,
              },
            ].map((s) => (
              <div key={s.n} className={`dh-step reveal${s.dark ? ' dh-step--dark' : ''}`}>
                <div className="dh-step__num">{s.n}</div>
                <div>
                  <div className="dh-step__title">{s.t}</div>
                  <p className="dh-step__body">{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 7 · GENEOUS CARE ===================== */}
      <section className="s">
        <div className="container">
          <div className="s--dark" style={{ borderRadius: 'var(--r-2xl)', padding: 'clamp(44px,6vw,84px) clamp(28px,5vw,72px)' }}>
            <div className="dh-care__grid">
              <div className="dh-care__body reveal">
                <div className="eyebrow eyebrow--light">GENEous Care</div>
                <h2 className="h2">You will not read your report alone.</h2>
                <p className="dh-care__lead lead">
                  GENEous Care is KYG&apos;s free counselling service. A real, qualified counsellor reaches out after your
                  report is ready and walks you through it — on WhatsApp, in plain language, no medical jargon.
                </p>
                <p>
                  Other genetic testing brands send a report and a help-page link. KYG gives you a 30-minute conversation
                  with someone who has already read your specific results and knows exactly what matters for you first.
                </p>
                <p className="muted">
                  Included free with every report, whichever test you order. Counsellor contacts you within 2 days of your
                  report being delivered.
                </p>
              </div>
              <div className="dh-chat reveal" style={{ ['--rd' as string]: '0.08s' }}>
                <div className="dh-bubble">
                  Hi! I&apos;ve read through your report. Free to chat for 30 mins this week?
                </div>
                <div className="dh-bubble dh-bubble--me">Yes — where should I start?</div>
                <div className="dh-bubble">
                  I&apos;ve pulled out the 3 results that matter most for you. I&apos;ll walk you through all of it on the
                  call 👍
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 8 · TRUST & CREDENTIALS ===================== */}
      <section className="s s--peach">
        <div className="container">
          <div className="s-head reveal">
            <div className="eyebrow">Trust &amp; credentials</div>
            <h2 className="h2">The science behind every KYG report.</h2>
          </div>
          <div className="dh-cert reveal">
            {[
              ['NABL Accredited (ISO 15189) — MC-6400', "India's highest official certification for testing labs. Your sample is handled under strict, independently verified standards."],
              ['ISO 9001:2015 + ISO 27001:2013', 'Quality management and data security certified. Your personal and genetic data is protected at every step.'],
              ['ACMG + CPIC Guidelines', "Your reports follow the guidelines of two of the world's leading bodies in genetic science."],
              ['Illumina Genotyping Technology', "The same gene-reading technology used by the world's largest genetic testing companies. 99%+ accuracy."],
              ['HIPAA + FDA Standards', 'Your data is handled under international privacy rules. KYG never sells or shares your information.'],
            ].map(([k, v]) => (
              <div key={k} className="dh-cert__row">
                <div className="dh-cert__k">{k}</div>
                <div className="dh-cert__v">{v}</div>
              </div>
            ))}
          </div>
          <div className="dh-expert reveal">
            <div className="dh-expert__badge">VS</div>
            <div>
              <div className="dh-expert__name">
                Dr. Varun Sharma, Ph.D <span>· Genetic Scientist, Neotech World Lab (MG Road, Gurugram)</span>
              </div>
              <p className="dh-expert__body">
                Every KYG report is personally reviewed by Dr. Sharma&apos;s team before it reaches you. 99%+
                reproducibility; fewer than 2% of samples ever need rechecking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 9 · POPULAR COMBOS ===================== */}
      <section className="s">
        <div className="container">
          <div className="s-head s-head--center reveal">
            <div className="eyebrow">Popular combos</div>
            <h2 className="h2">Want to go further? These go together.</h2>
          </div>
          <div className="dh-combos">
            <div className="dh-combo reveal">
              <div className="dh-combo__title">Know Before You Begin</div>
              <div className="dh-combo__sub">For couples getting married or planning a family</div>
              <div className="dh-combo__what">Women&apos;s Health + Men&apos;s Health + one joint counselling session</div>
              <a href="#" className="dh-combo__cta">
                View Bundle — Rs X,XXX <Arrow />
              </a>
            </div>
            <div className="dh-combo reveal" style={{ ['--rd' as string]: '0.05s' }}>
              <div className="dh-combo__title">The Complete You</div>
              <div className="dh-combo__sub">The most complete genetic picture available in India</div>
              <div className="dh-combo__what">All 4 health reports + Ancestors In Me</div>
              <a href="#" className="dh-combo__cta">
                View Bundle — Rs X,XXX <Arrow />
              </a>
            </div>
            <div className="dh-combo reveal" style={{ ['--rd' as string]: '0.1s' }}>
              <div className="dh-combo__title">Couple&apos;s Blueprint</div>
              <div className="dh-combo__sub">For couples who want everyday health insights, not just family-planning data</div>
              <div className="dh-combo__what">My Wellness + Women&apos;s Health + Men&apos;s Health</div>
              <a href="#" className="dh-combo__cta">
                View Bundle — Rs X,XXX <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 10 · HEALTH DECODED ===================== */}
      <section className="s s--peach">
        <div className="container">
          <div className="dh-decoded reveal">
            <div>
              <div className="eyebrow">Health Decoded</div>
              <h3 className="h3" style={{ marginTop: 16 }}>
                Straight answers to the questions Indians actually search about their bodies.
              </h3>
              <div className="dh-decoded__note">● Coming soon — articles publishing shortly</div>
            </div>
            <a href="/blog" className="btn btn--ghost">
              Visit the blog <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ===================== 11 · HOMEPAGE FAQ ===================== */}
      <section className="s">
        <div className="container">
          <div className="s-head reveal">
            <div className="eyebrow">FAQ</div>
            <h2 className="h2">Questions people ask before they pick a test.</h2>
          </div>
          <div className="dh-faq reveal">
            {[
              {
                q: 'Which KYG test should I take?',
                a: 'It depends on what you want to know. My Wellness covers diet, weight, fitness, and detox for anyone who wants to understand how their body actually works day to day. Women’s Health and Men’s Health cover specific health risks — PCOS, fertility, hormones, bone health, and more. Ancestors In Me is about heritage, not health. Many people start with My Wellness or the relevant Health report and add Ancestry later.',
              },
              {
                q: 'Are these different tests, or one test that covers everything?',
                a: 'Each product uses its own saliva sample and answers a different question — Wellness, Women’s Health, Men’s Health, and Ancestry are four separate reports. If you want more than one, you take a separate kit for each, though bundles like The Complete You combine several at once for better value.',
              },
              {
                q: 'Is this the same as an international ancestry test like AncestryDNA or 23andMe?',
                a: 'No. KYG’s Ancestors In Me is built and processed in India, at an NABL-certified lab, with reference population data relevant to South Asian ancestry — a region many international tests represent less precisely. It is not affiliated with AncestryDNA or 23andMe.',
              },
              {
                q: 'How is this different from a regular blood test at a lab?',
                a: 'A blood test usually measures what’s happening in your body right now — your current cholesterol, sugar, or hormone levels. A KYG genetic test reads your underlying genetic tendencies, which don’t change over time, and explains the ‘why’ behind patterns a regular blood test can’t. The two are complementary, not competing.',
              },
              {
                q: 'Is my genetic data safe?',
                a: 'Yes. Your data is handled under ISO 27001:2013 and HIPAA/FDA-aligned privacy standards. KYG never sells or shares your genetic information, and your physical sample is destroyed after processing.',
              },
              {
                q: 'Can I order more than one test at a time?',
                a: 'Yes. You can order any combination of My Wellness, Women’s Health, Men’s Health, and Ancestors In Me, either individually or as one of the combo bundles above.',
              },
            ].map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <span className="dh-faq__ico" />
                </summary>
                <p className="dh-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 12 · FINAL CTA ===================== */}
      <section className="s">
        <div className="container">
          <div className="dh-final reveal">
            <h2 className="dh-final__h">
              Your body has been running on guesswork.
              <em>It&apos;s time to give it the right instructions.</em>
            </h2>
            <p className="dh-final__sub">
              Four ways to finally understand yourself. One saliva kit each. Results in 7 days.
            </p>
            <div className="dh-final__ctas">
              <a href={PRODUCTS.wellness} className="btn btn--accent">
                Get my Wellness report <Arrow />
              </a>
              <a href={PRODUCTS.womens} className="btn btn--light">
                Explore Women&apos;s Health <Arrow />
              </a>
              <a href={PRODUCTS.mens} className="btn btn--light">
                Explore Men&apos;s Health <Arrow />
              </a>
              <a href={PRODUCTS.ancestry} className="btn btn--light">
                Discover my Ancestors <Arrow />
              </a>
            </div>
            <p className="dh-final__fine">
              Certified lab · 99%+ accuracy · Your data stays private · Free GENEous Care session with every report
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

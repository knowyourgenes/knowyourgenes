// Scoped design-system stylesheet for the (tests) detail pages.
// -----------------------------------------------------------------------------
// Everything is scoped under `.kyg-mh` so nothing leaks across routes. Fonts come
// from the root layout's next/font variables (--font-figtree / --font-hind). This
// mirrors the Figma "Men's Health Test" design 1:1 (colours, type scale, radii,
// shadows). Reveal-on-scroll + the sheen button effect live here because CSS
// utilities can't express them.

const CSS = `
.kyg-mh {
  /* Warm base */
  --spring: #F6F3ED;
  --pearl-50: rgba(236, 230, 218, 0.5);
  --pearl-40: rgba(236, 230, 218, 0.4);

  /* Dark teal panels */
  --bottle-hero: #0A3B39;
  --bottle: #052422;
  --eden: #0E4D4B;
  --eden-2: #15605D;

  /* Accents */
  --java: #25B5AB;
  --java-2: #2AC3A2;
  --bermuda: #86DAD0;
  --surfie: #0E7C77;   /* fertility */
  --sea: #2E7D5B;      /* good */
  --harp: #E3F1E9;
  --swans: #DBF1EE;
  --mojo: #C0432F;     /* hair loss */
  --poppy: #C03E2C;    /* poor */
  --oldlace: #FBE6E0;
  --linen: #FBE7E2;
  --mandalay: #A8741A; /* average */
  --lusta: #FBF0D7;

  /* Ink */
  --mine: #222222;
  --cape: #3A4A48;
  --cord: #5F6F6C;
  --athens: #E5E7EB;
  --zeus-8: rgba(31, 26, 20, 0.08);
  --zeus-9: rgba(31, 26, 20, 0.09);

  /* Radii */
  --r-chip: 12px;
  --r-tile: 16px;
  --r-card: 24px;
  --r-pain: 26px;

  /* Shadows */
  --sh-card: 0 4px 14px rgba(10,27,48,.06), 0 1px 2px rgba(10,27,48,.05);
  --sh-deep: 0 40px 100px -40px rgba(5,36,34,.45), 0 12px 36px -18px rgba(5,36,34,.30);
  --sh-dark: 0 18px 50px -24px rgba(5,36,34,.55), 0 4px 16px rgba(5,36,34,.25);
  --sh-ring-java: 0 0 0 1px rgba(37,181,171,.5), 0 24px 60px -30px rgba(14,77,75,.5);

  --e-out: cubic-bezier(0.22, 1, 0.36, 1);

  --ff: var(--font-figtree), system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ff-i: var(--font-hind), var(--ff);

  font-family: var(--ff);
  color: var(--mine);
  background: var(--spring);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.kyg-mh *, .kyg-mh *::before, .kyg-mh *::after { box-sizing: border-box; }
.kyg-mh ::selection { background: var(--eden); color: var(--spring); }
.kyg-mh img { display: block; max-width: 100%; }
.kyg-mh a { color: inherit; text-decoration: none; }
/* Inline icons default to a small size so they never balloon; specific
   contexts (buttons, badges) override below. */
.kyg-mh svg { width: 15px; height: 15px; flex: none; }
.kyg-mh .view svg { width: 13px; height: 13px; }
.kyg-mh__hero-imgcard .cap svg { width: 15px; height: 15px; }
.kyg-mh__signs-grid svg { width: 15px; height: 15px; margin-top: 1px; }
.kyg-mh__covers svg { width: 16px; height: 16px; margin-top: 1px; }
.kyg-mh__report-result .rl svg { width: 16px; height: 16px; }
.kyg-mh__trust-ico svg { width: 17px; height: 17px; }

/* ------- shell: sticky bundles sidebar + main ------- */
.kyg-mh__page { display: flex; flex-direction: column; align-items: center; }
.kyg-mh__shell { display: flex; width: 100%; max-width: 1400px; }
.kyg-mh__main { flex: 1; min-width: 0; }

/* ------- NAV ------- */
.kyg-mh__nav {
  position: sticky; top: 0; z-index: 40;
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  height: 72px; padding: 0 clamp(20px, 3.6vw, 52px);
  background: rgba(247, 244, 238, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--zeus-8);
  box-shadow: 0 6px 24px -16px rgba(14,77,75,.4);
}
.kyg-mh__brand { display: flex; align-items: center; gap: 9px; font-weight: 700; color: var(--eden); font-size: 17px; letter-spacing: -0.01em; }
.kyg-mh__brand img { height: 20px; width: auto; }
.kyg-mh__navlinks { display: flex; align-items: center; gap: 4px; }
.kyg-mh__navlinks a { padding: 8px 14px; border-radius: 9999px; font-weight: 500; font-size: 14px; color: var(--cape); transition: background .2s; }
.kyg-mh__navlinks a:hover { background: var(--zeus-8); }
@media (max-width: 1080px) { .kyg-mh__navlinks { display: none; } }

/* ------- buttons ------- */
.kyg-mh .btn {
  display: inline-flex; align-items: center; gap: 9px;
  border-radius: 9999px; font-weight: 700; cursor: pointer; border: none;
  position: relative; overflow: hidden; transition: transform .2s var(--e-out), box-shadow .2s;
  white-space: nowrap;
}
.kyg-mh .btn:hover { transform: translateY(-1px); }
.kyg-mh .btn svg, .kyg-mh .btn img { width: 17px; height: 17px; }
.kyg-mh .btn--eden { background: var(--eden); color: var(--spring); padding: 11px 18px; font-size: 13px; box-shadow: 0 10px 26px -8px rgba(14,77,75,.5); }
.kyg-mh .btn--java { background: var(--java); color: var(--bottle); padding: 15px 28px; font-size: 15.5px; box-shadow: 0 14px 34px -10px rgba(37,181,171,.5); }
.kyg-mh .btn--java-sm { background: var(--java); color: var(--bottle); padding: 12px 20px; font-size: 13.5px; }
/* sheen sweep */
.kyg-mh .btn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,.32) 50%, transparent 70%);
  transform: translateX(-120%); transition: transform .7s var(--e-out);
}
.kyg-mh .btn:hover::after { transform: translateX(120%); }

/* ------- eyebrow + section header ------- */
.kyg-mh .eyebrow { font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; font-size: 12.5px; color: var(--eden-2); }
.kyg-mh .sec-h2 { font-weight: 600; font-size: clamp(28px, 3.4vw, 40px); line-height: 1.1; letter-spacing: -0.022em; color: var(--mine); }
.kyg-mh .sec-head { display: flex; flex-direction: column; gap: 14px; }
.kyg-mh .sec-head .lead { color: var(--cape); font-size: 16px; line-height: 1.62; max-width: 760px; }

.kyg-mh section { padding: clamp(56px, 6vw, 84px) clamp(24px, 3.6vw, 48px); }
.kyg-mh .sec--alt { background: var(--pearl-40); border-top: 1px solid var(--zeus-9); border-bottom: 1px solid var(--zeus-9); }

/* ================= HERO ================= */
.kyg-mh__hero {
  position: relative; overflow: hidden;
  background: var(--bottle-hero); color: var(--spring);
  padding: clamp(48px, 5vw, 64px);
}
.kyg-mh__hero-blob { position: absolute; border-radius: 50%; filter: blur(32px); pointer-events: none; }
.kyg-mh__hero-blob.a { width: 520px; height: 520px; background: rgba(14,77,75,.5); top: -140px; left: -120px; }
.kyg-mh__hero-blob.b { width: 460px; height: 460px; background: rgba(37,181,171,.10); bottom: -160px; right: -100px; }
.kyg-mh__hero-grid { position: relative; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; }
.kyg-mh__hero-copy { display: flex; flex-direction: column; gap: 24px; }
.kyg-mh__badges { display: flex; flex-wrap: wrap; gap: 8px; }
.kyg-mh__badges span { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 9999px; background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.15); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11.5px; }
.kyg-mh__badges img { width: 16px; height: 16px; object-fit: contain; }
.kyg-mh__hero h1 { font-weight: 600; font-size: clamp(34px, 4.6vw, 52px); line-height: 1.05; letter-spacing: -0.03em; margin: 0; }
.kyg-mh__hero h1 .hl { color: var(--bermuda); }
.kyg-mh__anchor { font-weight: 600; font-size: clamp(30px, 3.4vw, 40px); letter-spacing: -0.025em; line-height: 1;
  background: linear-gradient(135deg, #F6F3ED 0%, #DBF1EE 30%, #86DAD0 55%, #25B5AB 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; width: fit-content; }
.kyg-mh__anchor-bar { width: 48px; height: 3px; border-radius: 4px; background: var(--java); }
.kyg-mh__hero-body { font-size: 16.5px; line-height: 1.6; color: rgba(246,243,237,.8); }
.kyg-mh__hero-body b { color: var(--spring); font-weight: 700; }
.kyg-mh__trust { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.kyg-mh__trust-tile { display: flex; align-items: center; gap: 11px; padding: 11px 14px; border-radius: var(--r-tile); background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.14); }
.kyg-mh__trust-ico { flex: none; width: 34px; height: 34px; border-radius: var(--r-chip); background: rgba(37,181,171,.2); display: grid; place-items: center; }
.kyg-mh__trust-ico svg { width: 17px; height: 17px; color: var(--bermuda); }
.kyg-mh__trust-tile .l1 { font-size: 13px; font-weight: 600; color: var(--spring); }
.kyg-mh__trust-tile .l2 { font-size: 11.5px; color: rgba(246,243,237,.6); }
.kyg-mh__hero-visual { display: flex; flex-direction: column; gap: 12px; }
.kyg-mh__hero-imgcard { position: relative; border-radius: 28px; overflow: hidden; box-shadow: var(--sh-deep); }
.kyg-mh__hero-imgcard img { width: 100%; height: 420px; object-fit: cover; }
.kyg-mh__hero-imgcard .cap { position: absolute; left: 16px; bottom: 14px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: rgba(246,243,237,.92); }
.kyg-mh__hero-imgcard .cap::before { content: ''; position: absolute; inset: 0; z-index: -1; }
.kyg-mh__hero-imgcard .grad { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(5,36,34,.7) 100%); pointer-events: none; }
.kyg-mh__hero-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.kyg-mh__hero-stats div { padding: 12px 10px; border-radius: var(--r-tile); background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.20); text-align: center; }
.kyg-mh__hero-stats .num { font-family: var(--ff-i); font-weight: 600; font-size: 20px; color: var(--bermuda); }
.kyg-mh__hero-stats .lab { font-size: 10.5px; color: rgba(246,243,237,.6); margin-top: 2px; }

/* ================= THREE PAINS ================= */
.kyg-mh__pains { display: flex; flex-direction: column; gap: 48px; }
.kyg-mh__pain { position: relative; background: #fff; border: 1px solid var(--zeus-9); border-radius: var(--r-pain); box-shadow: var(--sh-card); overflow: hidden; }
.kyg-mh__pain-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 6px; }
.kyg-mh__pain-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 34px; padding: 34px 36px 34px 40px; }
.kyg-mh__pain-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.kyg-mh__pain-ico { width: 46px; height: 46px; border-radius: 13px; display: grid; place-items: center; flex: none; }
.kyg-mh__pain-ico img { width: 26px; height: 30px; }
.kyg-mh__pain-label { font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; font-size: 12px; }
.kyg-mh__pain h3 { font-weight: 600; font-size: clamp(20px, 2.2vw, 26px); line-height: 1.25; letter-spacing: -0.025em; color: var(--mine); margin: 0 0 14px; }
.kyg-mh__pain-answer { font-size: 15px; line-height: 1.5; color: var(--cape); }
.kyg-mh__pain-answer b { color: var(--mine); }
.kyg-mh__pain-callout { margin-top: 16px; padding: 14px 16px; border-radius: var(--r-tile); font-size: 13.5px; line-height: 1.5; color: var(--cape); }
.kyg-mh__pain-testcard { border-radius: var(--r-tile); padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.kyg-mh__pain-testcard .checks-label { font-weight: 700; text-transform: uppercase; letter-spacing: 0.13em; font-size: 11px; color: var(--cord); }
.kyg-mh__pain-testcard .checks-body { font-size: 14px; line-height: 1.55; color: var(--cape); }
.kyg-mh__pain-testcard .sample { font-style: italic; font-size: 13.5px; line-height: 1.5; color: var(--cord); }
.kyg-mh__signs { margin-top: 18px; }
.kyg-mh__signs-title { font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11.5px; color: var(--cord); margin-bottom: 10px; }
.kyg-mh__signs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
.kyg-mh__signs-grid li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.4; color: var(--cape); list-style: none; }
.kyg-mh__signs-grid img { width: 16px; height: 16px; flex: none; margin-top: 2px; }

/* status badge */
.kyg-mh .badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 9999px; font-weight: 700; font-size: 12.5px; width: fit-content; }
.kyg-mh .badge img, .kyg-mh .badge svg { width: 14px; height: 14px; }
.kyg-mh .badge--good { background: var(--harp); color: var(--sea); }
.kyg-mh .badge--avg { background: var(--lusta); color: var(--mandalay); }
.kyg-mh .badge--poor { background: var(--poppy); color: #fff; box-shadow: 0 4px 12px -2px rgba(192,62,44,.5); }

/* pain accent families */
.kyg-mh__pain[data-acc="fertility"] .kyg-mh__pain-bar { background: var(--surfie); }
.kyg-mh__pain[data-acc="fertility"] .kyg-mh__pain-ico { background: var(--swans); }
.kyg-mh__pain[data-acc="fertility"] .kyg-mh__pain-label { color: var(--surfie); }
.kyg-mh__pain[data-acc="fertility"] .kyg-mh__pain-callout { background: rgba(14,124,119,.06); border: 1px solid rgba(14,124,119,.15); }
.kyg-mh__pain[data-acc="fertility"] .kyg-mh__pain-testcard { background: var(--harp); }
.kyg-mh__pain[data-acc="hormones"] .kyg-mh__pain-bar { background: var(--eden); }
.kyg-mh__pain[data-acc="hormones"] .kyg-mh__pain-ico { background: rgba(14,77,75,.08); }
.kyg-mh__pain[data-acc="hormones"] .kyg-mh__pain-label { color: var(--eden); }
.kyg-mh__pain[data-acc="hormones"] .kyg-mh__pain-callout { background: rgba(14,77,75,.05); border: 1px solid var(--athens); }
.kyg-mh__pain[data-acc="hormones"] .kyg-mh__pain-testcard { background: var(--harp); }
.kyg-mh__pain[data-acc="hairloss"] .kyg-mh__pain-bar { background: var(--mojo); }
.kyg-mh__pain[data-acc="hairloss"] .kyg-mh__pain-ico { background: var(--linen); }
.kyg-mh__pain[data-acc="hairloss"] .kyg-mh__pain-label { color: var(--mojo); }
.kyg-mh__pain[data-acc="hairloss"] .kyg-mh__pain-callout { background: rgba(192,67,47,.06); border: 1px solid rgba(192,67,47,.15); }
.kyg-mh__pain[data-acc="hairloss"] .kyg-mh__pain-testcard { background: rgba(251,230,224,.4); }

/* ================= STAT ================= */
.kyg-mh__stat { padding: clamp(28px, 4vw, 48px); }
.kyg-mh__stat-inner { position: relative; overflow: hidden; border-radius: 32px; color: var(--spring); padding: clamp(36px, 4.5vw, 56px); box-shadow: var(--sh-deep);
  background: linear-gradient(163deg, #0E4D4B 0%, #0A3B39 55%, #052422 100%); }
.kyg-mh__stat-grid { position: relative; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 40px; align-items: center; }
.kyg-mh__stat-quote { font-weight: 600; font-size: clamp(30px, 3.6vw, 42px); line-height: 1.12; letter-spacing: -0.02em; }
.kyg-mh__stat-sub { font-weight: 500; font-size: clamp(18px, 2vw, 24px); line-height: 1.35; margin-top: 14px; }
.kyg-mh__stat-sub b { color: var(--bermuda); }
.kyg-mh__stat-emph { font-style: italic; font-size: 22px; color: var(--bermuda); margin-top: 10px; }
.kyg-mh__stat-body { font-size: 15.5px; line-height: 1.6; color: rgba(246,243,237,.8); margin-top: 20px; }
.kyg-mh__stat-card { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.16); border-radius: var(--r-card); padding: 28px; backdrop-filter: blur(6px); display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
.kyg-mh__stat-big { font-family: var(--ff-i); font-weight: 600; font-size: clamp(48px, 6vw, 64px); line-height: 1; color: var(--java); }
.kyg-mh__stat-card .cap { font-size: 15px; color: rgba(246,243,237,.85); }
.kyg-mh__stat-fine { font-weight: 600; font-size: 13.5px; color: var(--bermuda); }

/* ================= SAMPLE REPORT ================= */
.kyg-mh__report-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 34px; }
.kyg-mh__report-card { position: relative; background: #fff; border-radius: var(--r-card); border: 1px solid var(--zeus-9); box-shadow: var(--sh-card); padding: 24px; padding-top: 28px; overflow: hidden; display: flex; flex-direction: column; gap: 12px; }
.kyg-mh__report-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; }
.kyg-mh__report-card[data-tone="good"]::before { background: var(--sea); }
.kyg-mh__report-card[data-tone="poor"]::before { background: var(--poppy); box-shadow: 0 0 0 1px rgba(192,62,44,.15); }
.kyg-mh__report-card h4 { font-weight: 600; font-size: 19px; letter-spacing: -0.02em; margin: 0; color: var(--mine); }
.kyg-mh__report-card .what { font-weight: 700; text-transform: uppercase; letter-spacing: 0.13em; font-size: 11px; color: var(--cord); }
.kyg-mh__report-card .desc { font-size: 14px; line-height: 1.55; color: var(--cape); }
.kyg-mh__report-result { border-radius: var(--r-chip); padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
.kyg-mh__report-result[data-tone="good"] { background: var(--harp); border: 1px solid rgba(46,125,91,.2); }
.kyg-mh__report-result[data-tone="poor"] { background: var(--oldlace); border: 1px solid rgba(192,62,44,.25); }
.kyg-mh__report-result .rl { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.kyg-mh__report-result[data-tone="good"] .rl { color: var(--sea); }
.kyg-mh__report-result[data-tone="poor"] .rl { color: var(--poppy); }
.kyg-mh__report-result .rl .big { font-size: 15px; letter-spacing: 0.02em; }
.kyg-mh__report-result .rl .sub { font-size: 12.5px; font-weight: 600; opacity: .85; }
.kyg-mh__report-result .note { font-style: italic; font-size: 13px; line-height: 1.5; color: var(--cape); }

.kyg-mh__legend { margin-top: 34px; }
.kyg-mh__legend h3 { font-weight: 600; font-size: 20px; letter-spacing: -0.02em; margin: 0 0 16px; }
.kyg-mh__legend-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.kyg-mh__legend-card { border-radius: var(--r-tile); padding: 18px; }
.kyg-mh__legend-card[data-tone="good"] { background: var(--harp); }
.kyg-mh__legend-card[data-tone="avg"] { background: var(--lusta); }
.kyg-mh__legend-card[data-tone="poor"] { background: var(--oldlace); }
.kyg-mh__legend-card .lh { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
.kyg-mh__legend-card .lh .lab { font-weight: 700; font-size: 16px; }
.kyg-mh__legend-card .lh .sub { font-size: 12.5px; font-weight: 600; opacity: .8; }
.kyg-mh__legend-card[data-tone="good"] .lab, .kyg-mh__legend-card[data-tone="good"] .sub { color: var(--sea); }
.kyg-mh__legend-card[data-tone="avg"] .lab, .kyg-mh__legend-card[data-tone="avg"] .sub { color: var(--mandalay); }
.kyg-mh__legend-card[data-tone="poor"] .lab, .kyg-mh__legend-card[data-tone="poor"] .sub { color: var(--poppy); }
.kyg-mh__legend-card p { font-size: 13.5px; line-height: 1.5; color: var(--cape); margin: 0; }

/* ================= HOW IT WORKS ================= */
.kyg-mh__how-img { width: 100%; height: clamp(280px, 33vw, 479px); object-fit: cover; border-radius: 31px; margin: 28px 0; box-shadow: var(--sh-card); }
.kyg-mh__steps { display: flex; flex-direction: column; gap: 16px; }
.kyg-mh__step { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: start; background: #fff; border-radius: 22px; border: 1px solid var(--zeus-9); box-shadow: var(--sh-card); padding: 24px 28px; }
.kyg-mh__step-num { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.kyg-mh__step-num .n { font-family: var(--ff-i); font-weight: 600; font-size: 26px; color: var(--eden); line-height: 1; }
.kyg-mh__step-num .chip { width: 44px; height: 44px; border-radius: 13px; background: rgba(14,77,75,.07); display: grid; place-items: center; }
.kyg-mh__step-num .chip img { width: 25px; height: 28px; }
.kyg-mh__step h3 { font-weight: 600; font-size: 18px; line-height: 1.35; letter-spacing: -0.025em; margin: 0 0 4px; }
.kyg-mh__step .sub { font-weight: 600; font-size: 13.5px; color: var(--java); margin-bottom: 8px; }
.kyg-mh__step .body { font-size: 14.5px; line-height: 1.6; color: var(--cape); }
.kyg-mh__step[data-dark="true"] { background: linear-gradient(178deg, #0E4D4B 0%, #0A3B39 100%); border: none; color: var(--spring); box-shadow: var(--sh-dark); }
.kyg-mh__step[data-dark="true"] .n { color: var(--bermuda); }
.kyg-mh__step[data-dark="true"] .chip { background: rgba(134,218,208,.15); }
.kyg-mh__step[data-dark="true"] .sub { color: var(--bermuda); }
.kyg-mh__step[data-dark="true"] .body { color: rgba(246,243,237,.82); }
.kyg-mh__how-cta { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; margin-top: 28px; }
.kyg-mh__fine { font-size: 13px; color: var(--cord); }

/* ================= GENEous CARE ================= */
.kyg-mh__care-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: start; }
.kyg-mh__care-lead { font-weight: 500; font-size: 19px; line-height: 1.5; color: var(--eden); margin-top: 6px; }
.kyg-mh__care-body { font-size: 16px; line-height: 1.62; color: var(--cape); margin-top: 14px; }
.kyg-mh__care-minis { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.kyg-mh__care-mini { background: #fff; border: 1px solid var(--zeus-9); border-radius: var(--r-tile); padding: 16px 18px; box-shadow: var(--sh-card); }
.kyg-mh__care-mini h4 { font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11.5px; color: var(--eden-2); margin: 0 0 6px; }
.kyg-mh__care-mini p { font-size: 14px; line-height: 1.55; color: var(--cape); margin: 0; }
.kyg-mh__care-quote { font-weight: 600; font-style: italic; font-size: clamp(22px, 2.6vw, 28px); line-height: 1.5; letter-spacing: -0.025em; color: var(--eden); margin-top: 28px; }
.kyg-mh__chat { background: #fff; border-radius: var(--r-pain); box-shadow: var(--sh-dark); overflow: hidden; }
.kyg-mh__chat-head { background: var(--eden); color: var(--spring); padding: 16px 20px; display: flex; flex-direction: column; gap: 2px; }
.kyg-mh__chat-head .t { font-weight: 700; font-size: 15px; }
.kyg-mh__chat-head .s { font-size: 12px; color: var(--bermuda); }
.kyg-mh__chat-body { background: var(--pearl-50); padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.kyg-mh__bubble { max-width: 82%; padding: 12px 14px; font-size: 13.5px; line-height: 1.5; box-shadow: var(--sh-card); }
.kyg-mh__bubble.them { align-self: flex-start; background: #fff; border-radius: 6px 16px 16px 16px; color: var(--cape); }
.kyg-mh__bubble.me { align-self: flex-end; background: var(--eden); color: var(--spring); border-radius: 16px 6px 16px 16px; }
.kyg-mh__covers { margin: 20px; background: rgba(14,77,75,.05); border-radius: 22px; padding: 18px 20px; }
.kyg-mh__covers h4 { font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11.5px; color: var(--eden-2); margin: 0 0 12px; }
.kyg-mh__covers li { display: flex; gap: 10px; font-size: 13.5px; line-height: 1.5; color: var(--cape); list-style: none; margin-bottom: 10px; }
.kyg-mh__covers li:last-child { margin-bottom: 0; }
.kyg-mh__covers img { width: 18px; height: 18px; flex: none; margin-top: 1px; }
.kyg-mh__covers b { color: var(--mine); }

/* ================= TRUST ================= */
.kyg-mh__trust-head { max-width: 760px; }
.kyg-mh__cert-strip { background: #fff; border-radius: 20px; border: 1px solid var(--zeus-9); box-shadow: var(--sh-card); padding: 22px; margin-top: 28px; display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
.kyg-mh__cert-tile { border: 1px solid rgba(14,77,75,.1); border-radius: var(--r-chip); padding: 14px 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 120px; flex: 1; }
.kyg-mh__cert-tile img, .kyg-mh__cert-tile svg { height: 40px; width: auto; max-width: 90px; object-fit: contain; }
.kyg-mh__cert-tile .lbl { font-size: 10.5px; font-weight: 600; color: var(--cord); text-align: center; }
.kyg-mh__cert-table { background: #fff; border-radius: var(--r-card); border: 1px solid var(--zeus-9); box-shadow: var(--sh-card); margin-top: 20px; padding: 8px 28px; }
.kyg-mh__cert-row { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 28px; padding: 20px 0; border-bottom: 1px solid var(--zeus-9); }
.kyg-mh__cert-row:last-child { border-bottom: none; }
.kyg-mh__cert-row .rl { font-weight: 600; font-size: 15px; color: var(--mine); }
.kyg-mh__cert-row .rd { font-size: 14px; line-height: 1.55; color: var(--cape); }
.kyg-mh__expert { margin-top: 20px; border-radius: var(--r-card); padding: 28px; color: var(--spring); box-shadow: var(--sh-dark);
  background: linear-gradient(160deg, #0E4D4B 0%, #0A3B39 100%); display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: start; }
.kyg-mh__expert .vs { width: 56px; height: 56px; border-radius: 14px; background: var(--bermuda); color: var(--bottle); font-weight: 700; font-size: 18px; display: grid; place-items: center; }
.kyg-mh__expert .name { font-weight: 600; font-size: 18px; }
.kyg-mh__expert .name .role { color: var(--bermuda); font-weight: 500; }
.kyg-mh__expert .lab { font-size: 13px; color: rgba(246,243,237,.7); margin: 2px 0 12px; }
.kyg-mh__expert .body { font-size: 15px; line-height: 1.55; color: rgba(246,243,237,.9); }
.kyg-mh__expert .acc { font-size: 13px; color: var(--bermuda); margin-top: 10px; }

/* ================= FAQ ================= */
.kyg-mh__faqs { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }
.kyg-mh__faq { background: #fff; border: 1px solid var(--zeus-9); border-radius: 18px; overflow: hidden; }
.kyg-mh__faq summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 14px; padding: 20px 24px; font-weight: 600; font-size: 16.5px; color: var(--mine); }
.kyg-mh__faq summary::-webkit-details-marker { display: none; }
.kyg-mh__faq-ico { flex: none; width: 30px; height: 30px; border-radius: 9999px; background: rgba(14,77,75,.07); display: grid; place-items: center; color: var(--eden); font-size: 18px; transition: transform .25s; }
.kyg-mh__faq[open] .kyg-mh__faq-ico { transform: rotate(45deg); }
.kyg-mh__faq p { padding: 0 24px 22px 68px; font-size: 14.5px; line-height: 1.62; color: var(--cape); margin: 0; }

/* ================= BUNDLES + FINAL CTA ================= */
.kyg-mh__bundles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 34px; }
.kyg-mh__bundle { border-radius: var(--r-pain); padding: 26px; display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; }
.kyg-mh__bundle[data-theme="recommended"] { background: linear-gradient(130deg, #0E4D4B 0%, #0A3B39 100%); color: var(--spring); box-shadow: var(--sh-ring-java); }
.kyg-mh__bundle[data-theme="complete"], .kyg-mh__bundle[data-theme="couple"] { background: #fff; border: 1px solid var(--zeus-9); box-shadow: var(--sh-card); }
.kyg-mh__bundle-top { position: absolute; top: 0; left: 0; right: 0; height: 5px; }
.kyg-mh__bundle[data-theme="complete"] .kyg-mh__bundle-top { background: linear-gradient(90deg, #25B5AB, #2AC3A2); }
.kyg-mh__bundle[data-theme="couple"] .kyg-mh__bundle-top { background: linear-gradient(90deg, #0E7C77, #C0432F); }
.kyg-mh__bundle-badge { align-self: flex-start; padding: 5px 12px; border-radius: 9999px; font-weight: 700; font-size: 11.5px; background: var(--java); color: var(--bottle); }
.kyg-mh__bundle-ico { width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center; background: rgba(255,255,255,.12); }
.kyg-mh__bundle[data-theme="complete"] .kyg-mh__bundle-ico, .kyg-mh__bundle[data-theme="couple"] .kyg-mh__bundle-ico { background: rgba(14,77,75,.07); }
.kyg-mh__bundle-ico img { width: 22px; height: 26px; }
.kyg-mh__bundle h4 { font-weight: 600; font-size: 20px; letter-spacing: -0.02em; margin: 0; }
.kyg-mh__bundle .subtitle { font-size: 13px; font-weight: 600; opacity: .7; }
.kyg-mh__bundle .desc { font-size: 14px; line-height: 1.55; opacity: .92; }
.kyg-mh__bundle[data-theme="recommended"] .desc { color: rgba(246,243,237,.85); }
.kyg-mh__bundle .bestfor { font-size: 12.5px; line-height: 1.45; padding: 10px 12px; border-radius: var(--r-chip); background: rgba(0,0,0,.05); margin-top: auto; }
.kyg-mh__bundle[data-theme="recommended"] .bestfor { background: rgba(255,255,255,.08); color: rgba(246,243,237,.85); }
.kyg-mh__bundle .btn { margin-top: 4px; align-self: flex-start; }

.kyg-mh__finalcta { margin-top: 36px; border-radius: 34px; text-align: center; color: var(--spring); padding: clamp(48px, 6vw, 68px) clamp(28px, 9vw, 132px);
  background: linear-gradient(167deg, #0E4D4B 0%, #0A3B39 55%, #052422 100%); box-shadow: var(--sh-deep); display: flex; flex-direction: column; align-items: center; gap: 20px; }
.kyg-mh__finalcta h2 { font-weight: 600; font-size: clamp(30px, 4.4vw, 50px); line-height: 1.08; letter-spacing: -0.025em; margin: 0; }
.kyg-mh__finalcta .sub { font-size: 17px; line-height: 1.55; color: rgba(246,243,237,.85); max-width: 640px; }
.kyg-mh__finalcta .fine { font-size: 13px; color: rgba(246,243,237,.6); }
.kyg-mh__finalcta .fine.bermuda { color: var(--bermuda); }

/* ================= SIDEBAR (bundles) ================= */
.kyg-mh__sidebar { width: 320px; flex: none; align-self: flex-start; position: sticky; top: 72px; max-height: calc(100vh - 72px); overflow-y: auto;
  padding: 28px 20px; display: flex; flex-direction: column; gap: 20px; background: var(--pearl-50); border-right: 1px solid var(--zeus-9); }
.kyg-mh__sidebar .eyebrow { color: var(--eden-2); }
.kyg-mh__sidebar .intro { font-size: 13px; line-height: 1.5; color: var(--cord); }
.kyg-mh__side-bundle { border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 8px; }
.kyg-mh__side-bundle[data-theme="recommended"] { background: linear-gradient(154deg, #0E4D4B, #0A3B39); color: var(--spring); box-shadow: var(--sh-ring-java); }
.kyg-mh__side-bundle[data-theme="complete"], .kyg-mh__side-bundle[data-theme="couple"] { background: #fff; border: 1px solid var(--zeus-9); }
.kyg-mh__side-bundle .b-badge { align-self: flex-start; padding: 3px 10px; border-radius: 9999px; font-weight: 700; font-size: 10.5px; background: var(--java); color: var(--bottle); }
.kyg-mh__side-bundle h4 { font-weight: 600; font-size: 16px; margin: 0; letter-spacing: -0.01em; }
.kyg-mh__side-bundle .st { font-size: 12px; font-weight: 600; opacity: .7; }
.kyg-mh__side-bundle .ds { font-size: 12.5px; line-height: 1.45; opacity: .9; }
.kyg-mh__side-bundle[data-theme="recommended"] .ds { color: rgba(246,243,237,.82); }
.kyg-mh__side-bundle .view { display: inline-flex; align-items: center; gap: 5px; font-weight: 700; font-size: 12.5px; margin-top: 2px; }
.kyg-mh__side-bundle[data-theme="recommended"] .view { color: var(--bermuda); }
.kyg-mh__side-bundle[data-theme="complete"] .view, .kyg-mh__side-bundle[data-theme="couple"] .view { color: var(--eden); }
.kyg-mh__side-note { background: rgba(14,77,75,.05); border-radius: 18px; padding: 14px 16px; font-size: 12.5px; line-height: 1.5; color: var(--cape); }
.kyg-mh__side-note b { color: var(--eden); }

/* collapse toggle + collapsed layout (main takes max width) */
.kyg-mh__side-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.kyg-mh__collapse { flex: none; width: 30px; height: 30px; border-radius: 9px; border: 1px solid var(--zeus-9); background: #fff; color: var(--eden); cursor: pointer; display: grid; place-items: center; transition: background .2s, transform .2s; }
.kyg-mh__collapse:hover { background: rgba(14,77,75,.06); }
.kyg-mh__collapse svg { width: 16px; height: 16px; }
.kyg-mh__reopen { position: sticky; top: 84px; align-self: flex-start; flex: none; margin: 20px 0 0 10px; width: 36px; height: 42px; border-radius: 11px; border: 1px solid var(--zeus-9); background: #fff; color: var(--eden); cursor: pointer; display: grid; place-items: center; box-shadow: var(--sh-card); z-index: 6; }
.kyg-mh__reopen svg { width: 16px; height: 16px; }
.kyg-mh__reopen:hover { background: rgba(14,77,75,.06); }
.kyg-mh__shell.is-collapsed { max-width: 1560px; }
.kyg-mh__shell.is-collapsed .kyg-mh__sidebar { display: none; }
@media (max-width: 980px) {
  .kyg-mh__collapse, .kyg-mh__reopen { display: none; }
}

/* ================= reveal + responsive ================= */
.kyg-mh .reveal { opacity: 0; transform: translateY(20px); transition: opacity .7s var(--e-out), transform .7s var(--e-out); }
.kyg-mh .reveal.is-in { opacity: 1; transform: none; }

@media (max-width: 980px) {
  .kyg-mh__shell { flex-direction: column; }
  .kyg-mh__sidebar { width: 100%; position: static; max-height: none; border-right: none; border-bottom: 1px solid var(--zeus-9); flex-direction: row; flex-wrap: wrap; }
  .kyg-mh__side-bundle { flex: 1; min-width: 240px; }
  .kyg-mh__hero-grid, .kyg-mh__stat-grid, .kyg-mh__care-grid { grid-template-columns: 1fr; }
  .kyg-mh__pain-grid { grid-template-columns: 1fr; }
  .kyg-mh__report-cards, .kyg-mh__legend-grid, .kyg-mh__bundles { grid-template-columns: 1fr; }
  .kyg-mh__cert-row { grid-template-columns: 1fr; gap: 8px; }
}
@media (max-width: 680px) {
  .kyg-mh__hero-stats, .kyg-mh__trust { grid-template-columns: 1fr 1fr; }
  .kyg-mh__signs-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .kyg-mh .reveal { opacity: 1; transform: none; transition: none; }
  .kyg-mh .btn::after { display: none; }
}
`;

export default function TestPageStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

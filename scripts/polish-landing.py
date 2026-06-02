"""
Polish pass for app/(landing)/page.tsx:

  1. Hero image jitter — the parallax JS sets `transform` to sub-pixel values
     (toFixed(2)). On Chrome/Windows that can produce micro-jitter during
     scroll because the compositor and main thread fight over fractional
     pixel positions. Switch to whole-pixel rounding and add baseline GPU
     hints (backface-visibility + translateZ baseline + contain) so the
     image gets its own compositor layer.

  2. Mobile menu — the burger button exists in the JSX with id="burger"
     but has no click handler. Add a JS toggle that flips an
     `is-menu-open` class on .nav, plus the CSS that turns .nav__links
     into a full-height overlay on small screens.

  3. Targeted responsive overrides — fill the gaps left by the existing
     media queries on phones (≤560px and ≤420px):
        - hero copy tightens
        - section padding reduces
        - tests/bundles grids collapse cleanly
        - typography scales without overflow

All new CSS lives in a NEW const (KYG_POLISH_CSS) rendered as a third
<style> tag. Existing KYG_PAGE_CSS and KYG_TESTS_CSS are untouched, so
this script is idempotent and reversible.

Run once from the repo root:
  python scripts/polish-landing.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / "app" / "(landing)" / "page.tsx"

page = PAGE.read_text(encoding="utf-8")

# ----------------------------------------------------------------------------
# 1. Hero image jitter — switch parallax JS from .toFixed(2) sub-pixel writes
#    to integer pixels. The "if (heroImg)" block lives inside the existing
#    useEffect IIFE.
# ----------------------------------------------------------------------------
needle = "heroImg.style.transform = `translate3d(0, ${o.toFixed(2)}px, 0) scale(1.04)`;"
replacement = (
    "// Whole-pixel rounding stops the sub-pixel jitter the compositor\n"
    "          // produces when transform values change by fractional amounts\n"
    "          // every scroll tick on high-refresh displays.\n"
    "          heroImg.style.transform = `translate3d(0, ${Math.round(o)}px, 0) scale(1.04)`;"
)
if needle not in page:
    raise SystemExit("hero parallax line not found — already polished, or layout changed.")
page = page.replace(needle, replacement, 1)

# Also round the regular .parallax elements to integers for consistency.
needle2 = "el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;"
replacement2 = "el.style.transform = `translate3d(0, ${Math.round(offset)}px, 0)`;"
if needle2 in page:
    page = page.replace(needle2, replacement2, 1)

# ----------------------------------------------------------------------------
# 2. Add a mobile-menu toggle just before the IIFE close. Reuses the
#    existing `})();` anchor pattern.
# ----------------------------------------------------------------------------
iife_anchor = "      }\n    })();"
if iife_anchor not in page:
    raise SystemExit("Could not find IIFE close in useEffect.")

mobile_menu_js = """
      // ===== Mobile menu (burger button) =====
      const burgerBtn = document.getElementById('burger');
      const navEl     = document.getElementById('nav');
      if (burgerBtn && navEl) {
        const setOpen = (open) => {
          navEl.classList.toggle('is-menu-open', open);
          burgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
          // Lock body scroll while the overlay menu is open.
          document.documentElement.style.overflow = open ? 'hidden' : '';
        };
        burgerBtn.addEventListener('click', () => {
          setOpen(!navEl.classList.contains('is-menu-open'));
        });
        // Close on link click + Escape, so the overlay doesn't trap focus.
        navEl.querySelectorAll('.nav__link, .nav__cta a, .megamenu a').forEach((el) => {
          el.addEventListener('click', () => setOpen(false));
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && navEl.classList.contains('is-menu-open')) setOpen(false);
        });
        // Auto-close on resize past mobile breakpoint.
        window.addEventListener('resize', () => {
          if (window.innerWidth > 720 && navEl.classList.contains('is-menu-open')) setOpen(false);
        });
      }
"""
page = page.replace(iife_anchor, mobile_menu_js + "\n" + iife_anchor, 1)

# ----------------------------------------------------------------------------
# 3. Inject a third <style> tag with the polish CSS. Add the const near the
#    other two and the <style> tag next to its siblings.
# ----------------------------------------------------------------------------
POLISH_CSS = r"""/* =============================================================
   Polish pass — jitter fix, mobile menu overlay, responsive
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

/* ---------- Mobile menu overlay ---------- */
@media (max-width: 720px) {
  .kyg-page .nav__links {
    position: fixed;
    top: 68px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 4px;
    padding: 28px var(--gutter) 40px;
    background: rgba(250, 246, 239, 0.98);
    backdrop-filter: blur(22px) saturate(140%);
    -webkit-backdrop-filter: blur(22px) saturate(140%);
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-12px);
    transition: opacity 0.35s var(--e-out), transform 0.35s var(--e-out), visibility 0.35s;
    pointer-events: none;
  }
  .kyg-page .nav.is-menu-open .nav__links {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }
  .kyg-page .nav__item {
    width: 100%;
  }
  .kyg-page .nav__link {
    width: 100%;
    justify-content: space-between;
    padding: 14px 18px;
    font-size: 16px;
    border-radius: 14px;
  }
  /* Megamenu inside mobile overlay — stack as a simple list. */
  .kyg-page .megamenu {
    position: static;
    background: transparent;
    backdrop-filter: none;
    box-shadow: none;
    border: 0;
    opacity: 1;
    visibility: visible;
    transform: none;
    pointer-events: auto;
  }
  .kyg-page .megamenu__inner {
    grid-template-columns: 1fr;
    padding: 12px 0 8px;
    gap: 12px;
  }
  .kyg-page .megamenu__head {
    grid-column: 1 / -1;
    padding-bottom: 10px;
    margin-bottom: 4px;
  }
  .kyg-page .mm-card {
    aspect-ratio: 16 / 9;
  }
  /* Burger animates into an X when open. */
  .kyg-page .nav.is-menu-open .nav__burger span {
    background: transparent;
  }
  .kyg-page .nav.is-menu-open .nav__burger span::before {
    top: 0;
    transform: rotate(45deg);
  }
  .kyg-page .nav.is-menu-open .nav__burger span::after {
    top: 0;
    transform: rotate(-45deg);
  }
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

/* Respect reduced-motion preferences — disable parallax animations. */
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
"""

# Add the const after KYG_TESTS_CSS const declaration.
tests_anchor = "const KYG_TESTS_CSS = `"
if tests_anchor not in page:
    raise SystemExit("KYG_TESTS_CSS anchor not found — run inject-tests-section.py first.")
# Find end of the tests const (closing `;`) and append the polish const after it.
# Anchor: the literal string sequence used at the end of the template.
tests_end_marker = "`;\n\nfunction NavAuthCta"
if tests_end_marker not in page:
    raise SystemExit("KYG_TESTS_CSS end marker not found — script needs adjustment.")
escaped_polish = (
    POLISH_CSS.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
)
new_const_block = (
    "`;\n\n"
    "// Polish layer — see scripts/polish-landing.py. Loaded last so it wins\n"
    "// the cascade on ties (hero jitter fix, mobile menu, responsive gaps).\n"
    "const KYG_POLISH_CSS = `" + escaped_polish + "`;\n\n"
    "function NavAuthCta"
)
page = page.replace(tests_end_marker, new_const_block, 1)

# Add the <style> tag next to the other two.
existing_styles = (
    '<style dangerouslySetInnerHTML={{ __html: KYG_PAGE_CSS }} />\n'
    '      <style dangerouslySetInnerHTML={{ __html: KYG_TESTS_CSS }} />'
)
if existing_styles not in page:
    raise SystemExit("Existing dual <style> block not found — script needs adjustment.")
page = page.replace(
    existing_styles,
    existing_styles
    + '\n      <style dangerouslySetInnerHTML={{ __html: KYG_POLISH_CSS }} />',
    1,
)

PAGE.write_text(page, encoding="utf-8")
print(f"page.tsx patched: {len(page)} bytes")
print(f"  + KYG_POLISH_CSS: {len(POLISH_CSS)} chars")
print(f"  + parallax rounded to integer pixels")
print(f"  + mobile menu burger handler added")

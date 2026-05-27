"""
Converts kyg.html in the project root into a Next.js page + CSS + asset files.

Outputs:
  app/(landing)/page.tsx        — React (client) component with the body as JSX,
                                   wrapped in <div className="kyg-page"> and an
                                   auth-aware NavAuthCta block.
  app/(landing)/landing.css     — Styles, scoped under .kyg-page so nothing
                                   leaks out of the landing route. Includes
                                   font wiring + responsive overrides.
  public/kyg/<hash>.<ext>       — Each embedded base64 image, deduped.

Run from the project root:
  python scripts/convert-kyg.py
"""
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "kyg.html"
OUT_PAGE = ROOT / "app" / "(landing)" / "page.tsx"
OUT_CSS = ROOT / "app" / "(landing)" / "landing.css"
ASSETS_DIR = ROOT / "public" / "kyg"
PUBLIC_PREFIX = "/kyg"
SCOPE = ".kyg-page"

html = SRC.read_text(encoding="utf-8")

# --- Extract style block ---
style_match = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
styles = style_match.group(1).strip()

# --- Extract body content (excluding script) ---
body_match = re.search(r"<body>(.*?)<script>", html, re.DOTALL)
body = body_match.group(1)

# --- Extract script content ---
script_match = re.search(r"<script>(.*?)</script>", html, re.DOTALL)
script = script_match.group(1).strip()

# ---------- Extract embedded base64 images to /public/kyg ----------
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
import base64

def _ext_for(mime: str) -> str:
    mime = mime.lower()
    if mime in ("jpeg", "jpg"):
        return "jpg"
    if mime == "svg+xml":
        return "svg"
    return mime  # png, webp, gif

def extract_base64_to_file(m: re.Match) -> str:
    mime = m.group(1)
    data_b64 = m.group(2)
    try:
        data = base64.b64decode(data_b64, validate=False)
    except Exception:
        return m.group(0)
    digest = hashlib.sha1(data).hexdigest()[:12]
    ext = _ext_for(mime)
    fname = f"{digest}.{ext}"
    out_path = ASSETS_DIR / fname
    if not out_path.exists():
        out_path.write_bytes(data)
    return f"{PUBLIC_PREFIX}/{fname}"

# Only replace inside src=, srcset=, href=, or url(...) attributes
body = re.sub(
    r'data:image/([a-zA-Z+]+);base64,([A-Za-z0-9+/=]+)',
    extract_base64_to_file,
    body,
)
# Also strip base64 from styles (favicon etc lives in head, not styles, but be safe)
styles = re.sub(
    r'data:image/([a-zA-Z+]+);base64,([A-Za-z0-9+/=]+)',
    extract_base64_to_file,
    styles,
)


# ---------- HTML -> JSX transformations ----------
def transform_to_jsx(text: str) -> str:
    # HTML comments -> JSX comments
    def comment_repl(m):
        inner = m.group(1).replace("*/", "* /")
        return "{/*" + inner + "*/}"
    text = re.sub(r"<!--(.*?)-->", comment_repl, text, flags=re.DOTALL)

    # Attribute renames
    attr_map = {
        "class": "className",
        "for": "htmlFor",
        "tabindex": "tabIndex",
        "readonly": "readOnly",
        "maxlength": "maxLength",
        "minlength": "minLength",
        "autocomplete": "autoComplete",
        "autocapitalize": "autoCapitalize",
        "autofocus": "autoFocus",
        "spellcheck": "spellCheck",
        "crossorigin": "crossOrigin",
        "stroke-width": "strokeWidth",
        "stroke-linecap": "strokeLinecap",
        "stroke-linejoin": "strokeLinejoin",
        "stroke-miterlimit": "strokeMiterlimit",
        "stroke-dasharray": "strokeDasharray",
        "stroke-dashoffset": "strokeDashoffset",
        "stroke-opacity": "strokeOpacity",
        "fill-opacity": "fillOpacity",
        "fill-rule": "fillRule",
        "clip-rule": "clipRule",
        "clip-path": "clipPath",
        "font-size": "fontSize",
        "font-family": "fontFamily",
        "font-weight": "fontWeight",
        "text-anchor": "textAnchor",
        "stop-color": "stopColor",
        "stop-opacity": "stopOpacity",
        "xlink:href": "xlinkHref",
        "xmlns:xlink": "xmlnsXlink",
        "color-interpolation-filters": "colorInterpolationFilters",
        "flood-color": "floodColor",
        "flood-opacity": "floodOpacity",
        "marker-end": "markerEnd",
        "marker-mid": "markerMid",
        "marker-start": "markerStart",
        "preserveaspectratio": "preserveAspectRatio",
    }
    for old, new in attr_map.items():
        text = re.sub(
            r'(?<=[\s<])' + re.escape(old) + r'(?==)',
            new,
            text,
        )

    void_tags = ["img", "br", "hr", "input", "source", "area", "base", "col", "embed", "link", "meta", "param", "track", "wbr"]
    for tag in void_tags:
        text = re.sub(
            r'<' + tag + r'(\s[^>]*?)(?<!/)>',
            r'<' + tag + r'\1 />',
            text,
        )
        text = re.sub(
            r'<' + tag + r'>',
            r'<' + tag + r' />',
            text,
        )

    def style_repl(m):
        s = m.group(1)
        parts = [p.strip() for p in s.split(";") if p.strip()]
        obj = []
        for p in parts:
            if ":" not in p:
                continue
            k, v = p.split(":", 1)
            k = k.strip()
            v = v.strip()
            if k.startswith("--"):
                key_repr = repr(k)
            else:
                key_repr = repr(re.sub(r"-([a-z])", lambda x: x.group(1).upper(), k))
            obj.append(f"{key_repr}: {repr(v)}")
        return "style={{" + ", ".join(obj) + "} as React.CSSProperties}"

    text = re.sub(r'style="([^"]*)"', style_repl, text)
    text = re.sub(r'\bonsubmit="[^"]*"', 'onSubmit={(e) => e.preventDefault()}', text)
    text = re.sub(r'\bonclick="[^"]*"', '', text)
    return text


body_jsx = transform_to_jsx(body)

# Replace the static nav cta block (Talk to an Expert + Order Kit + burger) with
# a placeholder we'll swap for <NavAuthCta /> below. Matches the converted JSX.
nav_cta_pattern = re.compile(
    r'<div className="nav__cta">.*?</div>\s*</div>\s*</header>',
    re.DOTALL,
)
# We only want to replace the inner cta, keep the outer </div></header> structure.
# Looser pattern: match just the inner block we generated.
inner_cta = re.compile(
    r'<div className="nav__cta">.*?<button className="nav__burger"[^>]*><span></span></button>\s*</div>',
    re.DOTALL,
)
body_jsx, n = inner_cta.subn('<NavAuthCta />', body_jsx)
if n != 1:
    print(f"WARN: nav__cta block replaced {n} times (expected 1). Check kyg.html structure.")

# Restructure the hero heading into two explicit lines so we can style the
# black line and the gradient line independently and keep them on exactly one
# row each at desktop widths.
hero_h_pattern = re.compile(
    r'<h1 className="hero__h">\s*Your body already carries\s*<em><span className="grad-text">clues about your future\.</span></em>\s*</h1>',
    re.DOTALL,
)
hero_h_new = (
    '<h1 className="hero__h">\n'
    '          <span className="hero__h-line">Your body already carries</span>\n'
    '          <span className="hero__h-line grad-text">clues about your future.</span>\n'
    '        </h1>'
)
body_jsx, n = hero_h_pattern.subn(hero_h_new, body_jsx)
if n != 1:
    print(f"WARN: hero__h heading replaced {n} times (expected 1).")

# ---------- Scope CSS to .kyg-page so it can't leak to other routes ----------
def scope_selector(sel: str, scope: str) -> str:
    sel = sel.strip()
    if not sel:
        return sel
    # Keyframe percentages (0%, 50%, from, to) — leave alone (called inside @keyframes)
    if re.fullmatch(r"\d+%|\d+\.\d+%|from|to", sel):
        return sel
    # :root → the scope wrapper itself
    if sel == ":root":
        return scope
    # html / body → the scope wrapper itself
    if sel == "html" or sel == "body":
        return scope
    # body::before / body:hover / html .foo → swap the root for scope
    if sel.startswith("body::") or sel.startswith("body:") or sel.startswith("html "):
        return scope + sel[4:]
    if sel.startswith("html::") or sel.startswith("html:") or sel.startswith("body "):
        return scope + sel[4:]
    # Universal selector `*` (with or without pseudo) — bind to scope's descendants
    if sel == "*":
        return scope + " *"
    if sel.startswith("*::") or sel.startswith("*:"):
        return scope + " " + sel
    # Pseudo elements without an element (e.g. ::selection)
    if sel.startswith("::"):
        return scope + " " + sel
    # Default: descendant of scope
    return scope + " " + sel


def scope_selector_list(selectors: str, scope: str) -> str:
    return ", ".join(scope_selector(s, scope) for s in selectors.split(","))


def scope_css(css: str, scope: str) -> str:
    """Wrap every top-level rule under `scope`, recurse into @media/@supports,
    leave @keyframes / @font-face untouched."""
    out = []
    i = 0
    n = len(css)
    while i < n:
        ch = css[i]
        # Whitespace
        if ch in " \t\r\n":
            out.append(ch)
            i += 1
            continue
        # Comments
        if css[i:i+2] == "/*":
            end = css.find("*/", i + 2)
            if end == -1:
                out.append(css[i:])
                break
            out.append(css[i:end+2])
            i = end + 2
            continue
        # @-rule
        if ch == "@":
            j = i + 1
            while j < n and (css[j].isalnum() or css[j] == "-"):
                j += 1
            name = css[i+1:j].lower()
            # Find end of prelude (`;` for at-rules without a block, `{` for ones with)
            k = j
            depth = 0
            while k < n:
                c = css[k]
                if c == "{":
                    break
                if c == ";" and depth == 0:
                    break
                k += 1
            if k >= n:
                out.append(css[i:])
                break
            if css[k] == ";":
                out.append(css[i:k+1])
                i = k + 1
                continue
            # block @-rule
            prelude = css[i:k+1]  # includes `{`
            out.append(prelude)
            i = k + 1
            # find matching closing }
            depth = 1
            start = i
            while i < n and depth > 0:
                c = css[i]
                if c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        break
                i += 1
            inner = css[start:i]
            keep_raw = name in ("keyframes", "-webkit-keyframes", "-moz-keyframes", "font-face", "page", "charset", "import", "namespace")
            if keep_raw:
                out.append(inner)
            else:
                out.append(scope_css(inner, scope))
            out.append("}")
            i += 1
            continue
        # Regular rule: find `{`
        j = i
        while j < n and css[j] != "{":
            j += 1
        if j >= n:
            out.append(css[i:])
            break
        selectors = css[i:j]
        # Find matching `}` for the body
        depth = 1
        k = j + 1
        while k < n and depth > 0:
            c = css[k]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    break
            k += 1
        body = css[j+1:k]
        out.append(scope_selector_list(selectors, scope))
        out.append("{")
        out.append(body)
        out.append("}")
        i = k + 1
    return "".join(out)


scoped_styles = scope_css(styles, SCOPE)

# Append our font + size + responsive overrides. Already targeting .kyg-page,
# so they layer on top of the scoped sheet without leaking.
OVERRIDES = """

/* ========================================================================
   Overrides: next/font wiring, reduced base scale, extra responsive cover.
   ======================================================================== */
.kyg-page {
  /* Use the next/font-loaded Figtree / Hind variables defined by the layout. */
  --ff: var(--font-figtree), "Figtree", system-ui, -apple-system, "Segoe UI", sans-serif;
  --ff-i: var(--font-hind), "Hind", var(--font-figtree), "Figtree", sans-serif;

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
.kyg-page { overflow-x: hidden; }

@media (max-width: 1180px) {
  .kyg-page { --gutter: clamp(16px, 3vw, 36px); --r-2xl: 44px; --r-xl: 36px; }
  .kyg-page .hero__h { font-size: clamp(34px, 6.4vw, 56px); }
  .kyg-page .hero__sub { font-size: var(--fs-md); }
}

@media (max-width: 880px) {
  .kyg-page { --fs-xs: 11px; --fs-sm: 12px; --fs-md: 14px; --fs-lg: 15px; --fs-xl: 17px; }
  .kyg-page .megamenu__inner { grid-template-columns: 1fr !important; }
  .kyg-page .hero__cta { flex-wrap: wrap; }
  .kyg-page .hero__cta .btn { width: 100%; justify-content: center; }
  .kyg-page .pkg__cards { grid-template-columns: 1fr !important; }
}

@media (max-width: 720px) {
  .kyg-page { --gutter: 18px; --r-2xl: 32px; --r-xl: 28px; --r-lg: 24px; }
  .kyg-page .hero { padding-top: 32px; padding-bottom: 48px; }
  .kyg-page .hero__h { font-size: clamp(28px, 9vw, 40px); line-height: 1.1; }
  .kyg-page .hero__sub { font-size: 14px; line-height: 1.5; }
  .kyg-page .hero__pill { font-size: 11px; padding: 8px 12px; }
  .kyg-page .hero__cta .btn { padding: 12px 18px; font-size: 14px; }
  .kyg-page .nav__cta { gap: 8px; }
  .kyg-page .nav__cta .btn--ghost { display: none; }
  .kyg-page .footer { padding: 48px 0 32px; }
  .kyg-page .footer__brandline { font-size: clamp(40px, 14vw, 64px); }
}

@media (max-width: 420px) {
  .kyg-page { --gutter: 14px; }
  .kyg-page .nav__logo svg { width: 110px; }
  .kyg-page .btn { font-size: 13px; padding: 10px 14px; }
  .kyg-page .hero__h { font-size: clamp(26px, 9vw, 34px); }
}

@media (max-width: 980px) {
  .kyg-page .nav__cta .btn { padding: 8px 12px; font-size: 13px; }
  .kyg-page .nav__cta .btn .ico { width: 14px; height: 14px; }
}

/* ========================================================================
   Fixed nav + 100vh hero
   ======================================================================== */
.kyg-page .nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
}
.kyg-page .nav__inner { height: 72px; }

/* Hero: exact 100vh with content centered and the heading sized to fit. */
.kyg-page .hero {
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  padding: 0;
  display: flex;
  align-items: center;
}
.kyg-page .hero__media { border-radius: 0; }
.kyg-page .hero__inner {
  padding-top: 96px;
  padding-bottom: 32px;
}
.kyg-page .hero__copy { max-width: min(1100px, 100%); }
.kyg-page .hero__h { font-size: clamp(34px, 5.8vw, 84px); line-height: 1.02; }
.kyg-page .hero__h-line { display: block; }
/* Keep each line on a single row at desktop widths where we have the space. */
@media (min-width: 1024px) {
  .kyg-page .hero__h-line { white-space: nowrap; }
}
.kyg-page .hero__sub { margin-top: 20px; }
.kyg-page .hero__cta { margin-top: 28px; }

/* Tablet */
@media (max-width: 1180px) {
  .kyg-page .nav__inner { height: 64px; }
  .kyg-page .hero__inner { padding-top: 84px; padding-bottom: 28px; }
  .kyg-page .hero__pill { margin-bottom: 22px; }
}

/* Small tablet / large phone */
@media (max-width: 880px) {
  .kyg-page .nav__inner { height: 60px; }
  .kyg-page .hero__inner { padding-top: 76px; padding-bottom: 24px; }
  .kyg-page .hero__h { font-size: clamp(30px, 7.4vw, 56px); }
  .kyg-page .hero__pill { margin-bottom: 18px; font-size: 13px; padding: 8px 18px 8px 8px; }
  .kyg-page .hero__pill-dot { width: 28px; height: 28px; font-size: 13px; }
}

/* Phones */
@media (max-width: 720px) {
  .kyg-page .nav__inner { height: 56px; gap: 12px; }
  .kyg-page .nav__logo svg { height: 28px; }
  .kyg-page .hero__inner { padding-top: 68px; padding-bottom: 20px; }
  .kyg-page .hero__h { font-size: clamp(26px, 8vw, 40px); line-height: 1.04; }
  .kyg-page .hero__sub { font-size: 14px; line-height: 1.5; margin-top: 14px; max-width: none; }
  .kyg-page .hero__cta { margin-top: 20px; gap: 10px; }
  .kyg-page .hero__cta .btn { width: 100%; padding: 12px 18px; font-size: 14px; }
  .kyg-page .hero__pill { margin-bottom: 14px; font-size: 11px; padding: 6px 14px 6px 6px; }
  .kyg-page .hero__pill-dot { width: 22px; height: 22px; font-size: 11px; }
}

/* Extra small (down to 320px) */
@media (max-width: 420px) {
  .kyg-page { --gutter: 14px; }
  .kyg-page .nav__inner { height: 52px; gap: 8px; }
  .kyg-page .nav__logo svg { height: 22px; }
  .kyg-page .nav__cta { gap: 6px; }
  .kyg-page .nav__cta .btn { padding: 6px 10px; font-size: 12px; }
  .kyg-page .nav__cta .btn .ico { width: 12px; height: 12px; }
  .kyg-page .hero__inner { padding-top: 64px; padding-bottom: 16px; }
  .kyg-page .hero__h { font-size: clamp(22px, 8.5vw, 32px); line-height: 1.08; letter-spacing: -.02em; }
  .kyg-page .hero__sub { font-size: 13px; margin-top: 12px; }
  .kyg-page .hero__cta { margin-top: 16px; }
  .kyg-page .hero__cta .btn { padding: 11px 14px; font-size: 13px; }
  .kyg-page .hero__pill { margin-bottom: 12px; font-size: 10.5px; padding: 5px 12px 5px 5px; gap: 8px; }
  .kyg-page .hero__pill-dot { width: 20px; height: 20px; font-size: 10px; }
}

@media (max-width: 360px) {
  .kyg-page { --gutter: 12px; }
  .kyg-page .nav__cta .btn--primary { padding: 6px 10px; }
  .kyg-page .nav__cta .btn--primary svg { display: none; }
  .kyg-page .hero__h { font-size: clamp(20px, 8.8vw, 28px); }
  .kyg-page .hero__sub { font-size: 12.5px; }
  .kyg-page .hero__cta .btn { font-size: 12.5px; padding: 10px 12px; }
}

/* ========================================================================
   Generic responsive hardening for ALL sections down to 320px
   ======================================================================== */

/* Stop any element from causing horizontal scroll. */
.kyg-page img,
.kyg-page svg,
.kyg-page video { max-width: 100%; height: auto; }

/* Generic container fluidity */
@media (max-width: 720px) {
  .kyg-page section { padding-left: 0; padding-right: 0; }
  .kyg-page .container, .kyg-page .container--wide {
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
  .kyg-page .steps { grid-template-columns: 1fr !important; gap: 16px; }
}

@media (max-width: 420px) {
  .kyg-page section { padding-top: 48px; padding-bottom: 48px; }
  .kyg-page h2, .kyg-page .section__h { font-size: clamp(22px, 6.8vw, 30px); line-height: 1.15; }
  .kyg-page p { font-size: 14px; line-height: 1.55; }
  .kyg-page .btn { padding: 10px 14px; font-size: 13px; }
  .kyg-page .eyebrow { font-size: 11px; }
  .kyg-page .footer__brandline { font-size: clamp(34px, 14vw, 56px); line-height: 1; }
  .kyg-page .trust__item { font-size: 12px; }
}

@media (max-width: 360px) {
  .kyg-page section { padding-top: 40px; padding-bottom: 40px; }
  .kyg-page h2, .kyg-page .section__h { font-size: clamp(20px, 7vw, 26px); }
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
  flex-shrink: 0;            /* the marquee items must never compress */
  flex-wrap: nowrap;
}
.kyg-page .trust__item svg { flex-shrink: 0; }
.kyg-page .trust__item-dot { flex-shrink: 0; align-self: center; }

/* On narrow screens the decorative side-lines on the label squeeze the dot off
   the line; collapse them and keep just `dot + text` on one row. */
@media (max-width: 560px) {
  .kyg-page .trust__label::before,
  .kyg-page .trust__label::after { display: none; }
  .kyg-page .trust__label { gap: 8px; font-size: 11px; letter-spacing: .18em; }
}

@media (max-width: 420px) {
  .kyg-page .trust { padding: 36px 0; }
  .kyg-page .trust__track { gap: 40px; }
  .kyg-page .trust__item { font-size: 13px; gap: 10px; }
  .kyg-page .trust__item svg { width: 22px; height: 22px; }
}
"""

OUT_CSS.parent.mkdir(parents=True, exist_ok=True)
OUT_CSS.write_text(scoped_styles + OVERRIDES, encoding="utf-8")

# ---------- Write page.tsx ----------
script_indented = "\n".join("    " + line for line in script.splitlines())

page_tsx = f"""// @ts-nocheck
// Generated from kyg.html by scripts/convert-kyg.py. Re-run the script to
// regenerate; the auth-aware NavAuthCta is part of the template so it survives.
'use client';

import {{ useEffect }} from 'react';
import Link from 'next/link';
import {{ usePathname }} from 'next/navigation';
import {{ useSession }} from 'next-auth/react';
import {{ LayoutDashboard }} from 'lucide-react';
import UserNav from '@/components/admin/UserNav';
import './landing.css';

function NavAuthCta() {{
  const pathname = usePathname();
  const {{ data: session, status }} = useSession();
  const loading = status === 'loading';
  const user = session?.user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="nav__cta">
      {{loading ? null : user ? (
        <>
          {{isAdmin ? (
            <Link href="/admin/dashboard" className="btn btn--ghost">
              <LayoutDashboard className="ico" />
              Dashboard
            </Link>
          ) : (
            <Link href="/dashboard/profile" className="btn btn--ghost">
              My profile
            </Link>
          )}}
          <UserNav
            name={{user.name ?? user.email ?? 'User'}}
            email={{user.email ?? ''}}
            role={{user.role}}
            image={{user.image ?? null}}
          />
        </>
      ) : (
        <Link href={{`/login?from=${{encodeURIComponent(pathname || '/')}}`}} className="btn btn--ghost">
          Sign in
        </Link>
      )}}
      <Link href="#wellness" className="btn btn--primary">
        Order Kit
        <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <button className="nav__burger" aria-label="Open menu" id="burger"><span></span></button>
    </div>
  );
}}

export default function HomePage() {{
  useEffect(() => {{
{script_indented}
  }}, []);

  return (
    <div className="kyg-page">
{body_jsx}
    </div>
  );
}}
"""

OUT_PAGE.parent.mkdir(parents=True, exist_ok=True)
OUT_PAGE.write_text(page_tsx, encoding="utf-8")

print(f"Wrote {OUT_PAGE}")
print(f"Wrote {OUT_CSS}")
print(f"Wrote {len(list(ASSETS_DIR.glob('*')))} assets to {ASSETS_DIR}")

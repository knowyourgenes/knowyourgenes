"""
Inject the "Our Tests / Which one is you?" section into app/(landing)/page.tsx.

The earlier convert-kyg.py run predates the addition of the tests section to
html/KYG.html, so the inlined CSS, the JSX, and the carousel JS for that
section are all missing. This script is additive:

  1. Extracts the tests CSS block (~590 lines) from html/KYG.html, resolves the
     three @apply directives to raw CSS (since <style> tags can't run Tailwind),
     scopes every selector under .kyg-page, and emits a SECOND <style> tag below
     the existing one. The original KYG_PAGE_CSS constant is untouched.
  2. Inserts the JSX for the section between the wellness section and the
     report section, with HTML attributes converted to JSX (class -> className,
     stroke-* -> stroke*, void tags self-closed, inline style strings to objects).
  3. Appends the package-carousel + height-equalizer logic to the existing
     IIFE inside useEffect, right before the IIFE's closing `})();`.

Run once from the repo root:
  python scripts/inject-tests-section.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / "app" / "(landing)" / "page.tsx"
HTML = ROOT / "html" / "KYG.html"

# ----------------------------------------------------------------------------
# 1. Read source HTML and locate the <style> + body + script blocks.
# ----------------------------------------------------------------------------
src = HTML.read_text(encoding="utf-8")

style_match = re.search(r"<style[^>]*>(.*?)</style>", src, re.S)
body_match = re.search(r"<body[^>]*>(.*?)<script>", src, re.S)
script_match = re.search(r"<script>\s*\(function\s*\(\)\s*\{(.*?)\}\)\(\);?\s*</script>", src, re.S)
if not (style_match and body_match and script_match):
    raise SystemExit("Could not extract <style>/<body>/<script> from KYG.html")

styles_src = style_match.group(1)
body_src = body_match.group(1)
script_src = script_match.group(1)

# ----------------------------------------------------------------------------
# 2. Slice out the tests CSS block. It runs from the OUR TESTS comment block
#    down to the next top-level "/* =====" section header.
# ----------------------------------------------------------------------------
m = re.search(
    r"(/\* =+\s*\n\s*OUR TESTS.*?)(?=/\*\s*=+\s*\n\s*[A-Z])",
    styles_src,
    re.S,
)
if not m:
    raise SystemExit("Could not locate the OUR TESTS CSS block in KYG.html <style>.")
tests_css_raw = m.group(1).rstrip()

# Resolve the three @apply directives to raw CSS so this can live in a <style>
# tag at runtime (Tailwind only processes @apply in build-time CSS files).
APPLY_REPLACEMENTS = {
    # .wr-panel__cta (line 127 in the slice)
    "@apply inline-flex items-center gap-[10px] py-[12px] px-[22px] rounded-full text-white font-figtree text-[14.5px] font-semibold tracking-[-.005em] border-0 cursor-pointer;":
        "display:inline-flex; align-items:center; gap:10px; padding:12px 22px; border-radius:9999px; color:#fff; font-family:var(--ff); font-size:14.5px; font-weight:600; letter-spacing:-.005em; border:0; cursor:pointer;",
    # .tests__arrow (line 407)
    "@apply inline-flex items-center gap-[10px] py-[13px] px-[24px] rounded-full text-white font-figtree text-[14.5px] font-semibold tracking-[-.005em] cursor-pointer border-0;":
        "display:inline-flex; align-items:center; gap:10px; padding:13px 24px; border-radius:9999px; color:#fff; font-family:var(--ff); font-size:14.5px; font-weight:600; letter-spacing:-.005em; cursor:pointer; border:0;",
    # .test-card__cta (line 556)
    "@apply inline-flex items-center gap-[8px] font-figtree text-[14.5px] font-semibold tracking-[-.005em];":
        "display:inline-flex; align-items:center; gap:8px; font-family:var(--ff); font-size:14.5px; font-weight:600; letter-spacing:-.005em;",
}
for needle, replacement in APPLY_REPLACEMENTS.items():
    if needle not in tests_css_raw:
        print(f"WARN: @apply line not found verbatim - partial match attempt:\n  {needle[:80]}…")
    tests_css_raw = tests_css_raw.replace(needle, replacement)

# Scope every top-level selector under .kyg-page. We're inside a single block
# of rules (no nested @media at the top level until later, and @keyframes does
# not need scoping), so we transform any line that begins with a CSS selector
# (anything ending in `{` that isn't an at-rule, a property, or a closing brace).
def _scope_selector(line: str) -> str:
    """Prepend .kyg-page to every comma-separated selector in a CSS selector line."""
    stripped = line.rstrip("\n")
    # Detect "selector {" lines. Be conservative: skip at-rules, properties (have ':'),
    # closing braces, comments, blank lines, and @keyframes percentage selectors.
    if not stripped.endswith("{"):
        return line
    head = stripped[:-1].strip()
    if not head or head.startswith("@") or head.startswith("/*"):
        return line
    # Skip keyframe percentage / from / to selectors.
    if re.fullmatch(r"(\d+%|from|to)(\s*,\s*(\d+%|from|to))*", head):
        return line
    parts = [p.strip() for p in head.split(",")]
    scoped = ", ".join(
        p if p.startswith(".kyg-page") else f".kyg-page {p}" for p in parts
    )
    return scoped + " {\n"

# Track whether we are inside @keyframes / @media so we apply scoping correctly.
out_lines = []
depth_at_rule = 0  # >0 means inside an @keyframes block (no selector scoping needed)
for ln in tests_css_raw.splitlines(keepends=True):
    stripped = ln.strip()
    if depth_at_rule > 0:
        # Inside @keyframes - don't scope, just track braces.
        depth_at_rule += stripped.count("{") - stripped.count("}")
        out_lines.append(ln)
        continue
    if re.match(r"^@(keyframes|font-face|supports)\b", stripped):
        depth_at_rule = 1 + stripped.count("{") - stripped.count("}") - 1
        # The opening { on this line counted once, so:
        depth_at_rule = max(1, stripped.count("{") - stripped.count("}"))
        out_lines.append(ln)
        continue
    if stripped.startswith("@media"):
        # @media wraps real selectors; emit the @media line as-is, the selectors
        # inside it will be scoped on subsequent iterations.
        out_lines.append(ln)
        continue
    out_lines.append(_scope_selector(ln))

tests_css_scoped = "".join(out_lines)

# ----------------------------------------------------------------------------
# 3. Slice the tests JSX out of the body.
# ----------------------------------------------------------------------------
body_clean = re.sub(
    r"data:image/[a-zA-Z+]+;base64,[A-Za-z0-9+/=]+",
    "/* dataURI removed */",
    body_src,
)
# Replace base64 image refs proper (kept simple - the tests section has none).
m2 = re.search(
    r'<section class="s tests" id="tests">.*?</section>',
    body_clean,
    re.S,
)
if not m2:
    raise SystemExit("Could not extract <section class=\"s tests\"> from KYG.html body.")
tests_html = m2.group(0)

# HTML -> JSX transformations (mirrors scripts/convert-kyg.py).
def html_to_jsx(text: str) -> str:
    text = re.sub(r"<!--(.*?)-->", lambda m: "{/*" + m.group(1).replace("*/", "* /") + "*/}", text, flags=re.S)
    rename = {
        "class": "className",
        "for": "htmlFor",
        "tabindex": "tabIndex",
        "readonly": "readOnly",
        "autocomplete": "autoComplete",
        "stroke-width": "strokeWidth",
        "stroke-linecap": "strokeLinecap",
        "stroke-linejoin": "strokeLinejoin",
        "stroke-miterlimit": "strokeMiterlimit",
        "fill-rule": "fillRule",
        "clip-rule": "clipRule",
        "aria-roledescription": "aria-roledescription",  # JSX accepts aria-* as-is
    }
    for old, new in rename.items():
        text = re.sub(r"(?<=[\s<])" + re.escape(old) + r"(?==)", new, text)
    # data-* attributes are valid in JSX as-is - no rename needed.
    # Void tags self-close.
    for tag in ("img", "br", "hr", "input", "source", "area", "base", "col", "embed", "link", "meta", "param", "track", "wbr"):
        text = re.sub(r"<" + tag + r"(\s[^>]*?)(?<!/)>", r"<" + tag + r"\1 />", text)
        text = re.sub(r"<" + tag + r">", r"<" + tag + r" />", text)
    # Inline style="key:val;..." to style={{}}.
    def _style(m):
        items = [p for p in m.group(1).split(";") if p.strip() and ":" in p]
        pairs = []
        for it in items:
            k, v = it.split(":", 1)
            k = k.strip()
            v = v.strip()
            if k.startswith("--"):
                key = repr(k)
            else:
                key = repr(re.sub(r"-([a-z])", lambda x: x.group(1).upper(), k))
            pairs.append(f"{key}: {repr(v)}")
        return "style={{ " + ", ".join(pairs) + " } as React.CSSProperties}"
    text = re.sub(r'style="([^"]*)"', _style, text)
    # Decode the few HTML entities used in this section.
    text = text.replace("&amp;", "&").replace("&nbsp;", " ").replace("&mdash;", "-")
    # JSX-escape stray { } and `&apos;` in body text - not needed here (the
    # source uses straight quotes and apostrophes already).
    return text

tests_jsx = html_to_jsx(tests_html)
# Indent the JSX so it lines up inside the wrapper (page.tsx uses 6-space indent
# at the section level inside the return).
tests_jsx_indented = "\n".join(
    ("      " + ln if ln.strip() else "") for ln in tests_jsx.splitlines()
)

# ----------------------------------------------------------------------------
# 4. Slice the carousel JS out of the source script.
# ----------------------------------------------------------------------------
m3 = re.search(
    r"// ===== Package carousel \(right column\) =====.*?(?=\n\s*//\s*=====|\Z)",
    script_src,
    re.S,
)
if not m3:
    raise SystemExit("Could not extract carousel JS from KYG.html script.")
carousel_js = m3.group(0).rstrip()

# ----------------------------------------------------------------------------
# 5. Patch page.tsx.
# ----------------------------------------------------------------------------
page = PAGE.read_text(encoding="utf-8")

# (a) Add a second <style> tag right after the existing one with the tests CSS
#     in a NEW constant. Escape for template literal.
css_for_literal = (
    tests_css_scoped
    .replace("\\", "\\\\")
    .replace("`", "\\`")
    .replace("${", "\\${")
)
new_const = (
    "\n"
    "// Tests section was added to html/KYG.html after the initial convert-kyg.py\n"
    "// run, so its CSS is appended here as a second scoped block. Same .kyg-page\n"
    "// prefix means it composes safely with KYG_PAGE_CSS above.\n"
    "const KYG_TESTS_CSS = `" + css_for_literal + "`;\n\n"
)
needle_const = "function NavAuthCta"
if needle_const not in page:
    raise SystemExit("NavAuthCta marker missing - page layout changed.")
page = page.replace(needle_const, new_const + needle_const, 1)

# Add the second <style> tag next to the first.
needle_style = '<style dangerouslySetInnerHTML={{ __html: KYG_PAGE_CSS }} />'
if needle_style not in page:
    raise SystemExit("Existing KYG_PAGE_CSS <style> tag not found.")
page = page.replace(
    needle_style,
    needle_style + '\n      <style dangerouslySetInnerHTML={{ __html: KYG_TESTS_CSS }} />',
    1,
)

# (b) Inject the JSX section between the wellness </section> and the REPORT
#     PREVIEW comment block.
report_marker = "      {/* ============================================================\n     REPORT PREVIEW"
if report_marker not in page:
    raise SystemExit("REPORT PREVIEW marker missing - section ordering changed.")
section_block = (
    "      {/* ============================================================\n"
    "     OUR TESTS - product slider section\n"
    "     ============================================================ */}\n"
    + tests_jsx_indented
    + "\n\n"
)
page = page.replace(report_marker, section_block + report_marker, 1)

# (c) Append the carousel JS inside the existing useEffect IIFE, right before
#     `})();`. Be careful: there may be multiple `})();` calls - anchor to the
#     end of the smooth-scroll handler that precedes the IIFE close.
iife_close_anchor = "      });\n    })();"
if iife_close_anchor not in page:
    raise SystemExit("Could not locate the IIFE close inside useEffect.")
patched_close = (
    "      });\n\n"
    "      " + carousel_js.replace("\n", "\n      ") + "\n"
    "    })();"
)
page = page.replace(iife_close_anchor, patched_close, 1)

PAGE.write_text(page, encoding="utf-8")
print(f"page.tsx patched: {len(page)} bytes")
print(f"  + KYG_TESTS_CSS    : {len(tests_css_scoped)} chars")
print(f"  + tests JSX        : {len(tests_jsx_indented)} chars")
print(f"  + carousel JS      : {len(carousel_js)} chars")

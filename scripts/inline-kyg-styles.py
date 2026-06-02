"""
One-shot transformation: inline app/(landing)/landing.css into a scoped
<style> tag inside app/(landing)/page.tsx, then delete landing.css.

Why: the home-page CSS is page-specific (~3500 lines, all .kyg-page-scoped).
Keeping it as a separate import worked, but the design ask is to (a) not have
a separate CSS file, (b) keep nothing in globals.css, and (c) keep animations
(@keyframes) in a <style> tag co-located with the JSX. This script performs
that move in a single, repeatable pass.

Run once from the repo root:
  python scripts/inline-kyg-styles.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / "app" / "(landing)" / "page.tsx"
CSS = ROOT / "app" / "(landing)" / "landing.css"

page = PAGE.read_text(encoding="utf-8")
css = CSS.read_text(encoding="utf-8")

# 1) Strip the CSS file import.
page2, n_import = re.subn(
    r"^import\s+['\"]\./landing\.css['\"]\s*;\s*\n", "", page, flags=re.MULTILINE
)
print("import lines removed:", n_import)
if n_import == 0:
    print("WARN: no landing.css import found - already inlined?")

# 2) Escape CSS for a JS template literal:
#    backslashes, backticks, and ${ (which JS would otherwise interpolate).
escaped = (
    css.replace("\\", "\\\\")
    .replace("`", "\\`")
    .replace("${", "\\${")
)

# 3) Insert a KYG_PAGE_CSS constant just before NavAuthCta.
needle = "function NavAuthCta"
if needle not in page2:
    raise SystemExit("NavAuthCta function not found - page layout changed.")

const_block = (
    "\n"
    "// =============================================================\n"
    "// Scoped page styles - inlined from the original kyg.html <style>\n"
    "// block. Kept inside the component (not in globals.css) so nothing\n"
    "// leaks across routes; every selector is prefixed .kyg-page so the\n"
    "// cascade cannot escape. Animations (@keyframes) live in the same\n"
    "// block per the design's request. Tailwind utility classes are\n"
    "// preferred for any NEW elements added to this page.\n"
    "// =============================================================\n"
    "const KYG_PAGE_CSS = `" + escaped + "`;\n\n"
)
page3 = page2.replace(needle, const_block + needle, 1)

# 4) Add a <style> tag as the very first child of the .kyg-page wrapper.
wrapper_open = '<div className="kyg-page">'
if wrapper_open not in page3:
    raise SystemExit("Wrapper div not found - page layout changed.")

style_tag = wrapper_open + (
    "\n      {/* Scoped CSS: see KYG_PAGE_CSS constant above. dangerouslySet"
    "InnerHTML so React treats it as static and does not re-process on each "
    "render. */}\n"
    "      <style dangerouslySetInnerHTML={{ __html: KYG_PAGE_CSS }} />"
)
page4 = page3.replace(wrapper_open, style_tag, 1)

PAGE.write_text(page4, encoding="utf-8")
print(f"page.tsx rewritten: {len(page4)} bytes")

# 5) Delete the now-orphan landing.css.
if CSS.exists():
    CSS.unlink()
    print("landing.css deleted")

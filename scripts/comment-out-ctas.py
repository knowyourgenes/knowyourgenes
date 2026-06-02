"""
Hide every call-to-action on the landing page without deleting the JSX.

Each CTA is wrapped with `{false && (...)}` and tagged with a
`{/* CTA-HIDDEN: ... */}` marker comment so the user can restore them by
removing the wrappers (or grep for `CTA-HIDDEN`).

Idempotent: if a CTA is already wrapped (preceded by `{false && (` within
the previous 3 lines) it is skipped, so the script is safe to re-run.

Targets (all in app/(landing)/page.tsx):
  - NavAuthCta auth-aware Dashboard / Order Kit / Sign in links
  - Hero ("Start your wellness journey", "Talk to GENEous Care")
  - My Wellness Report panel ("Get your kit")
  - 4 test-cards ("Get your kit" / "Get your kits")
  - 3 bundle-card CTA spans ("View bundle")
  - Care section ("Book a free consultation")
  - Senior section ("Explore Senior Care")
  - Final CTA section buttons ("Begin your KYG journey", "Talk to GENEous Care")

Run once from the repo root:
  python scripts/comment-out-ctas.py
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / "app" / "(landing)" / "page.tsx"
text = PAGE.read_text(encoding="utf-8")
original = text


def already_wrapped(text: str, start: int) -> bool:
    """Return True if the 200 chars before `start` contain a `{false && (` marker."""
    window = text[max(0, start - 200) : start]
    return "{false && (" in window


def wrap_element(text: str, pattern: re.Pattern, label: str) -> tuple[str, int]:
    """
    Find every match of `pattern` in `text` and wrap it with:
      {/* CTA-HIDDEN: <label> */}
      {false && (
        <original match, re-indented by +2>
      )}
    Skips matches already wrapped (idempotent).
    Returns (new_text, count_wrapped).
    """
    out = []
    cursor = 0
    wrapped = 0
    for m in pattern.finditer(text):
        out.append(text[cursor : m.start()])
        if already_wrapped(text, m.start()):
            out.append(m.group(0))
        else:
            # The captured indent is the leading whitespace before the element.
            indent_match = re.search(r"^([ \t]*)", m.group(0), re.M)
            indent = indent_match.group(1) if indent_match else ""
            inner = m.group(0)
            # Re-indent every non-blank line by +2 spaces.
            indented = "\n".join(
                ("  " + ln) if ln.strip() else ln for ln in inner.splitlines()
            )
            wrapper = (
                f"{indent}{{/* CTA-HIDDEN: {label} */}}\n"
                f"{indent}{{false && (\n"
                f"{indented}\n"
                f"{indent})}}"
            )
            out.append(wrapper)
            wrapped += 1
        cursor = m.end()
    out.append(text[cursor:])
    return "".join(out), wrapped


# ---------------------------------------------------------------------------
# 1. NavAuthCta — wrap the conditional that renders Dashboard/Order Kit/Sign in.
#    Done via two surgical string substitutions because regex would be ugly here.
# ---------------------------------------------------------------------------
nav_open = '    <div className="nav__cta">\n      {loading ? null : user ? ('
nav_open_replacement = (
    '    <div className="nav__cta">\n'
    "      {/* CTA-HIDDEN: nav CTAs commented for now */}\n"
    "      {false && (loading ? null : user ? ("
)
if nav_open in text:
    text = text.replace(nav_open, nav_open_replacement, 1)
    nav_close = '      )}\n      <button className="nav__burger"'
    nav_close_replacement = '      ))}\n      <button className="nav__burger"'
    if nav_close in text:
        text = text.replace(nav_close, nav_close_replacement, 1)
        print("  ok nav-auth-cta")
    else:
        print("  WARN nav-auth-cta close not found (open already patched, manual fix needed)")
else:
    print("  skip nav-auth-cta (already wrapped or anchor missing)")

# ---------------------------------------------------------------------------
# 2. Hero CTA — wrap the whole hero__cta div.
# ---------------------------------------------------------------------------
hero_re = re.compile(
    r'^[ \t]+<div className="hero__cta">\n'
    r'(?:.*\n){2,12}?'
    r'^[ \t]+</div>\n',
    re.M,
)
text, n = wrap_element(text, hero_re, "hero CTAs")
print(f"  ok hero-cta ({n})")

# ---------------------------------------------------------------------------
# 3. Wellness panel CTA — single <a className="wr-panel__cta">…</a>.
# ---------------------------------------------------------------------------
wr_panel_re = re.compile(
    r'^[ \t]+<a href="#" className="wr-panel__cta">\n'
    r'(?:.*\n){2,16}?'
    r'^[ \t]+</a>\n',
    re.M,
)
text, n = wrap_element(text, wr_panel_re, "Wellness panel CTA")
print(f"  ok wellness-panel-cta ({n})")

# ---------------------------------------------------------------------------
# 4. Test-card CTAs — 4 cards.
# ---------------------------------------------------------------------------
test_card_re = re.compile(
    r'^[ \t]+<a href="#" className="test-card__cta">\n'
    r'(?:.*\n){2,16}?'
    r'^[ \t]+</a>\n',
    re.M,
)
text, n = wrap_element(text, test_card_re, "test card CTA")
print(f"  ok test-card-ctas ({n})")

# ---------------------------------------------------------------------------
# 5. Bundle-card CTA spans — 3 cards.
# ---------------------------------------------------------------------------
bundle_re = re.compile(
    r'^[ \t]+<span className="bundle-card__cta">\n'
    r'(?:.*\n){2,12}?'
    r'^[ \t]+</span>\n',
    re.M,
)
text, n = wrap_element(text, bundle_re, "bundle card CTA")
print(f"  ok bundle-ctas ({n})")

# ---------------------------------------------------------------------------
# 6. Care section CTA — outer wrapper div containing a btn--accent link.
# ---------------------------------------------------------------------------
care_re = re.compile(
    r"^[ \t]+<div style=\{\{ marginTop: '36px' \} as React\.CSSProperties\}>\n"
    r'^[ \t]+<a href="#" className="btn btn--accent">\n'
    r'(?:.*\n){2,12}?'
    r'^[ \t]+</a>\n'
    r'^[ \t]+</div>\n',
    re.M,
)
text, n = wrap_element(text, care_re, "Care section CTA")
print(f"  ok care-cta ({n})")

# ---------------------------------------------------------------------------
# 7. Senior section CTA — outer wrapper div containing a btn--ghost link.
# ---------------------------------------------------------------------------
senior_re = re.compile(
    r"^[ \t]+<div style=\{\{ marginTop: '32px' \} as React\.CSSProperties\}>\n"
    r'^[ \t]+<a href="#" className="btn btn--ghost">\n'
    r'(?:.*\n){2,12}?'
    r'^[ \t]+</a>\n'
    r'^[ \t]+</div>\n',
    re.M,
)
text, n = wrap_element(text, senior_re, "Senior section CTA")
print(f"  ok senior-cta ({n})")

# ---------------------------------------------------------------------------
# 8. Final CTA buttons — wrap the .finalcta__btns div.
# ---------------------------------------------------------------------------
final_re = re.compile(
    r'^[ \t]+<div className="finalcta__btns">\n'
    r'(?:.*\n){2,30}?'
    r'^[ \t]+</div>\n',
    re.M,
)
text, n = wrap_element(text, final_re, "Final CTA buttons")
print(f"  ok final-cta-buttons ({n})")

if text == original:
    print("\nno changes made -- CTAs already commented.")
    sys.exit(0)

PAGE.write_text(text, encoding="utf-8")
print(f"\npage.tsx rewritten: {len(text)} bytes (was {len(original)})")

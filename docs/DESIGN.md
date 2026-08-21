# DESIGN.md - the KYG design system

> **For AI agents and humans alike.** This file is the source of truth for how
> anything on screen is allowed to look. Read it before writing UI. If a rule
> here and a rule in your head disagree, this file wins. If this file is silent
> on something, pick the nearest existing pattern from
> [COMPONENTS.md](COMPONENTS.md) rather than inventing one.
>
> Companion file: **[COMPONENTS.md](COMPONENTS.md)** - the generated index of all
> 180 components. **Check it before building anything new.**

---

## 0. The three rules that override everything

These exist because the UI drifted: an audit of the tree found **30+ distinct
corner radii** (2px to 40px), **12 different page-shell widths** (1000px to
1530px), and **three parallel colour systems**. That is the visual noise this
document exists to stop.

1. **Content maxes out at `1600px`, and fills the width below that.**
   One shell width for the whole site. No page invents its own.
2. **The only corner radius is `rounded-sm` (6px)** - except genuine circles,
   which stay `rounded-full`. Nothing else. No `rounded-lg`, no `rounded-[24px]`,
   no bare `rounded`.
3. **Reuse before you build.** If [COMPONENTS.md](COMPONENTS.md) already lists a
   component that does the job, use it. A second Button is two things to restyle.

Everything below is detail on these three plus the tokens you need to obey them.

---

## 1. Layout & width

### The container contract

Every page-level content column is:

```
w-full  ·  max-w-[1600px]  ·  mx-auto  ·  px-(--gutter)
```

Use the shared [`Container`](../components/shared/Container.tsx) component. Do not
hand-roll the three classes:

```tsx
import { Container } from '@/components/shared/Container';

<Container>…</Container>                          // page column
<Container className="py-16">…</Container>        // extend, don't replace
<Container as="section" className="flex gap-6" />  // any element
```

`Container` already centres, caps at the shell width, and applies the gutter.
`className` is merged with `tailwind-merge`, so a `px-*` you pass wins.

### Gutter

`--gutter: clamp(18px, 3vw, 40px)` - 18px on a phone, 40px on a desktop.
It is defined in `CHROME_VARS` and `Container` falls back to the same clamp when
no ancestor sets it, so `Container` is safe to drop in anywhere.

### Narrower columns inside the shell

A full 1600px line of body text is unreadable. Inside the shell, cap **prose**:

| Use | Class | Why |
| --- | --- | --- |
| Long-form body copy | `max-w-[720px]` | ~75 characters, the readable maximum |
| Section intro / lede | `max-w-[760px]` | the most-used value already in the tree |
| Centred form or narrow card | `max-w-[560px]` | |

These are the only sanctioned sub-widths. Anything else needs a reason in a
comment. **Never** cap a page shell at anything other than 1600px.

### Full-bleed sections

A section whose *background* runs edge-to-edge but whose *content* is contained:

```tsx
<section className="w-full bg-linenw">
  <Container className="py-20">…</Container>
</section>
```

Background on the outer element, `Container` on the inner. Never stretch content
to the viewport edge.

### Breakpoints

Tailwind's defaults (`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536)
are the default choice. The tree also carries ad-hoc pixel breakpoints —
`max-[880px]`, `max-[720px]`, `max-[560px]`, `min-[981px]` - which exist because
they were ported 1:1 from Figma frames. **Do not add new ad-hoc breakpoints.**
Use a named one unless you are matching an existing component's behaviour, and
say so in a comment when you are.

---

## 2. Roundness

### The rule

```
rounded-sm    →  6px  →  everything
rounded-full  →        →  circles ONLY
```

`rounded-sm` is **6px**, declared as a literal in `app/globals.css`:

```css
--radius-sm: 6px;
```

A literal, not `calc(var(--radius) * …)`. It is the only radius the UI uses, so
it must not move when someone tunes the shadcn `--radius` base for the admin
area.

The rest of Tailwind's radius scale is **collapsed onto the same 6px** rather
than left deriving from `--radius`:

```css
--radius-md: 6px;  --radius-lg: 6px;  --radius-xl: 6px;
--radius-2xl: 6px; --radius-3xl: 6px; --radius-4xl: 6px;
```

Nothing writes `rounded-md` and up - `design:check` fails it - so these are a
trapdoor, not a scale: a stray `rounded-lg` from a shadcn primitive or a
pasted snippet paints the site radius instead of silently reintroducing an
eighth corner. Do not restore the `calc()` ladder to "get a bigger corner";
there is no bigger corner.

**`rounded-full` is allowed only when the element is an actual circle** - equal
width and height, and round is the point:

| Allowed `rounded-full` | Example |
| --- | --- |
| Avatars | `UserNav` trigger |
| Count badges | the cart's "2" |
| Status dots | agent availability |
| Spinners / loaders | `Loader2` |
| Slider thumbs | the price filter on `/search` |

**Everything else is `rounded-sm`**, including things that are currently pills:
buttons, chips, tags, keyword pills, the search input, category filters.

### Banned

Do not write any of these. There are no exceptions.

```
❌ rounded            (bare - 4px, off the scale entirely)
❌ rounded-md         ❌ rounded-lg      ❌ rounded-xl    ❌ rounded-2xl
❌ rounded-[16px]     ❌ rounded-[24px]  ❌ rounded-[2px]  ❌ any rounded-[…]
❌ rounded-(--r-xs)   ❌ rounded-(--r-sm)
❌ rounded-(--r-md)   ❌ rounded-(--r-lg)
```

### There is no exception: `rounded-media` is gone

There used to be a documented second value here - `rounded-media`, 18px, for
"full-bleed photographic surfaces", claimed by exactly one element (the hero
card on `/homepage`). It has been **removed**, along with its entry in
`design:check`'s legal list.

It was never real. No `--radius-media` token was ever declared, so Tailwind
emitted nothing for the class and the one card using it painted **square** -
which is how a written exception survives a year without anyone noticing it does
not work. The hero is `rounded-sm` now, like everything else.

The general point stands: a second value in the token file is only safe while it
stays narrow, and the narrowest it gets is zero.

### The `--r-*` scale is gone

`CHROME_VARS` and the two homepage token files used to define a *second* radius
scale that did not match Tailwind's:

| Token | Painted | |
| --- | --- | --- |
| `rounded-sm` (Tailwind) | **6px** | ✅ the rule |
| `rounded-(--r-sm)` (CHROME_VARS) | **18px** | ❌ three times too round |

The two read almost identically and meant completely different things. `--r-xs`,
`--r-sm`, `--r-md`, `--r-lg`, `--r-xl` and `--r-2xl` have been **deleted** from
`features/auth/server/tokens.ts` and `features/home/components/sections/tokens.ts`,
and both files carry a note saying not to re-add them. There is one radius.

### Raw CSS

Two legacy components render CSS text in a `<style>` block rather than classes
(`Homepage.tsx`, `DummyHomepage.tsx`). They use the literal `border-radius: 6px`,
**not** `var(--radius-sm)` - that token is declared in `@theme inline`, which
Tailwind inlines at class-use sites and does not emit as a `:root` custom
property, so `var(--radius-sm)` in hand-written CSS resolves to nothing and the
corner silently goes square. If you add raw CSS, use the literal.

---

## 2a. Buttons - one size

**Every button and button-shaped link in the UI is 44px tall.** Import the box,
do not retype it:

```tsx
import { BTN, BTN_ICON, BTN_BLOCK } from '@/components/shared/button-styles';

<Link className={cn(BTN, 'bg-eden text-white hover:bg-eden2')}>Book a Test</Link>
<button className={cn(BTN_ICON, 'hover:bg-eden/10')} aria-label="Search">…</button>
<Link className={cn(BTN, BTN_BLOCK, 'bg-eden text-white')}>Find My Test</Link>
```

| Token | Box |
| --- | --- |
| `BTN` | `h-[44px]` · `px-[18px]` · `gap-[8px]` · `text-[15px]/[22.5px]` · `rounded-sm` |
| `BTN_ICON` | `h-[44px] w-[44px]` · `rounded-sm` - icon-only, no horizontal padding |
| `BTN_BLOCK` | `w-full sm:w-auto` - full width on phones. **Height never changes.** |

44px is also the minimum touch target WCAG 2.5.8 and the iOS HIG ask for, so
the size that looks right is the size that is reachable. The header's nav links
compose from the same `BTN`, which is what keeps a hero CTA and a nav item
visibly one control rather than two systems.

**`BTN` is size only.** Colour, weight, border, shadow and motion stay with the
variant that owns them - a ghost button on the test pages should still look like
a ghost button, it should just not be its own size.

### Do not re-add a height

Compose with `cn()`, never string concatenation, so `tailwind-merge` drops the
loser instead of shipping both classes and letting source order decide. And do
not pass `h-*`, `min-h-*`, `py-*` or `px-*` through `className` - that is exactly
how the old sizes crept back:

```tsx
❌ <Cta className="h-15 py-0" />          // re-imposes the frame's 60px
❌ cn(BTN, 'px-[34px] pt-4 pb-[18px]')     // content overflows the fixed box
✅ <Cta className="tracking-[0.06px]" />   // non-size styling only
```

The primitive in [`components/ui/button.tsx`](../components/ui/button.tsx) is the
same 44px box. Its `xs` / `sm` / `lg` / `icon-*` variants are kept as **aliases**
of it - they still exist so admin call sites compile, but they no longer change
the size. That is deliberate.

### Scrollbars

Hidden site-wide in `app/globals.css` - `scrollbar-width: none` plus a
`::-webkit-scrollbar` reset on `*`, so an inner overflow pane cannot reintroduce
one. Scrolling itself is untouched: wheel, trackpad, touch and keyboard all work.

The trade: a scrolling region no longer advertises that it scrolls. Every pane
that scrolls today has another cue - a visible edge, or content clipped
mid-element. **If you add one that does not, give it a cue** rather than
reverting this.

---

## 3. Colour

There are three colour systems in this repo. This is the single most confusing
thing about the codebase, so: **which one you use depends on where you are.**

### 3a. KYG palette (`@theme` in `app/globals.css`) - the default

Real Tailwind utilities: `bg-eden`, `text-cord`, `border-zeus/[0.1]`. **Use these
for all storefront and marketing UI.**

| Role | Token | Hex |
| --- | --- | --- |
| Brand dark (buttons, CTAs, links) | `eden` | `#0E4D4B` |
| Brand dark, hover | `eden2` | `#15605D` |
| Brand accent (highlights) | `java` | `#25B5AB` |
| Page background (warm white) | `linenw` | `#FAF6EF` |
| Soft surface | `spring` | `#F6F3ED` |
| Heading / primary text | `mine` | `#222222` |
| Body text | `cape` | `#3A4A48` |
| Muted / secondary text | `cord` | `#5F6F6C` |
| Hairlines & borders | `zeus` at low alpha - `border-zeus/[0.1]` | `#1F1A14` |
| Error / destructive | `mojo` | `#C0432F` |
| Deep ground (hero, footer) | `bottle` / `abyss` | `#052422` / `#062927` |

There are more (`crimson`, `blush`, `gold`, `sand`, `mist`, …) - those are
**surface-specific**, sampled 1:1 from individual Figma frames for the PDP, test
pages and homepage. Do not reach for them on a new screen; they belong to the
screen they were sampled for.

### 3b. shadcn semantic tokens (`:root`, oklch) - admin & primitives only

`bg-primary`, `text-muted-foreground`, `border-border`. These drive
`components/ui/*` and the admin area. **Do not mix them into storefront pages** —
`--primary` and `eden` are the same teal by different routes, and using both in
one component makes it impossible to retheme either.

### 3c. `CHROME_VARS` - header and footer only

Inline CSS variables (`--cream`, `--ink-1`, `--teal`) applied via
`style={CHROME_VARS}` so the chrome renders identically in any route scope.

**Important:** these are *inline on the element*, so they do **not** inherit into
anything rendered as a sibling. Any overlay/portal that needs them must carry its
own `style={CHROME_VARS}` - see `SearchOverlay`, which rendered fully transparent
until it did.

### Which do I use?

| Building… | Use |
| --- | --- |
| A storefront / marketing page | **KYG palette** (§3a) |
| Something inside `components/ui` | shadcn semantic (§3b) |
| Header, footer, or a portal over them | `CHROME_VARS` (§3c) |

---

## 4. Typography

Loaded once in `app/layout.tsx`, exposed as CSS variables.

| Face | Variable | Used for |
| --- | --- | --- |
| Figtree | `--font-figtree` | Headings and UI - the primary face |
| Hind | `--font-hind` | Body copy on test pages |
| Cormorant Garamond | `--font-cormorant` | Serif italic accents only |
| Geist / Geist Mono | `--font-geist-sans` / `--font-geist-mono` | Admin, code, numerals |

**Scale.** The tree uses precise pixel sizes (`text-[14.5px]`) because it was
built against Figma frames. That is fine and should continue - but stay on these
steps rather than inventing new ones:

| Step | Size | Use |
| --- | --- | --- |
| Display | `text-[34px]` / `sm:text-[40px]` | Page titles |
| H2 | `text-[24px]` – `text-[30px]` | Section headings |
| H3 | `text-[18px]` – `text-[21px]` | Card titles |
| Body | `text-[15px]` | Default copy |
| Small | `text-[13px]` – `text-[13.5px]` | Meta, captions |
| Micro | `text-[11px]` – `text-[12px]` | Kickers, counts, badges |

Kickers/eyebrows are uppercase with wide tracking:
`text-[11px] font-semibold uppercase tracking-[0.18em] text-cord`.

Numbers that change in place (prices, counts, timers) get `tabular-nums` so they
do not jitter.

---

## 5. Elevation

Use the named shadow tokens. Do not write arbitrary `shadow-[...]` values.

| Token | Use |
| --- | --- |
| `shadow-kyg-card` | Default card / input resting state |
| `shadow-kyg-deep` | Modals, drawers, overlays |
| `shadow-kyg-dark` | On dark grounds |

`shadow-pdp-*` and `shadow-tst-*` belong to the PDP and test pages respectively —
same rule as the surface-specific colours: do not borrow them.

Hover lift on a card is `-translate-y-[3px]` plus a deeper shadow, over
`duration-200`. Keep it consistent; do not invent a bigger lift.

---

## 6. Motion

| Token | Value | Use |
| --- | --- | --- |
| `--e-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | The site's easing |
| Micro (hover, colour) | `duration-200` | |
| Panel / drawer | `duration-300` – `duration-450` | |

Do not animate `backdrop-filter`, and do not leave a `backdrop-blur` on a hidden
element - an invisible blurred panel still costs a full compositing pass on every
scroll frame. This cost the site p95 16.8ms → 8.5ms once removed from the header's
mega-menu; the note in `SiteHeader.tsx` has the measurements.

---

## 7. Reuse rules

1. **Check [COMPONENTS.md](COMPONENTS.md) first.** It is generated from the tree
   by `pnpm inventory`, so it is never stale.
2. **Used by one feature → keep it in that feature.** Used by two → promote it to
   `components/shared`. Never pre-share, never copy.
3. **Restyle primitives, don't wrap them.** If `Button` is the wrong shape, fix
   `components/ui/button.tsx`. A `PrettyButton` that wraps `Button` is a second
   button.
4. **Import rules** (CLAUDE.md §10): server/domain logic through the barrel
   `@/features/<name>`; feature client components by sub-path
   `@/features/<name>/components/...`.

---

## 8. Compliance

The tree obeys §1 and §2. `pnpm design:check` reports clean.

The migration that got it there, for the record:

| Rule | Before | After |
| --- | --- | --- |
| Non-compliant radius (Tailwind classes) | 456 in 112 files | 0 |
| Bare `rounded` (4px) | 63 in 26 files | 0 |
| `rounded-full` on pills | 214 | 0 |
| Raw CSS `border-radius` in `<style>` blocks | 77 | 0 |
| Page shell width ≠ 1600px | 41 in 30 files | 0 |
| Distinct corner radii site-wide | 30+ | **1** (6px, plus circles) |
| Distinct button heights | 6 (35 / 38 / 42 / 56 / 60 / 69px) | **1** (44px) |

`rounded-full` survives in 87 places, every one a genuine circle: dots and
count badges, decorative blurred glows, the avatar primitive, the switch, and the
two price-slider thumbs. The last three padded *pills* wearing it - the badge on
the About hero and the two chips laid over photographs in `GeneousCare` and
`WellnessPackages` - are `rounded-sm` now.

### Enforcing it

```bash
pnpm design:check                      # report everything
pnpm design:check --changed            # only files this branch touches
pnpm design:check --changed --strict   # exit 1 - for CI / pre-commit
```

The checker skips comment lines: several components carry notes quoting the old
radii by name to explain history, and flagging prose is noise.

Now the tree is clean, plain `pnpm design:check --strict` is a valid CI gate - it
fails the build on the first regression.

---

## 9. Checklist for new UI

Before you open a PR:

- [ ] Content column is `Container` (1600px), not a hand-rolled `max-w-*`
- [ ] Every corner is `rounded-sm` (6px), or `rounded-full` on a genuine circle
- [ ] Every button uses `BTN` / `BTN_ICON` - no `h-*`/`py-*` passed through `className`
- [ ] No bare `rounded`, no `rounded-[…]`, no `rounded-(--r-*)`
- [ ] Colours come from **one** system (§3) - KYG palette on storefront
- [ ] Shadow is a named token, not `shadow-[…]`
- [ ] Text size is on the scale in §4
- [ ] You checked [COMPONENTS.md](COMPONENTS.md) and did not build a duplicate
- [ ] `pnpm typecheck && pnpm lint` pass

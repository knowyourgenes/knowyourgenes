// =============================================================================
// scripts/inventory-components.mjs - regenerates docs/COMPONENTS.md
// -----------------------------------------------------------------------------
// Run: pnpm inventory
//
// The point of this script is that the inventory CANNOT go stale. A hand-written
// component list is wrong within a week and then actively harmful: you check it,
// see nothing, and build a second Button. This reads the tree instead.
//
// It is deliberately dumb about parsing - regexes over source text, no AST. A
// component that this misses is a component whose exports are written in a way
// nobody else in the repo writes them, and the fix is to write them normally.
// =============================================================================

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'docs', 'COMPONENTS.md');

/** Directories that hold renderable components, in the order they are listed. */
const AREAS = [
  { dir: 'components/ui', title: 'Primitives (`components/ui`)', note: 'shadcn/base-ui primitives. Restyle these rather than wrapping them.' },
  { dir: 'components/shared', title: 'Site chrome (`components/shared`)', note: 'Used by 2+ features. Anything here is the canonical version.' },
  { dir: 'components/site', title: 'Site scaffolding (`components/site`)', note: '' },
  { dir: 'components/api-docs', title: 'API docs (`components/api-docs`)', note: '' },
];

const IGNORE_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.git']);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/** Exported component-ish names. PascalCase only - hooks and helpers are not components. */
function exportedNames(src) {
  const names = new Set();
  const patterns = [
    /export\s+default\s+function\s+([A-Z]\w*)/g,
    /export\s+function\s+([A-Z]\w*)/g,
    /export\s+const\s+([A-Z]\w*)\s*[:=]/g,
    /export\s*\{\s*default\s+as\s+([A-Z]\w*)/g,
    /export\s*\{([^}]+)\}/g,
  ];
  for (const [i, re] of patterns.entries()) {
    for (const m of src.matchAll(re)) {
      if (i === patterns.length - 1) {
        for (const part of m[1].split(',')) {
          const name = part.split(/\s+as\s+/).pop().trim();
          if (/^[A-Z]\w*$/.test(name)) names.add(name);
        }
      } else if (m[1]) {
        names.add(m[1]);
      }
    }
  }
  return [...names];
}

/** First readable line of a docblock body. */
function firstLine(block) {
  return block
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, '').trim())
    .filter((l) => l && !l.startsWith('@') && !/^=+$/.test(l) && !/^-+$/.test(l))[0];
}

/**
 * One line describing what the file is.
 *
 * Anchored to the docblock that IMMEDIATELY precedes an exported PascalCase
 * component, NOT simply the first docblock in the file. Several components here
 * open with a documented constant (CENTRE_TRACK in SiteHeader, ALL_PRODUCTS in
 * SearchOverlay), and taking the first block described the constant instead of
 * the component.
 *
 * Falls back to the file's top-of-file `//` banner prose, then to any docblock.
 */
function description(src) {
  // `(?!\*\/)` keeps the body inside ONE docblock. A plain lazy `[\s\S]*?` will
  // happily span several blocks until it finds one that happens to be followed
  // by an export, and then report the FIRST block's text - which is how
  // SiteHeader ended up described as "the desktop three-column track".
  const anchored = src.match(
    /\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*export\s+(?:default\s+)?(?:function|const)\s+[A-Z]/
  );
  if (anchored) {
    const line = firstLine(anchored[1]);
    if (line) return truncate(line);
  }

  const banner = src
    .split('\n')
    .filter((l) => l.trim().startsWith('//'))
    .map((l) => l.replace(/^\s*\/\/\s?/, '').trim())
    .filter((l) => l && !/^=+$/.test(l) && !/^-+$/.test(l) && !l.startsWith('eslint'));
  // Skip the "features/x - title" banner line and take the prose under it.
  const prose = banner.find((l) => l.length > 30 && !l.includes('—') && !l.includes('---'));
  if (prose) return truncate(prose);

  const any = src.match(/\/\*\*\s*\n?([\s\S]*?)\*\//);
  const line = any && firstLine(any[1]);
  return line ? truncate(line) : '';
}

function truncate(s, n = 118) {
  const clean = s.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + '…' : clean;
}

function rowsFor(dir) {
  return walk(join(ROOT, dir))
    .sort()
    .map((file) => {
      const src = readFileSync(file, 'utf8');
      const rel = relative(ROOT, file).split(sep).join('/');
      const names = exportedNames(src);
      return {
        rel,
        names: names.length ? names.join(', ') : '—',
        client: /^\s*['"]use client['"]/m.test(src),
        desc: description(src),
      };
    });
}

function table(rows) {
  if (!rows.length) return '_None._\n';
  const head = '| Export | File | Env | What it is |\n| --- | --- | --- | --- |\n';
  return (
    head +
    rows
      .map((r) => `| \`${r.names}\` | [${r.rel}](../${r.rel}) | ${r.client ? 'client' : 'server'} | ${r.desc} |`)
      .join('\n') +
    '\n'
  );
}

// ---- features -------------------------------------------------------------
const featureDirs = readdirSync(join(ROOT, 'features'))
  .filter((f) => {
    try {
      return statSync(join(ROOT, 'features', f, 'components')).isDirectory();
    } catch {
      return false;
    }
  })
  .sort();

let total = 0;
const sections = [];

for (const area of AREAS) {
  const rows = rowsFor(area.dir);
  total += rows.length;
  sections.push(
    `## ${area.title}\n\n${area.note ? `${area.note}\n\n` : ''}${table(rows)}`
  );
}

const featureSections = featureDirs.map((f) => {
  const rows = rowsFor(join('features', f, 'components'));
  total += rows.length;
  return `### \`features/${f}\`\n\n${table(rows)}`;
});

const body = `<!-- GENERATED BY scripts/inventory-components.mjs - DO NOT EDIT BY HAND.
     Regenerate with: pnpm inventory -->

# Component inventory

**${total} components.** Read this before you build a new one.

The rule this file exists to enforce: **if a component already exists, use it - do
not build a second one on another page.** A "Button" that exists three times is
three things to restyle when the design changes, and they will drift.

Where to look, in order:

1. **\`components/ui\`** - primitives. If you need a button, input, dialog or
   dropdown, it is here. Restyle the primitive; never wrap it in a near-copy.
2. **\`components/shared\`** - site chrome used by 2+ features. Header, footer,
   container, logo, search overlay.
3. **\`features/<name>/components\`** - owned by one feature. If you need one from
   *another* feature, that is the signal to promote it to \`components/shared\`,
   not to copy it. See CLAUDE.md §2 rule 4.

Import rules (CLAUDE.md §10): server/domain logic through the feature barrel
\`@/features/<name>\`; feature **client** components by sub-path
\`@/features/<name>/components/...\`.

Styling rules live in [DESIGN.md](DESIGN.md). Anything new must follow them.

---

${sections.join('\n')}
## Feature components

Owned by one feature. Needed by a second feature? Promote it to
\`components/shared\` - do not copy it.

${featureSections.join('\n')}`;

writeFileSync(OUT, body);
console.log(`docs/COMPONENTS.md - ${total} components across ${AREAS.length + featureDirs.length} areas`);

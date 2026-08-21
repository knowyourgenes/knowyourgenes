// =============================================================================
// scripts/check-design.mjs - enforces docs/DESIGN.md
// -----------------------------------------------------------------------------
// Run: pnpm design:check              report everything
//      pnpm design:check --changed    only files changed vs origin/main
//      pnpm design:check --strict     exit 1 if anything is found
//      pnpm design:check --summary    counts only
//
// A rule nobody can check is a suggestion. This turns DESIGN.md §1 and §2 into
// something a pre-commit hook or CI job can fail on.
//
// It exits 0 by default ON PURPOSE. The tree carries ~456 known violations
// (DESIGN.md §8) and a check that always fails is a check everyone learns to
// ignore. Use --changed --strict in CI so NEW code is held to the rules while
// the legacy debt is migrated separately.
// =============================================================================

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const IGNORE = new Set(['node_modules', '.next', 'dist', 'build', '.git']);

/**
 * Any complete `rounded…` class token, matched WHOLE and judged afterwards.
 *
 * Matching the whole token matters. An earlier version tried to express "not
 * sm/full/none" as a lookahead inside the pattern, and the engine simply
 * backtracked around it: on `rounded-l-sm` it dropped the `-l` from the optional
 * side group, matched `rounded-` + `l`, and reported a violation on a compliant
 * class. 23 of 23 findings were that false positive. Decide in code, not regex.
 */
const RADIUS_TOKEN = /\brounded(?:-(?:\[[^\]]*\]|\((?:[^()]|\([^()]*\))*\)|[a-z0-9.]+))*/g;
const SIDES = new Set(['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br', 's', 'e', 'ss', 'se', 'es', 'ee']);
// 'media' used to sit here as a documented 18px exception for full-bleed
// photographic surfaces. It is gone (DESIGN.md §2): the --radius-media token it
// named was never declared, so the one card using it painted square, and the
// carve-out only stopped the checker from saying so. One radius means the legal
// set is closed - do not widen it without changing DESIGN.md first.
const LEGAL_VALUES = new Set(['sm', 'full', 'none']);

/** '' (bare) | the value after any side segment. */
function radiusValue(token) {
  const parts = token.split('-').slice(1); // drop 'rounded'
  if (parts.length && SIDES.has(parts[0])) parts.shift();
  return parts.join('-');
}

/** Page shells: anything >=1000px that is not the 1600px container. */
const BAD_SHELL = /\bmax-w-\[(1[0-9]{3}|[2-9][0-9]{3})px\]/g;

const RULES = [
  {
    re: RADIUS_TOKEN,
    id: 'radius',
    msg: 'non-compliant radius - use rounded-sm (or rounded-full on a true circle)',
    keep: (m) => {
      const v = radiusValue(m);
      return v !== '' && !LEGAL_VALUES.has(v);
    },
  },
  {
    re: RADIUS_TOKEN,
    id: 'radius-bare',
    msg: 'bare `rounded` (4px) - use rounded-sm',
    keep: (m) => radiusValue(m) === '',
  },
  { re: BAD_SHELL, id: 'shell-width', msg: 'page shell width - use <Container> (1600px)', keep: (m) => m !== 'max-w-[1600px]' },
];

/** A git call that returns '' instead of throwing - a missing ref is not fatal. */
function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE.has(entry)) continue;
    const full = `${dir}/${entry}`;
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

function targetFiles() {
  if (!args.has('--changed')) {
    return ['app', 'components', 'features'].flatMap((d) => walk(`${ROOT}/${d}`));
  }
  // Files this branch touches, so new work is held to the rules without the
  // legacy debt drowning the signal.
  //
  // Three SEPARATE git calls, each guarded. They were originally one `;`-joined
  // string, which works in sh and silently does not on Windows - cmd.exe passed
  // the whole thing to git as one command and it died on `origin/main...HEAD;`.
  let base = 'origin/main';
  if (!git(`rev-parse --verify ${base}`)) base = 'main';

  const out = [
    git(`diff --name-only ${base}...HEAD`), // committed on this branch
    git('diff --name-only'), // unstaged
    git('diff --name-only --cached'), // staged
    git('ls-files -o --exclude-standard'), // untracked
  ].join('\n');

  return [...new Set(out.split('\n').map((f) => f.trim()).filter((f) => f.endsWith('.tsx')))]
    .filter((f) => /^(app|components|features)\//.test(f))
    .map((f) => `${ROOT}/${f}`)
    .filter((f) => {
      try {
        return statSync(f).isFile();
      } catch {
        return false; // deleted in this branch
      }
    });
}

/**
 * Comment lines are prose, not markup.
 *
 * Several components carry "RADIUS TRAP" notes that quote the old arbitrary
 * radii by name to explain why they were used. Flagging those is noise: the
 * class does not exist, only the word does. Only judge real markup.
 */
const COMMENT_LINE = /^\s*(\/\/|\*|\/\*|\{\/\*)/;

const findings = [];
for (const file of targetFiles()) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  for (const rule of RULES) {
    lines.forEach((line, i) => {
      if (COMMENT_LINE.test(line)) return;
      for (const m of line.matchAll(rule.re)) {
        if (rule.keep && !rule.keep(m[0])) continue;
        findings.push({
          file: file.replace(`${ROOT}/`, '').replace(/\\/g, '/'),
          line: i + 1,
          rule: rule.id,
          match: m[0],
          msg: rule.msg,
        });
      }
    });
  }
}

const byRule = findings.reduce((acc, f) => ((acc[f.rule] = (acc[f.rule] ?? 0) + 1), acc), {});
const files = new Set(findings.map((f) => f.file));

if (!findings.length) {
  console.log('design:check - clean. Everything obeys docs/DESIGN.md §1–§2.');
  process.exit(0);
}

if (!args.has('--summary')) {
  const byFile = findings.reduce((acc, f) => ((acc[f.file] ??= []).push(f), acc), {});
  for (const [file, list] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n${file}  (${list.length})`);
    for (const f of list.slice(0, 12)) console.log(`  ${f.line}: ${f.match}  - ${f.msg}`);
    if (list.length > 12) console.log(`  … ${list.length - 12} more`);
  }
}

console.log(`\n──────────────────────────────────────────────`);
for (const [rule, n] of Object.entries(byRule)) console.log(`  ${rule.padEnd(14)} ${n}`);
console.log(`  ${'files'.padEnd(14)} ${files.size}`);
console.log(`  See docs/DESIGN.md §1 (width) and §2 (roundness).`);

process.exit(args.has('--strict') ? 1 : 0);

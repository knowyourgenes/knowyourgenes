/**
 * Walks every .ts/.tsx file in the repo, parses its import statements, and
 * builds an import graph. Then reports files that no one imports — candidates
 * for deletion.
 *
 * Excludes:
 *   - Entrypoints (Next.js pages, layouts, route handlers, middleware, configs)
 *   - Test files
 *   - Node modules + Prisma generated client
 *
 * Heuristic, not gospel. Always eyeball each entry before deleting.
 *
 *   pnpm tsx scripts/audit-unused.ts
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.turbo',
  'coverage',
  'public',
  'docs',
  'resource',
]);

// Files that are entrypoints — Next.js / build tooling references them by
// convention, not via TypeScript imports. We can't see those references from
// the import graph, so we treat these as "always used".
const ENTRYPOINT_PATTERNS = [
  /[/\\]page\.tsx?$/,
  /[/\\]layout\.tsx?$/,
  /[/\\]loading\.tsx?$/,
  /[/\\]error\.tsx?$/,
  /[/\\]not-found\.tsx?$/,
  /[/\\]route\.ts$/, // App Router route handlers
  /[/\\]middleware\.ts$/,
  /[/\\]proxy\.ts$/, // (this repo) custom NextAuth proxy
  /[/\\]instrumentation\.ts$/,
  /[/\\]opengraph-image\.tsx?$/,
  /^auth\.config\.ts$/,
  /^auth\.ts$/,
  /^next\.config\./,
  /^tailwind\.config\./,
  /^postcss\.config\./,
  /^eslint\.config\./,
  /^prisma\.config\./,
  /^vitest\.config\./,
  /^vite\.config\./,
  /^playwright\.config\./,
  /\.config\.(ts|js|mjs|cjs)$/,
];

const TEST_PATTERNS = [/\.test\.tsx?$/, /\.spec\.tsx?$/, /__tests__/];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const stat = statSync(p);
    if (stat.isDirectory()) {
      walk(p, out);
    } else if (/\.(ts|tsx)$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

function isEntrypoint(rel: string): boolean {
  return ENTRYPOINT_PATTERNS.some((re) => re.test(rel));
}
function isTest(rel: string): boolean {
  return TEST_PATTERNS.some((re) => re.test(rel));
}

// Extract import sources from a TS/TSX file. Picks up:
//   import X from 'foo'
//   import { X } from 'foo'
//   import 'foo'
//   const X = require('foo')
//   import('foo')
// The `s` (dotAll) flag is critical — multi-line `import { … } from '…'` is
// common and a non-dotAll regex would miss them all.
const IMPORT_RES = [
  /\bimport\s+(?:[\s\S]+?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\bimport\s+['"]([^'"]+)['"]/g,
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  // `export { x } from '…'` re-exports also create dependencies.
  /\bexport\s+(?:\*|\{[\s\S]+?\})\s+from\s+['"]([^'"]+)['"]/g,
];

function imports(file: string): string[] {
  const src = readFileSync(file, 'utf8');
  const out = new Set<string>();
  for (const re of IMPORT_RES) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) out.add(m[1]);
  }
  return [...out];
}

// Best-effort resolution. Handles:
//   '@/lib/foo'          -> <root>/lib/foo[.ts|.tsx|/index.ts|/index.tsx]
//   './foo'              -> relative to importing file
//   'foo'                -> ignored (npm dep)
function resolve(spec: string, importer: string): string | null {
  let abs: string;
  if (spec.startsWith('@/')) abs = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith('.')) abs = path.resolve(path.dirname(importer), spec);
  else return null; // bare npm dep

  const tries = [
    abs + '.ts',
    abs + '.tsx',
    path.join(abs, 'index.ts'),
    path.join(abs, 'index.tsx'),
    abs,
  ];
  for (const t of tries) {
    try {
      if (statSync(t).isFile()) return t;
    } catch {
      /* not found */
    }
  }
  return null;
}

function main() {
  const files = walk(ROOT);
  const incoming = new Map<string, Set<string>>();
  for (const f of files) incoming.set(f, new Set());

  for (const f of files) {
    for (const spec of imports(f)) {
      const resolved = resolve(spec, f);
      if (resolved && incoming.has(resolved)) {
        incoming.get(resolved)!.add(f);
      }
    }
  }

  const orphans: string[] = [];
  for (const f of files) {
    const rel = path.relative(ROOT, f);
    if (isEntrypoint(rel) || isTest(rel)) continue;
    if (incoming.get(f)!.size === 0) orphans.push(rel);
  }

  console.log(`Scanned ${files.length} .ts/.tsx files.\n`);
  console.log(`Orphan files (no importers, not entrypoints): ${orphans.length}\n`);
  for (const o of orphans.sort()) console.log('  ' + o);
}

main();

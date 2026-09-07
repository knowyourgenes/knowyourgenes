#!/usr/bin/env node
/**
 * `prisma migrate deploy`, but only where deploying a migration is the right
 * thing to do.
 *
 *   node scripts/vercel-migrate.mjs
 *
 * WHY THIS EXISTS. The Vercel install command used to end in a bare
 * `npx prisma migrate deploy`, which fails the entire build in two situations
 * that are not actually errors:
 *
 *   1. DATABASE_URL is not set for the environment being built. Preview
 *      deployments of a branch commonly have no database wired, and Prisma 7
 *      then reports "The datasource.url property is required in your Prisma
 *      config file" - because prisma.config.ts resolves `url` from
 *      process.env.DATABASE_URL, which is undefined. Nothing is wrong with the
 *      code; there is simply nothing to migrate against.
 *
 *   2. A preview branch shares the production database. Running `migrate
 *      deploy` there applies an UNMERGED branch's migrations to production
 *      schema, from a build nobody has reviewed yet. That is worse than not
 *      migrating.
 *
 * So: production migrates, previews do not, and a build with no database still
 * succeeds. server/prisma.ts already defers a missing DATABASE_URL to query
 * time (it falls back to a noop connection string), so the app builds and
 * renders either way - a page that needs the database degrades rather than
 * 500s.
 *
 * To migrate from a preview on purpose, set MIGRATE_ON_PREVIEW=1 on that
 * environment.
 */
import { spawnSync } from 'node:child_process';

const url = process.env.DATABASE_URL;
const env = process.env.VERCEL_ENV ?? 'local';
const forced = process.env.MIGRATE_ON_PREVIEW === '1';

function skip(reason) {
  console.log(`[migrate] skipped - ${reason}`);
  console.log('[migrate] the build continues; no schema change was applied.');
  process.exit(0);
}

if (!url) skip(`DATABASE_URL is not set for this environment (VERCEL_ENV=${env})`);
if (env === 'preview' && !forced) {
  skip('preview deployments do not migrate. Set MIGRATE_ON_PREVIEW=1 to override.');
}

console.log(`[migrate] running prisma migrate deploy (VERCEL_ENV=${env})`);
const run = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

// A real migration failure MUST still fail the build - shipping code against a
// schema that was not applied is the failure this script must never hide.
process.exit(run.status ?? 1);

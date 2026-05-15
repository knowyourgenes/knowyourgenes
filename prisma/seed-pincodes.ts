/**
 * Full-India Pincode Seeder
 * =========================
 *
 * Seeds the `ServiceArea` table with every Indian pincode (~155K rows).
 * All rows are inserted with `active = false` - admin opts in per-pincode
 * (or in bulk by state/district) through the admin UI.
 *
 * Data source
 * -----------
 * Default location: resource/India_pincodes.csv (committed to the repo).
 *
 * The seeder auto-detects the column layout — any CSV with a header row
 * containing at least a pincode column and an area/name column works.
 * Recognised header aliases:
 *   Pincode  : Pincode | PIN | PincodeNumber
 *   Area     : Name | OfficeName | Office | Area | Locality
 *   District : District | DistrictName
 *   State    : State | StateName
 *
 * To use a different file (e.g. an updated data.gov.in dump):
 *   https://www.data.gov.in/catalog/all-india-pincode-directory
 *
 * Usage
 * -----
 *   pnpm db:seed-pincodes
 *   pnpm db:seed-pincodes path/to/other.csv
 *
 * Re-seeding
 * ----------
 * `createMany` with `skipDuplicates: true` against the (pincode, area)
 * composite-unique means re-running only inserts NEW (pincode, area) pairs.
 * Existing rows keep their admin-set `active` flag intact. Pincodes /
 * localities change rarely (a few dozen per year) — re-seed annually.
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createReadStream, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';

const FILE_PATH = process.argv[2] ?? path.join(process.cwd(), 'resource', 'India_pincodes.csv');

// data.gov.in ships ALL-CAPS state/district names. Normalise to Title Case
// so admin filters don't have to care about source casing. Keep "and" / "of"
// lowercase to match common Indian government conventions.
const LOWERS = new Set(['and', 'of', 'the']);
function normaliseCase(s: string): string {
  if (!s) return s;
  return s
    .toLowerCase()
    .split(' ')
    .map((w, i) => (i > 0 && LOWERS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

// Minimal RFC-4180 parser: handles quoted fields with embedded commas.
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

type ColMap = {
  pincode: number;
  area: number;
  district?: number;
  state?: number;
};

function resolveColumns(headers: string[]): ColMap | null {
  const lower = headers.map((h) =>
    h
      .trim()
      .toLowerCase()
      .replace(/[\s_-]/g, '')
  );
  const pick = (candidates: string[]) => {
    for (const c of candidates) {
      const i = lower.indexOf(c);
      if (i >= 0) return i;
    }
    return undefined;
  };
  const pincode = pick(['pincode', 'pin', 'pincodenumber']);
  const area = pick(['name', 'officename', 'office', 'area', 'locality']);
  const district = pick(['districtname', 'district']);
  const state = pick(['statename', 'state']);
  if (pincode === undefined || area === undefined) return null;
  return { pincode, area, district, state };
}

async function main() {
  if (!existsSync(FILE_PATH)) {
    console.error(`❌ Pincode CSV not found at: ${FILE_PATH}\n`);
    console.error('  Default location is resource/India_pincodes.csv (committed to the repo).');
    console.error('  If you have an updated dump, pass its path explicitly:');
    console.error('    pnpm db:seed-pincodes path/to/other.csv');
    console.error('  Required columns (any order): Pincode, Name (or OfficeName / Area)');
    console.error('  Optional:                     District, State');
    process.exit(1);
  }

  console.log(`📂 Reading ${FILE_PATH}`);

  const rl = createInterface({
    input: createReadStream(FILE_PATH, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let colMap: ColMap | null = null;
  // One row per (pincode, area) — many Indian pincodes cover multiple post
  // offices / localities. Dedupe key is (pincode + area) so the same locality
  // isn't inserted twice if the source CSV has stray duplicates.
  const byPincodeArea = new Map<string, { pincode: string; area: string; district: string; state: string }>();
  let lineNum = 0;
  let skippedNoArea = 0;

  for await (const raw of rl) {
    lineNum++;
    const line = raw.replace(/﻿/g, ''); // strip BOM
    if (!line.trim()) continue;
    const row = parseCsvLine(line);
    if (!colMap) {
      colMap = resolveColumns(row);
      if (!colMap) {
        console.error('❌ Could not find Pincode / Name (or OfficeName / Area) columns in header:');
        console.error('   ' + row.map((c) => JSON.stringify(c)).join(', '));
        process.exit(1);
      }
      continue;
    }
    const pincode = (row[colMap.pincode] ?? '').trim();
    if (!/^\d{6}$/.test(pincode)) continue;
    const area = normaliseCase((row[colMap.area] ?? '').trim());
    if (!area) {
      skippedNoArea++;
      continue;
    }
    const key = `${pincode}|${area.toLowerCase()}`;
    if (byPincodeArea.has(key)) continue; // CSV row duplicate
    const district = colMap.district != null ? normaliseCase((row[colMap.district] ?? '').trim()) : '';
    const state = colMap.state != null ? normaliseCase((row[colMap.state] ?? '').trim()) : '';
    byPincodeArea.set(key, { pincode, area, district, state });
  }

  const uniquePincodes = new Set([...byPincodeArea.values()].map((r) => r.pincode)).size;
  console.log(
    `📊 Parsed ${byPincodeArea.size.toLocaleString('en-IN')} (pincode, area) rows ` +
      `covering ${uniquePincodes.toLocaleString('en-IN')} unique pincodes ` +
      `from ${lineNum.toLocaleString('en-IN')} input rows` +
      (skippedNoArea > 0 ? ` (${skippedNoArea} skipped — missing area name)` : '')
  );

  const rows = [...byPincodeArea.values()].map((r) => ({
    pincode: r.pincode,
    area: r.area,
    district: r.district,
    state: r.state,
    city: r.district,
    active: false,
  }));

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const BATCH = 5000;
  let inserted = 0;
  console.log(`⏳ Inserting (skipDuplicates, batch ${BATCH})…`);
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const res = await prisma.serviceArea.createMany({ data: batch, skipDuplicates: true });
    inserted += res.count;
    process.stdout.write(
      `\r  ${Math.min(i + BATCH, rows.length).toLocaleString('en-IN')} / ${rows.length.toLocaleString('en-IN')}`
    );
  }
  console.log('');
  const existing = rows.length - inserted;
  console.log(
    `✅ Inserted ${inserted.toLocaleString('en-IN')} new; ${existing.toLocaleString('en-IN')} already existed (preserved).`
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

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
 * Download the official "All India Pincode Directory" CSV from:
 *   https://www.data.gov.in/catalog/all-india-pincode-directory
 *
 * Save it as `data/pincodes.csv` in the repo root. The seeder auto-detects
 * the column layout - any CSV with a header row containing at least
 * `Pincode` and `OfficeName` (or `area`) works.
 *
 * Usage
 * -----
 *   pnpm db:seed-pincodes
 *   pnpm db:seed-pincodes path/to/other.csv
 *
 * Re-seeding
 * ----------
 * `createMany` with `skipDuplicates: true` means re-running only inserts
 * NEW pincodes. Existing rows keep their admin-set `active` flag intact.
 * Pincodes change rarely (a few dozen per year) - re-seed annually.
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createReadStream, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';

const FILE_PATH = process.argv[2] ?? path.join(process.cwd(), 'data', 'pincodes.csv');

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
  const area = pick(['officename', 'office', 'area', 'locality']);
  const district = pick(['districtname', 'district']);
  const state = pick(['statename', 'state']);
  if (pincode === undefined || area === undefined) return null;
  return { pincode, area, district, state };
}

async function main() {
  if (!existsSync(FILE_PATH)) {
    console.error(`❌ Pincode CSV not found at: ${FILE_PATH}\n`);
    console.error('  Download the All India Pincode Directory from:');
    console.error('    https://www.data.gov.in/catalog/all-india-pincode-directory');
    console.error(`  Save as: ${path.relative(process.cwd(), FILE_PATH)}\n`);
    console.error('  Required columns (any order): Pincode, OfficeName');
    console.error('  Optional:                     DistrictName, StateName');
    process.exit(1);
  }

  console.log(`📂 Reading ${FILE_PATH}`);

  const rl = createInterface({
    input: createReadStream(FILE_PATH, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let colMap: ColMap | null = null;
  const byPincode = new Map<string, { pincode: string; area: string; district: string; state: string }>();
  let lineNum = 0;

  for await (const raw of rl) {
    lineNum++;
    const line = raw.replace(/﻿/g, ''); // strip BOM
    if (!line.trim()) continue;
    const row = parseCsvLine(line);
    if (!colMap) {
      colMap = resolveColumns(row);
      if (!colMap) {
        console.error('❌ Could not find Pincode / OfficeName columns in header:');
        console.error('   ' + row.map((c) => JSON.stringify(c)).join(', '));
        process.exit(1);
      }
      continue;
    }
    const pincode = (row[colMap.pincode] ?? '').trim();
    if (!/^\d{6}$/.test(pincode)) continue;
    if (byPincode.has(pincode)) continue; // keep first row per pincode
    const area = normaliseCase((row[colMap.area] ?? '').trim()) || 'Unknown';
    const district = colMap.district != null ? normaliseCase((row[colMap.district] ?? '').trim()) : '';
    const state = colMap.state != null ? normaliseCase((row[colMap.state] ?? '').trim()) : '';
    byPincode.set(pincode, { pincode, area, district, state });
  }

  console.log(
    `📊 Parsed ${byPincode.size.toLocaleString('en-IN')} unique pincodes from ${lineNum.toLocaleString('en-IN')} rows`
  );

  const rows = [...byPincode.values()].map((r) => ({
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

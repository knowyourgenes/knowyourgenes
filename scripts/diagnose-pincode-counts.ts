/**
 * Reconciles "CSV row count" vs "DB row count" for ServiceArea.
 * Run with: pnpm tsx scripts/diagnose-pincode-counts.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';

// Same RFC-4180 parser the seeder uses.
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
      } else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out;
}

async function main() {
  const file = path.join(process.cwd(), 'resource', 'India_pincodes.csv');
  const rl = createInterface({ input: createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity });

  let totalLines = 0;
  let dataLines = 0;
  let badPin = 0;
  let emptyArea = 0;
  const csCsv = new Set<string>(); // case-sensitive (pincode + exact area)
  const ciCsv = new Set<string>(); // case-insensitive (matches seeder dedup)
  let isHeader = true;

  for await (const raw of rl) {
    totalLines++;
    const line = raw.replace(/﻿/g, '');
    if (!line.trim()) continue;
    if (isHeader) {
      isHeader = false;
      continue;
    }
    dataLines++;
    const cols = parseCsvLine(line);
    // CSV columns: Name, District, State, Country, Pincode
    const name = (cols[0] ?? '').trim();
    const pin = (cols[4] ?? '').trim();
    if (!/^\d{6}$/.test(pin)) {
      badPin++;
      continue;
    }
    if (!name) {
      emptyArea++;
      continue;
    }
    csCsv.add(`${pin}|${name}`);
    ciCsv.add(`${pin}|${name.toLowerCase()}`);
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  const dbRows = await prisma.serviceArea.count();
  const dbDistinctCi = (
    await prisma.$queryRawUnsafe<Array<{ c: bigint }>>(
      'SELECT COUNT(DISTINCT (pincode || \'|\' || LOWER(area))) AS c FROM "ServiceArea"'
    )
  )[0]?.c;

  console.log('CSV');
  console.log(`  total lines (incl. header)           : ${totalLines.toLocaleString('en-IN')}`);
  console.log(`  data lines (excl. header)            : ${dataLines.toLocaleString('en-IN')}`);
  console.log(`  rows skipped — invalid pincode       : ${badPin.toLocaleString('en-IN')}`);
  console.log(`  rows skipped — empty area / name     : ${emptyArea.toLocaleString('en-IN')}`);
  console.log(`  unique (pincode + EXACT area)        : ${csCsv.size.toLocaleString('en-IN')}`);
  console.log(`  unique (pincode + LOWERCASE area)    : ${ciCsv.size.toLocaleString('en-IN')}`);
  console.log('');
  console.log('DB');
  console.log(`  total rows in ServiceArea            : ${dbRows.toLocaleString('en-IN')}`);
  console.log(`  unique (pincode + LOWERCASE area)    : ${Number(dbDistinctCi).toLocaleString('en-IN')}`);
  console.log('');
  console.log('Diff CSV(case-insensitive) - DB(total) : ' + (ciCsv.size - dbRows));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

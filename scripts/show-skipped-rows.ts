/**
 * Lists every CSV row the seeder skipped, with the exact reason.
 *
 *   pnpm tsx scripts/show-skipped-rows.ts
 *   pnpm tsx scripts/show-skipped-rows.ts --limit 50
 */
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';

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

const LIMIT = Number(process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1] ?? '20');
const FILE = path.join(process.cwd(), 'resource', 'India_pincodes.csv');

async function main() {
  const rl = createInterface({ input: createReadStream(FILE, { encoding: 'utf8' }), crlfDelay: Infinity });

  const badPin: Array<{ line: number; raw: string }> = [];
  const emptyArea: Array<{ line: number; raw: string }> = [];
  const intraDupes: Array<{ line: number; raw: string; firstSeenAt: number }> = [];
  const seen = new Map<string, number>(); // pin|lower(area) -> first line number

  let lineNum = 0;
  let isHeader = true;
  for await (const raw of rl) {
    lineNum++;
    const line = raw.replace(/﻿/g, '');
    if (!line.trim()) continue;
    if (isHeader) {
      isHeader = false;
      continue;
    }
    const cols = parseCsvLine(line);
    const name = (cols[0] ?? '').trim();
    const pin = (cols[4] ?? '').trim();
    if (!/^\d{6}$/.test(pin)) {
      badPin.push({ line: lineNum, raw: line });
      continue;
    }
    if (!name) {
      emptyArea.push({ line: lineNum, raw: line });
      continue;
    }
    const key = `${pin}|${name.toLowerCase()}`;
    const firstSeenAt = seen.get(key);
    if (firstSeenAt !== undefined) {
      intraDupes.push({ line: lineNum, raw: line, firstSeenAt });
      continue;
    }
    seen.set(key, lineNum);
  }

  console.log('═══ INVALID PINCODE (column 5 not /^\\d{6}$/) ═══');
  console.log(`Total: ${badPin.length}`);
  for (const r of badPin) console.log(`  L${r.line}: ${r.raw}`);
  console.log('');

  console.log('═══ EMPTY AREA NAME (column 1 blank/whitespace) ═══');
  console.log(`Total: ${emptyArea.length}`);
  for (const r of emptyArea) console.log(`  L${r.line}: ${r.raw}`);
  console.log('');

  console.log('═══ INTRA-CSV (pincode, area) DUPLICATES ═══');
  console.log(`Total: ${intraDupes.length}`);
  console.log(`Showing first ${Math.min(LIMIT, intraDupes.length)}:`);
  for (const r of intraDupes.slice(0, LIMIT)) {
    console.log(`  L${r.line} (first seen at L${r.firstSeenAt}): ${r.raw}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

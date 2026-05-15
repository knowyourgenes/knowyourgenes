/**
 * One-shot script: activate every ServiceArea row inside the official
 * Delhi NCR master plan boundary.
 *
 *   Delhi      : full NCT (all districts)
 *   Haryana    : 14 sub-region districts
 *   Uttar Pradesh: 8 sub-region districts
 *   Rajasthan  : Alwar + Bharatpur
 *
 * Some districts (Nuh / Mewat, Palwal, Charkhi Dadri, Hapur, Shamli) were
 * carved out of parent districts after our pincode dump was generated. Rows
 * for those will currently show 0 updated; that's expected — when a fresher
 * pincode CSV is reseeded they'll light up automatically.
 *
 *   pnpm tsx scripts/activate-delhi-ncr.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const TARGETS: Array<{ state: string; district?: string }> = [
  // Whole NCT
  { state: 'Delhi' },

  // Haryana sub-region (14)
  { state: 'Haryana', district: 'Gurgaon' }, // CSV name; new name "Gurugram"
  { state: 'Haryana', district: 'Faridabad' },
  { state: 'Haryana', district: 'Sonipat' },
  { state: 'Haryana', district: 'Panipat' },
  { state: 'Haryana', district: 'Rohtak' },
  { state: 'Haryana', district: 'Jhajjar' },
  { state: 'Haryana', district: 'Rewari' },
  { state: 'Haryana', district: 'Palwal' },
  { state: 'Haryana', district: 'Nuh' }, // a.k.a. Mewat
  { state: 'Haryana', district: 'Mewat' },
  { state: 'Haryana', district: 'Bhiwani' },
  { state: 'Haryana', district: 'Charkhi Dadri' },
  { state: 'Haryana', district: 'Mahendragarh' },
  { state: 'Haryana', district: 'Jind' },
  { state: 'Haryana', district: 'Karnal' },

  // Uttar Pradesh sub-region (8)
  { state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar' },
  { state: 'Uttar Pradesh', district: 'Ghaziabad' },
  { state: 'Uttar Pradesh', district: 'Meerut' },
  { state: 'Uttar Pradesh', district: 'Bulandshahr' },
  { state: 'Uttar Pradesh', district: 'Bagpat' }, // CSV name; new name "Baghpat"
  { state: 'Uttar Pradesh', district: 'Baghpat' },
  { state: 'Uttar Pradesh', district: 'Hapur' },
  { state: 'Uttar Pradesh', district: 'Muzaffarnagar' },
  { state: 'Uttar Pradesh', district: 'Shamli' },

  // Rajasthan sub-region (2)
  { state: 'Rajasthan', district: 'Alwar' },
  { state: 'Rajasthan', district: 'Bharatpur' },
];

async function main() {
  let grandTotal = 0;
  for (const t of TARGETS) {
    const where = t.district ? { state: t.state, district: t.district } : { state: t.state };
    const res = await prisma.serviceArea.updateMany({ where, data: { active: true } });
    const label = t.district ? `${t.state} / ${t.district}` : `${t.state} (whole state)`;
    if (res.count > 0) {
      console.log(`  ✓ ${label.padEnd(40)} ${res.count.toLocaleString('en-IN').padStart(7)} rows activated`);
    } else {
      console.log(`    ${label.padEnd(40)} (no matching rows — likely a newer district not in CSV)`);
    }
    grandTotal += res.count;
  }

  // Sanity check: how many distinct pincodes are we now serving?
  const activePincodes = await prisma.serviceArea.findMany({
    where: { active: true },
    distinct: ['pincode'],
    select: { pincode: true },
  });
  console.log('');
  console.log(`✅ Total area rows activated: ${grandTotal.toLocaleString('en-IN')}`);
  console.log(`✅ Unique pincodes now accepting orders: ${activePincodes.length.toLocaleString('en-IN')}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

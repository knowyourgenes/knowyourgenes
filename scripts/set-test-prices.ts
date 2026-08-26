/**
 * One-off: set every Package to ₹1 for pre-launch payment testing.
 *
 *   npx tsx --env-file=.env scripts/set-test-prices.ts          # set all to ₹1
 *   npx tsx --env-file=.env scripts/set-test-prices.ts restore  # put real prices back
 *
 * The current prices are written to prisma/price-backup.json (and an equivalent
 * price-restore.sql) BEFORE anything is changed, so this is reversible.
 */
import { prisma } from '../server/prisma';
import fs from 'node:fs';
import path from 'node:path';

const BACKUP = path.join('prisma', 'price-backup.json');
const RESTORE_SQL = path.join('prisma', 'price-restore.sql');

const rupees = (paise: number | null) => (paise === null ? 'null' : `₹${(paise / 100).toLocaleString('en-IN')}`);

async function show(label: string) {
  const rows = await prisma.package.findMany({
    select: { slug: true, name: true, price: true, compareAtPrice: true, kitShippingFee: true },
    orderBy: { name: 'asc' },
  });
  console.log(`\n${label}`);
  for (const p of rows) {
    console.log(
      `  ${p.name.padEnd(26)} ${rupees(p.price).padEnd(9)} was ${rupees(p.compareAtPrice).padEnd(9)} ship ${rupees(p.kitShippingFee)}`
    );
  }
  return rows;
}

async function main() {
  const mode = process.argv[2] === 'restore' ? 'restore' : 'set';

  if (mode === 'restore') {
    if (!fs.existsSync(BACKUP)) {
      console.error(`No ${BACKUP} found - nothing to restore from.`);
      process.exitCode = 1;
      return;
    }
    const saved = JSON.parse(fs.readFileSync(BACKUP, 'utf8')) as {
      slug: string;
      price: number;
      compareAtPrice: number | null;
      kitShippingFee: number;
    }[];
    for (const p of saved) {
      await prisma.package.update({
        where: { slug: p.slug },
        data: { price: p.price, compareAtPrice: p.compareAtPrice, kitShippingFee: p.kitShippingFee },
      });
    }
    console.log(`Restored ${saved.length} packages from ${BACKUP}.`);
    await show('NOW:');
    return;
  }

  const before = await show('BEFORE:');

  // Back up before touching anything. Written as both JSON (for the restore
  // branch above) and SQL (so the prices can be put back without this script).
  fs.writeFileSync(BACKUP, JSON.stringify(before, null, 2));
  fs.writeFileSync(
    RESTORE_SQL,
    before
      .map(
        (p) =>
          `UPDATE "Package" SET price=${p.price}, "compareAtPrice"=${p.compareAtPrice ?? 'NULL'}, ` +
          `"kitShippingFee"=${p.kitShippingFee} WHERE slug='${p.slug}';`
      )
      .join('\n') + '\n'
  );
  console.log(`\nBacked up to ${BACKUP} and ${RESTORE_SQL}`);

  // compareAtPrice is cleared too: leaving ₹9,999 beside a ₹1 price renders a
  // "100% off" badge. kitShippingFee goes to 0 so checkout charges exactly ₹1
  // rather than ₹1 + ₹199 of courier.
  const res = await prisma.package.updateMany({
    data: { price: 100, compareAtPrice: null, kitShippingFee: 0 },
  });
  console.log(`\nUpdated ${res.count} packages to ₹1.`);

  await show('AFTER:');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

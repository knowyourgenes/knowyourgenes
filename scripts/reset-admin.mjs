/**
 * Admin reset utility.
 *
 *   node --env-file=.env scripts/reset-admin.mjs                 # DRY RUN: list current admins + dependent rows
 *   node --env-file=.env scripts/reset-admin.mjs --apply         # remove existing admins (soft-delete + demote) and create a fresh one
 *   node --env-file=.env scripts/reset-admin.mjs --apply --hard  # HARD DELETE existing admin rows (only if no dependent data)
 *
 * "Remove" defaults to the app's own soft-delete pattern (set deletedAt +
 * demote role to USER): it revokes admin access AND blocks login (authorize()
 * checks deletedAt) without cascading into orders/reports/notifications.
 * --hard physically deletes rows and will fail if the admin has dependent data.
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const DB = process.env.DATABASE_URL;
if (!DB) {
  console.error('DATABASE_URL not set. Run with: node --env-file=.env scripts/reset-admin.mjs');
  process.exit(1);
}
const APPLY = process.argv.includes('--apply');
const HARD = process.argv.includes('--hard');

const NEW_ADMIN_EMAIL = process.env.NEW_ADMIN_EMAIL || 'admin@knowyourgenes.in';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DB }) });

function genPassword() {
  // Strong, readable-enough password: 3 words-ish base + symbols + digits.
  const b = randomBytes(9).toString('base64').replace(/[^A-Za-z0-9]/g, '');
  return `Kyg-${b}-${randomBytes(2).toString('hex')}`;
}

async function dependents(userId) {
  const [orders, reportsUploaded, reportsReviewed, notifications, accounts, addresses, labAdmin] =
    await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.report.count({ where: { uploadedById: userId } }),
      prisma.report.count({ where: { reviewedById: userId } }),
      prisma.notification.count({ where: { userId } }),
      prisma.account.count({ where: { userId } }),
      prisma.address.count({ where: { userId } }),
      prisma.lab.count({ where: { userId } }),
    ]);
  return { orders, reportsUploaded, reportsReviewed, notifications, accounts, addresses, labAdmin };
}

async function main() {
  console.log(`DB: ${DB.replace(/:[^:@/]+@/, ':****@')}\n`);

  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, email: true, name: true, deletedAt: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Current ADMIN users: ${admins.length}`);
  for (const a of admins) {
    const d = await dependents(a.id);
    const busy = Object.entries(d).filter(([, n]) => n > 0);
    console.log(
      `  • ${a.email ?? '(no email)'}  id=${a.id}${a.deletedAt ? '  [already soft-deleted]' : ''}` +
        (busy.length ? `\n      dependent rows: ${busy.map(([k, n]) => `${k}=${n}`).join(', ')}` : `\n      dependent rows: none`),
    );
  }

  if (!APPLY) {
    console.log(
      `\nDRY RUN. Nothing changed.\n` +
        `Re-run with --apply to remove these and create a fresh admin (safe soft-delete + demote),\n` +
        `or --apply --hard to physically delete rows (fails if dependent rows exist).`,
    );
    await prisma.$disconnect();
    return;
  }

  // ---- APPLY ----
  for (const a of admins) {
    if (HARD) {
      await prisma.user.delete({ where: { id: a.id } });
      console.log(`  ✗ hard-deleted ${a.email}`);
    } else {
      // Soft-delete + demote + also drop any OAuth Accounts + Sessions so the
      // account is fully locked out of both credential and Google login.
      await prisma.$transaction([
        prisma.account.deleteMany({ where: { userId: a.id } }),
        prisma.session.deleteMany({ where: { userId: a.id } }),
        prisma.user.update({
          where: { id: a.id },
          data: { role: 'USER', deletedAt: new Date(), passwordHash: null },
        }),
      ]);
      console.log(`  ✓ removed (soft-deleted + demoted) ${a.email}`);
    }
  }

  const password = process.env.NEW_ADMIN_PASSWORD || genPassword();
  const passwordHash = await bcrypt.hash(password, 12);

  // If the target email still exists (e.g. we only soft-deleted a same-email
  // row), reactivate+promote it; else create fresh.
  const existing = await prisma.user.findUnique({ where: { email: NEW_ADMIN_EMAIL } });
  const admin = existing
    ? await prisma.user.update({
        where: { email: NEW_ADMIN_EMAIL },
        data: { role: 'ADMIN', passwordHash, deletedAt: null, name: 'KYG Admin' },
      })
    : await prisma.user.create({
        data: { email: NEW_ADMIN_EMAIL, name: 'KYG Admin', role: 'ADMIN', passwordHash },
      });

  console.log(`\n============ NEW ADMIN CREATED ============`);
  console.log(`  Login URL: /login`);
  console.log(`  Email:     ${admin.email}`);
  console.log(`  Password:  ${password}`);
  console.log(`  Role:      ADMIN`);
  console.log(`===========================================`);
  console.log(`(Log in, then change this password.)`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

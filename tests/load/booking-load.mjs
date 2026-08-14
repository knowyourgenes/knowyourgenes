/**
 * Booking load harness - DB-level capacity test for the paid-booking path.
 *
 * Why DB-level (not HTTP): /api/checkout is behind a next-auth **JWT** session,
 * so an HTTP load tool would need a real signed session cookie per virtual user
 * (painful to mint). The real capacity ceiling for booking is the database
 * write path, so this harness exercises exactly that - faithfully mirroring the
 * production sequence:
 *
 *   1. nextOrderNumber(): COUNT(orders this year) then build KYG-YYYY-NNNNNN
 *      -> this is the known contention point (see features/orders/server/orders.ts:14
 *         "if we hit concurrent inserts > 10/sec we'll need a Postgres sequence").
 *   2. order.create({ ...order, payments: { create PENDING } })  (checkout)
 *   3. mark paid + payment CAPTURED                              (verify/webhook)
 *   4. linkLabAndNotify: lab.findFirst -> order.updateMany(labId:null guard)
 *      -> notification.create -> orderEvent.create               (the new flow)
 *
 * It reports throughput and latency percentiles under a configurable closed-loop
 * concurrency, and - critically - counts duplicate order numbers, which is how
 * the COUNT-based numbering fails under concurrency.
 *
 * SAFETY: refuses to run against a non-local DATABASE_URL unless
 * LOADTEST_ALLOW_REMOTE=1 is set, so it can never accidentally hammer the
 * shared/prod Aiven database.
 *
 * Run:
 *   DATABASE_URL=postgresql://kyg:kyg@localhost:5433/kyg_load \
 *   LOAD_CONCURRENCY=20 LOAD_DURATION_SEC=20 \
 *   node tests/load/booking-load.mjs
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const DB = process.env.DATABASE_URL ?? '';
const CONCURRENCY = Number(process.env.LOAD_CONCURRENCY ?? 20);
const DURATION_SEC = Number(process.env.LOAD_DURATION_SEC ?? 20);
const ALLOW_REMOTE = process.env.LOADTEST_ALLOW_REMOTE === '1';

if (!DB) {
  console.error('DATABASE_URL is required.');
  process.exit(1);
}
const isLocal = /@(localhost|127\.0\.0\.1|host\.docker\.internal)[:/]/.test(DB);
if (!isLocal && !ALLOW_REMOTE) {
  console.error(
    `\nREFUSING TO RUN: DATABASE_URL is not local.\n` +
      `This harness writes thousands of rows and must NOT hit a shared/prod DB.\n` +
      `Point it at a throwaway local Postgres (see tests/load/docker-compose.yml),\n` +
      `or set LOADTEST_ALLOW_REMOTE=1 if you REALLY mean to.\n`
  );
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DB }) });

function pct(sorted, p) {
  if (sorted.length === 0) return 0;
  const i = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[i];
}

async function ensureFixtures() {
  const pkg = await prisma.package.findFirst({ where: { active: true } });
  if (!pkg) throw new Error('No active Package found. Run `pnpm db:seed` against the load DB first.');
  const lab = await prisma.lab.findFirst({ where: { active: true } });
  if (!lab) console.warn('[warn] No active Lab found - notify path will hit the "no-lab" branch.');

  let user = await prisma.user.findFirst({ where: { email: 'loadtest@knowyourgenes.local' } });
  if (!user) user = await prisma.user.create({ data: { email: 'loadtest@knowyourgenes.local', name: 'Load Test' } });

  let address = await prisma.address.findFirst({ where: { userId: user.id } });
  if (!address) {
    address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: 'Load Test',
        phone: '9999999999',
        line1: '1 Load St',
        area: 'Sector 1',
        city: 'Gurugram',
        pincode: '122001',
      },
    });
  }
  return { pkg, user, address };
}

async function nextOrderNumber() {
  // Mirrors features/orders/server/orders.ts exactly (the contention point).
  const year = new Date().getFullYear();
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);
  const count = await prisma.order.count({ where: { createdAt: { gte: start, lt: end } } });
  return `KYG-${year}-${String(count + 1).padStart(6, '0')}`;
}

async function onePaidBooking(fx) {
  // (1)+(2) checkout: number + order + pending payment
  const orderNumber = await nextOrderNumber();
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: fx.user.id,
      packageId: fx.pkg.id,
      addressId: fx.address.id,
      subtotal: fx.pkg.price,
      total: fx.pkg.price,
      slotDate: new Date(),
      slotWindow: 'MORNING',
      status: 'BOOKED',
      fulfillmentMode: 'AT_HOME_PHLEBOTOMIST',
      events: { create: { label: 'Order booked, awaiting payment' } },
      payments: { create: { amount: fx.pkg.price, currency: 'INR', status: 'PENDING' } },
    },
    include: { payments: true },
  });

  // (3) verify/webhook: mark paid
  await prisma.order.update({
    where: { id: order.id },
    data: { paidAt: new Date(), events: { create: { label: 'Payment captured' } } },
  });
  await prisma.payment.update({
    where: { id: order.payments[0].id },
    data: { status: 'CAPTURED', capturedAt: new Date() },
  });

  // (4) linkLabAndNotify (mirrors features/lab/server/lab-notify.ts; SMTP is a no-op here)
  const lab =
    (await prisma.lab.findFirst({ where: { isDefault: true, active: true } })) ??
    (await prisma.lab.findFirst({ where: { active: true }, orderBy: { createdAt: 'asc' } }));
  if (lab) {
    const claim = await prisma.order.updateMany({
      where: { id: order.id, labId: null },
      data: { labId: lab.id, partnerId: lab.partnerId },
    });
    if (claim.count > 0) {
      await prisma.notification.create({
        data: {
          channel: 'EMAIL',
          template: 'LAB_ORDER_ASSIGNED',
          to: lab.contactEmail ?? 'lab@example.com',
          status: 'QUEUED',
          payload: { orderId: order.id, orderNumber },
        },
      });
      await prisma.orderEvent.create({ data: { orderId: order.id, label: `Lab notified: ${lab.name}` } });
    }
  }
  return orderNumber;
}

async function main() {
  console.log(
    `\nBooking load: concurrency=${CONCURRENCY}, duration=${DURATION_SEC}s\nDB=${DB.replace(/:[^:@/]+@/, ':****@')}\n`
  );
  const fx = await ensureFixtures();

  const latencies = [];
  const orderNumbers = new Set();
  let dupes = 0;
  let ok = 0;
  let errors = 0;
  const errSamples = {};

  const deadline = Date.now() + DURATION_SEC * 1000;
  const t0 = Date.now();

  async function worker() {
    while (Date.now() < deadline) {
      const s = process.hrtime.bigint();
      try {
        const on = await onePaidBooking(fx);
        const ms = Number(process.hrtime.bigint() - s) / 1e6;
        latencies.push(ms);
        ok++;
        if (orderNumbers.has(on)) dupes++;
        else orderNumbers.add(on);
      } catch (e) {
        errors++;
        const key = (e && e.code) || (e && e.message ? e.message.slice(0, 60) : 'unknown');
        errSamples[key] = (errSamples[key] ?? 0) + 1;
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const elapsed = (Date.now() - t0) / 1000;

  latencies.sort((a, b) => a - b);
  const total = ok + errors;
  const report = {
    concurrency: CONCURRENCY,
    elapsedSec: Number(elapsed.toFixed(2)),
    completed: ok,
    errors,
    throughputPerSec: Number((ok / elapsed).toFixed(1)),
    errorRatePct: total ? Number(((errors / total) * 100).toFixed(2)) : 0,
    duplicateOrderNumbers: dupes,
    latencyMs: {
      p50: Number(pct(latencies, 50).toFixed(1)),
      p90: Number(pct(latencies, 90).toFixed(1)),
      p95: Number(pct(latencies, 95).toFixed(1)),
      p99: Number(pct(latencies, 99).toFixed(1)),
      max: Number((latencies[latencies.length - 1] ?? 0).toFixed(1)),
    },
    errorSamples: errSamples,
  };
  console.log(JSON.stringify(report, null, 2));
  if (dupes > 0) {
    console.log(
      `\n⚠  ${dupes} DUPLICATE order numbers generated under load - the COUNT-based\n` +
        `   nextOrderNumber() races. This is the #1 thing to fix before high traffic\n` +
        `   (use a Postgres SEQUENCE / identity column).`
    );
  }
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

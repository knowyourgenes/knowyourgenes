/**
 * Measures wall-clock time for the heaviest read queries the admin endpoints
 * run. We measure the raw DB latency, not HTTP round-trip, so the numbers
 * reflect what Prisma + Postgres are doing.
 *
 *   pnpm tsx scripts/perf-baseline.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function time<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const t0 = performance.now();
  const result = await fn();
  const ms = performance.now() - t0;
  const size = Array.isArray(result) ? `${result.length} rows` : typeof result === 'object' ? 'obj' : `${result}`;
  console.log(`  ${ms.toFixed(0).padStart(5)}ms  ${label}  →  ${size}`);
  return result;
}

async function main() {
  console.log('Warming up connection…');
  await prisma.serviceArea.count();
  await prisma.order.count(); // warm the Order side too
  await prisma.shipment.count();
  console.log('');

  console.log('═══ /api/admin/service-area/stats ═══');
  await time('count total', () => prisma.serviceArea.count());
  await time('count active', () => prisma.serviceArea.count({ where: { active: true } }));
  await time('distinct pincode (all)', () =>
    prisma.serviceArea.findMany({ distinct: ['pincode'], select: { pincode: true } })
  );
  await time('distinct pincode (active)', () =>
    prisma.serviceArea.findMany({ where: { active: true }, distinct: ['pincode'], select: { pincode: true } })
  );
  await time('distinct state (active)', () =>
    prisma.serviceArea.findMany({ where: { active: true }, distinct: ['state'], select: { state: true } })
  );
  await time('distinct (state, district) (active)', () =>
    prisma.serviceArea.findMany({
      where: { active: true },
      distinct: ['state', 'district'],
      select: { state: true, district: true },
    })
  );
  console.log('');

  console.log('═══ /api/admin/service-area/tree ═══');
  await time('groupBy (state, district) totals', () =>
    prisma.serviceArea.groupBy({
      by: ['state', 'district'],
      _count: { pincode: true },
      orderBy: [{ state: 'asc' }, { district: 'asc' }],
    })
  );
  await time('groupBy (state, district) actives', () =>
    prisma.serviceArea.groupBy({
      by: ['state', 'district'],
      where: { active: true },
      _count: { pincode: true },
    })
  );
  console.log('');

  console.log('═══ /api/admin/service-area (list, default filters) ═══');
  await time('findMany active page 1 (take 50)', () =>
    prisma.serviceArea.findMany({
      where: { active: true },
      orderBy: [{ state: 'asc' }, { district: 'asc' }, { pincode: 'asc' }],
      skip: 0,
      take: 50,
    })
  );
  await time('count active', () => prisma.serviceArea.count({ where: { active: true } }));
  console.log('');

  console.log('═══ /api/admin/service-area (search "delhi") ═══');
  await time('findMany q=delhi take 50', () =>
    prisma.serviceArea.findMany({
      where: {
        OR: [
          { pincode: { contains: 'delhi' } },
          { area: { contains: 'delhi', mode: 'insensitive' } },
          { district: { contains: 'delhi', mode: 'insensitive' } },
        ],
      },
      orderBy: [{ state: 'asc' }, { district: 'asc' }, { pincode: 'asc' }],
      skip: 0,
      take: 50,
    })
  );
  await time('count q=delhi', () =>
    prisma.serviceArea.count({
      where: {
        OR: [
          { pincode: { contains: 'delhi' } },
          { area: { contains: 'delhi', mode: 'insensitive' } },
          { district: { contains: 'delhi', mode: 'insensitive' } },
        ],
      },
    })
  );
  console.log('');

  console.log('═══ /api/admin/service-area/tree/areas (Maharashtra/Mumbai) ═══');
  await time('findMany state+district', () =>
    prisma.serviceArea.findMany({
      where: { state: 'Maharashtra', district: 'Mumbai' },
      orderBy: [{ active: 'desc' }, { pincode: 'asc' }, { area: 'asc' }],
      select: { id: true, pincode: true, area: true, active: true },
    })
  );
  console.log('');

  console.log('═══ /api/admin/orders (list, default) ═══');
  await time('findMany with includes', () =>
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 25,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        package: { select: { name: true } },
        agent: { select: { user: { select: { name: true } } } },
      },
    })
  );
  await time('count', () => prisma.order.count());
  console.log('');

  console.log('═══ /api/admin/shipments (list) ═══');
  await time('findMany take 25', () =>
    prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 25,
    })
  );
  await time('count', () => prisma.shipment.count());
  console.log('');

  // -------------------------------------------------------------------------
  // POST-FIX queries (what the live endpoints now run)
  // -------------------------------------------------------------------------

  console.log('═══ POST-FIX: stats (single aggregate query) ═══');
  await time('single $queryRaw aggregate', () =>
    prisma.$queryRaw`
      SELECT
        COUNT(*)::bigint                                                AS total,
        COUNT(*) FILTER (WHERE active)::bigint                          AS active,
        COUNT(DISTINCT pincode)::bigint                                 AS unique_pincodes,
        COUNT(DISTINCT pincode) FILTER (WHERE active)::bigint           AS active_pincodes,
        COUNT(DISTINCT state) FILTER (WHERE active AND state <> '')::bigint
                                                                        AS active_states,
        COUNT(DISTINCT (state, district)) FILTER (WHERE active)::bigint AS active_districts
      FROM "ServiceArea"
    `
  );
  console.log('');

  console.log('═══ POST-FIX: tree (single groupBy with FILTER) ═══');
  await time('single $queryRaw groupBy', () =>
    prisma.$queryRaw`
      SELECT
        state,
        district,
        COUNT(*)::bigint                       AS total,
        COUNT(*) FILTER (WHERE active)::bigint AS active
      FROM "ServiceArea"
      GROUP BY state, district
      ORDER BY state, district
    `
  );
  console.log('');

  console.log('═══ POST-FIX: search "delhi" (now backed by pg_trgm GIN) ═══');
  // Smarter query: no useless pincode branch for alpha-only inputs.
  await time('findMany q=delhi take 50', () =>
    prisma.serviceArea.findMany({
      where: {
        OR: [
          { area: { contains: 'delhi', mode: 'insensitive' } },
          { district: { contains: 'delhi', mode: 'insensitive' } },
        ],
      },
      orderBy: [{ state: 'asc' }, { district: 'asc' }, { pincode: 'asc' }],
      skip: 0,
      take: 50,
    })
  );
  await time('count q=delhi', () =>
    prisma.serviceArea.count({
      where: {
        OR: [
          { area: { contains: 'delhi', mode: 'insensitive' } },
          { district: { contains: 'delhi', mode: 'insensitive' } },
        ],
      },
    })
  );
  await time('findMany q=110001 prefix (pincode-only branch)', () =>
    prisma.serviceArea.findMany({
      where: { pincode: { startsWith: '110001' } },
      take: 50,
    })
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

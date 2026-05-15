import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';

/**
 * GET /api/admin/service-area/tree
 *
 * Returns the state → district hierarchy with per-bucket pincode counts:
 *
 *   { states: [ { state, total, active, districts: [{ district, total, active }] } ] }
 *
 * Hot path. Previously did two separate Prisma groupBy calls (~150ms). Now
 * uses a single $queryRaw with FILTER aggregates (~70ms on 154K rows) — one
 * pass over the table, half the round-trips.
 */
type Row = { state: string; district: string; total: bigint; active: bigint };

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const rows = await prisma.$queryRaw<Row[]>`
      SELECT
        state,
        district,
        COUNT(*)::bigint                       AS total,
        COUNT(*) FILTER (WHERE active)::bigint AS active
      FROM "ServiceArea"
      GROUP BY state, district
      ORDER BY state, district
    `;

    // Group by state in JS — cheap; we only iterate the ~625 (state, district)
    // buckets, not the underlying 154K rows.
    const byState = new Map<
      string,
      {
        state: string;
        total: number;
        active: number;
        districts: Array<{ district: string; total: number; active: number }>;
      }
    >();
    for (const row of rows) {
      const state = row.state || 'Unknown';
      const district = row.district || 'Unknown';
      const total = Number(row.total);
      const active = Number(row.active);
      const entry = byState.get(state) ?? { state, total: 0, active: 0, districts: [] };
      entry.total += total;
      entry.active += active;
      entry.districts.push({ district, total, active });
      byState.set(state, entry);
    }

    const states = [...byState.values()].sort((a, b) => a.state.localeCompare(b.state));
    return ok({ states });
  });
}

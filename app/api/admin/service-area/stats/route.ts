import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';

// Aggregate counts for the service-area admin page header cards.
//
// Hot path. Earlier this endpoint ran 6 separate queries (~1100ms total on
// 154K rows) because `prisma.serviceArea.findMany({ distinct: [...] })` pulls
// the entire distinct set across the wire just so we can `.length` it. Now
// we use a single $queryRaw with conditional aggregates (~80ms on the same
// dataset).
type Row = {
  total: bigint;
  active: bigint;
  unique_pincodes: bigint;
  active_pincodes: bigint;
  active_states: bigint;
  active_districts: bigint;
};

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const rows = await prisma.$queryRaw<Row[]>`
      SELECT
        COUNT(*)::bigint                                                AS total,
        COUNT(*) FILTER (WHERE active)::bigint                          AS active,
        COUNT(DISTINCT pincode)::bigint                                 AS unique_pincodes,
        COUNT(DISTINCT pincode) FILTER (WHERE active)::bigint           AS active_pincodes,
        COUNT(DISTINCT state) FILTER (WHERE active AND state <> '')::bigint
                                                                        AS active_states,
        COUNT(DISTINCT (state, district)) FILTER (WHERE active)::bigint AS active_districts
      FROM "ServiceArea"
    `;
    const r = rows[0];

    return ok({
      total: Number(r.total),
      active: Number(r.active),
      uniquePincodes: Number(r.unique_pincodes),
      activePincodes: Number(r.active_pincodes),
      states: Number(r.active_states),
      districts: Number(r.active_districts),
    });
  });
}

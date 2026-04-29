import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';

// Aggregate counts for the service-area admin page header cards.
// Cheap - each query uses an index.
export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const [total, active, distinctStates, distinctDistricts] = await Promise.all([
      prisma.serviceArea.count(),
      prisma.serviceArea.count({ where: { active: true } }),
      prisma.serviceArea.findMany({
        where: { active: true },
        distinct: ['state'],
        select: { state: true },
      }),
      prisma.serviceArea.findMany({
        where: { active: true },
        distinct: ['state', 'district'],
        select: { state: true, district: true },
      }),
    ]);

    return ok({
      total,
      active,
      states: distinctStates.filter((s) => s.state).length,
      districts: distinctDistricts.length,
    });
  });
}

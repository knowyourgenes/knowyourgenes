import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { serviceAreaBulkToggle } from '@/lib/validators';

// POST /api/admin/service-area/bulk-toggle
// Body: { active: boolean, state?, district?, pincodes?: string[] }
// At least one of { state, district, pincodes } must be provided.
// Updates every matching row's `active` flag in one query.
export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const body = serviceAreaBulkToggle.parse(await req.json());
    const { active, state, district, pincodes, ids } = body;

    const where: Prisma.ServiceAreaWhereInput = {};
    if (state) where.state = state;
    if (district) where.district = district;
    if (pincodes && pincodes.length > 0) where.pincode = { in: pincodes };
    if (ids && ids.length > 0) where.id = { in: ids };

    // Guardrail: refuse to toggle the entire table in one call.
    if (Object.keys(where).length === 0) {
      return fail('At least one of state / district / pincodes / ids is required', 400);
    }

    const res = await prisma.serviceArea.updateMany({ where, data: { active } });
    return ok({ updated: res.count, active });
  });
}

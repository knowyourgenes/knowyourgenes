import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/lib/api';

const querySchema = z.object({
  state: z.string().min(1),
  district: z.string().default(''),
});

/**
 * GET /api/admin/service-area/tree/areas?state=Delhi&district=South%20Delhi
 *
 * Returns the area rows under one (state, district) bucket. Used by the
 * service-area tree to lazy-load level 3 (area rows) when admin expands a
 * district — eager-loading would have shipped 155K rows on every page open.
 *
 * Rows are ordered (active desc, pincode asc, area asc) so already-active
 * localities float to the top.
 */
export async function GET(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      state: url.searchParams.get('state') ?? '',
      district: url.searchParams.get('district') ?? '',
    });
    if (!parsed.success) return fail('state required', 400, { issues: parsed.error.issues });

    const areas = await prisma.serviceArea.findMany({
      where: { state: parsed.data.state, district: parsed.data.district },
      orderBy: [{ active: 'desc' }, { pincode: 'asc' }, { area: 'asc' }],
      select: { id: true, pincode: true, area: true, active: true },
    });

    return ok({ areas });
  });
}

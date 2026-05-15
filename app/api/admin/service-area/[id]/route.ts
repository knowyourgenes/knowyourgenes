import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { serviceAreaUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

/**
 * PATCH /api/admin/service-area/[id]
 *
 * Updates a single ServiceArea row by its cuid. Because one pincode can have
 * many (area) rows under it, all single-row mutations are addressed by id, not
 * by pincode. Use /bulk-toggle when you want to flip every row at a pincode.
 */
export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = serviceAreaUpdate.parse(body);
    const row = await prisma.serviceArea.update({ where: { id }, data });
    return ok(row);
  });
}

/**
 * DELETE /api/admin/service-area/[id]
 * Deactivates the row. KYG policy never hard-deletes pincodes — soft delete
 * preserves audit history for past orders that referenced this area row.
 */
export async function DELETE(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const row = await prisma.serviceArea.update({ where: { id }, data: { active: false } });
    return ok(row);
  });
}

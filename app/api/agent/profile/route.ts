import { prisma } from '@/server/prisma';
import { ApiError, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { z } from 'zod';

/**
 * PATCH /api/agent/profile
 *
 * Self-edit of safe fields only. Verification flags (aadhaar/police) are
 * NOT editable here - those are admin-controlled.
 */
const updateSchema = z.object({
  status: z.enum(['ACTIVE', 'ON_LEAVE']).optional(),
  profilePhotoUrl: z.string().url().nullable().optional(),
});

/**
 * Statuses an agent may put itself into.
 *
 * ACTIVE and ON_LEAVE are the agent's own business - going on leave and coming
 * back is exactly what this endpoint is for. INACTIVE is not: it is what an
 * admin sets to end someone's access, and because this route wrote whatever
 * arrived without reading the current value, a deactivated agent could simply
 * PATCH themselves back to ACTIVE and become eligible for new work again. The
 * profile screen renders it as a one-tap switch, under copy that says "Admin can
 * also disable you."
 */
const SELF_SERVICE_STATUSES = ['ACTIVE', 'ON_LEAVE'];

export async function PATCH(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['AGENT']);
    if (isResponse(guard)) return guard;
    const body = await req.json();
    const data = updateSchema.parse(body);

    const current = await prisma.agentProfile.findUnique({
      where: { userId: guard.id! },
      select: { status: true },
    });
    if (!current) throw new ApiError('Agent profile not found', 404);

    // Deactivation is an admin decision and only an admin can undo it.
    if (!SELF_SERVICE_STATUSES.includes(current.status)) {
      throw new ApiError('Your account has been deactivated. Please contact your KYG coordinator.', 403);
    }

    const updated = await prisma.agentProfile.update({
      where: { userId: guard.id! },
      data,
    });
    return ok(updated);
  });
}

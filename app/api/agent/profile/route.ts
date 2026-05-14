import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
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

export async function PATCH(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['AGENT']);
    if (isResponse(guard)) return guard;
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.agentProfile.update({
      where: { userId: guard.id! },
      data,
    });
    return ok(updated);
  });
}

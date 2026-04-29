import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/lib/api';

type Params = Promise<{ id: string }>;

const schema = z.object({
  active: z.boolean(),
});

// PATCH /api/admin/users/[id]/status  { active: boolean }
// active=true  → deletedAt=null (reactivate)
// active=false → deletedAt=now() (deactivate; user is blocked from signing in)
// KYG policy: the User row is never removed - only the deletedAt flag toggles.
export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const { id } = await params;

    // Prevent an admin from deactivating themselves - would lock them out.
    if (typeof guard === 'object' && 'id' in guard && guard.id === id) {
      return fail('You cannot deactivate your own account', 400);
    }

    const body = schema.parse(await req.json());
    const user = await prisma.user.update({
      where: { id },
      data: { deletedAt: body.active ? null : new Date() },
      select: { id: true, deletedAt: true },
    });

    return ok({ id: user.id, active: user.deletedAt === null });
  });
}

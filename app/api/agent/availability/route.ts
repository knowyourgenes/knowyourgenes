import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { z } from 'zod';

const updateSchema = z.object({
  window: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
  active: z.boolean(),
});

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['AGENT']);
    if (isResponse(guard)) return guard;
    const items = await prisma.agentAvailability.findMany({ where: { agentId: guard.id! } });
    return ok(items);
  });
}

/**
 * PATCH /api/agent/availability
 * body: { window: 'MORNING' | 'AFTERNOON' | 'EVENING', active: boolean }
 *
 * Toggles a single window. Upserts because agents may not have rows for
 * windows they've never enabled.
 */
export async function PATCH(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['AGENT']);
    if (isResponse(guard)) return guard;
    const body = await req.json();
    const { window, active } = updateSchema.parse(body);

    const row = await prisma.agentAvailability.upsert({
      where: { agentId_window: { agentId: guard.id!, window } },
      create: { agentId: guard.id!, window, active },
      update: { active },
    });
    return ok(row);
  });
}

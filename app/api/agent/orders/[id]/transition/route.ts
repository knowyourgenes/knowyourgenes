import { prisma } from '@/lib/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { z } from 'zod';

type Params = Promise<{ id: string }>;

/**
 * POST /api/agent/orders/[id]/transition
 *
 * Limited state machine - agents can only move forward through the
 * collection leg. Anything beyond SAMPLE_COLLECTED requires admin / lab.
 */
const ALLOWED_FROM_TO: Record<string, string[]> = {
  AGENT_ASSIGNED: ['AGENT_EN_ROUTE'],
  AGENT_EN_ROUTE: ['SAMPLE_COLLECTED'],
};

const bodySchema = z.object({
  to: z.enum(['AGENT_EN_ROUTE', 'SAMPLE_COLLECTED']),
  note: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['AGENT']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const body = await req.json();
    const { to, note } = bodySchema.parse(body);

    const order = await prisma.order.findFirst({ where: { id, agentId: guard.id! } });
    if (!order) return fail('Order not found or not assigned to you', 404);

    const allowed = ALLOWED_FROM_TO[order.status] ?? [];
    if (!allowed.includes(to)) {
      return fail(`Cannot move from ${order.status} to ${to}`, 400);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: to as 'AGENT_EN_ROUTE' | 'SAMPLE_COLLECTED',
        collectedAt: to === 'SAMPLE_COLLECTED' ? new Date() : undefined,
        events: {
          create: {
            label: note ? `${to}: ${note}` : `Moved to ${to}`,
            actorId: guard.id ?? null,
          },
        },
      },
    });

    // Bump agent's collections counter when collected
    if (to === 'SAMPLE_COLLECTED') {
      await prisma.agentProfile.update({
        where: { userId: guard.id! },
        data: {
          collectionsThisMonth: { increment: 1 },
          collectionsTotal: { increment: 1 },
        },
      });
    }

    return ok(updated);
  });
}

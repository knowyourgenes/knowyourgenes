import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { orderAssignAgent } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const { agentId } = orderAssignAgent.parse(body);

    const agent = await prisma.agentProfile.findUnique({ where: { userId: agentId } });
    if (!agent) throw new Error('Agent not found');
    if (agent.status !== 'ACTIVE') throw new Error('Agent is not active');

    const [order] = await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { agentId, status: 'AGENT_ASSIGNED' },
      }),
      prisma.orderEvent.create({
        data: {
          orderId: id,
          label: `Agent assigned`,
          meta: { agentId },
          actorId: guard.id,
        },
      }),
    ]);
    return ok(order);
  });
}

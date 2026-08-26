import { prisma } from '@/server/prisma';
import { ApiError, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { orderAssignAgent } from '@/lib/validators';
import { isTerminal, requirePaidOrder } from '@/features/orders';

type Params = Promise<{ id: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const { agentId } = orderAssignAgent.parse(body);

    const agent = await prisma.agentProfile.findUnique({ where: { userId: agentId } });
    if (!agent) throw new ApiError('Agent not found', 404);
    if (agent.status !== 'ACTIVE') throw new ApiError('Agent is not active', 409);

    // This route used to read NOTHING about the order - not payment, not
    // fulfilment mode, not even its current status - and then overwrite that
    // status with AGENT_ASSIGNED. Three separate faults came out of that single
    // omission, so all three are answered by reading the order first.
    const existing = await requirePaidOrder(id);

    // 1. A finished order is not work. Without this, a cancelled or refunded
    //    order could be pulled back into the collection queue.
    if (isTerminal(existing.status)) {
      throw new ApiError(`${existing.orderNumber} is ${existing.status} and cannot be assigned`, 409);
    }

    // 2. A collector only makes sense where someone has to turn up. Every
    //    package in the catalogue is currently KIT_BY_POST, so an agent on a
    //    posted kit was not an edge case - it was the default order shape, and
    //    the dropdown was offered on every row. The mirror of this guard already
    //    existed one route over, in shipments, refusing a kit leg on an at-home
    //    order; it was simply never written in the other direction.
    if (existing.fulfillmentMode !== 'AT_HOME_PHLEBOTOMIST') {
      throw new ApiError(
        `${existing.orderNumber} is fulfilled by post, so it needs no collection agent`,
        409
      );
    }

    // 3. Re-assigning must not rewind physical work. Writing AGENT_ASSIGNED over
    //    an order already at SAMPLE_COLLECTED re-armed "mark en route" and
    //    permitted a second collection of one physical sample, while collectedAt
    //    stayed populated. Swapping the agent is allowed; the status only moves
    //    for an order that has not started.
    const rewinds = existing.status !== 'BOOKED' && existing.status !== 'AGENT_ASSIGNED';

    const [order] = await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: rewinds ? { agentId } : { agentId, status: 'AGENT_ASSIGNED' },
      }),
      prisma.orderEvent.create({
        data: {
          orderId: id,
          label: existing.agentId && existing.agentId !== agentId ? 'Agent re-assigned' : 'Agent assigned',
          meta: { agentId, previousAgentId: existing.agentId ?? null, statusHeld: rewinds },
          actorId: guard.id,
        },
      }),
    ]);
    return ok(order);
  });
}

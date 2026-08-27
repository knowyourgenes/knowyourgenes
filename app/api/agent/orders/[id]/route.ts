import { prisma } from '@/server/prisma';
import { handle, isResponse, ok, requireActiveAgent } from '@/server/api';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireActiveAgent();
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { id, agentId: guard.id! },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        address: true,
        package: { select: { name: true, sampleType: true, biomarkerCount: true } },
        events: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!order) throw new Error('Order not found or not assigned to you');
    return ok(order);
  });
}

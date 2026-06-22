import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['AGENT']);
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

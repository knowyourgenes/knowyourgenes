import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { orderStatusUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN', 'COUNSELLOR']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const { status, note } = orderStatusUpdate.parse(body);

    const timestamp =
      status === 'SAMPLE_COLLECTED'
        ? { collectedAt: new Date() }
        : status === 'REPORT_READY'
          ? { deliveredAt: new Date() }
          : {};

    const [order] = await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { status, ...timestamp },
      }),
      prisma.orderEvent.create({
        data: {
          orderId: id,
          label: `Status → ${status}${note ? ` (${note})` : ''}`,
          actorId: guard.id,
        },
      }),
    ]);
    return ok(order);
  });
}

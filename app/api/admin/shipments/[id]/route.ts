import { prisma } from '@/server/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/server/api';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            fulfillmentMode: true,
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        events: { orderBy: { occurredAt: 'desc' } },
      },
    });
    if (!shipment) throw new Error('Shipment not found');
    return ok(shipment);
  });
}

import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { courier } from '@/lib/courier';

type Params = Promise<{ id: string }>;

export async function POST(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const shipment = await prisma.shipment.findUnique({ where: { id } });
    if (!shipment) throw new Error('Shipment not found');
    if (shipment.status === 'DELIVERED') throw new Error('Cannot cancel a delivered shipment');
    if (shipment.status === 'CANCELLED') return ok(shipment);

    if (shipment.awb) {
      const result = await courier.cancel(shipment.awb, shipment.courier);
      if (!result.ok) throw new Error('Courier cancellation failed');
    }

    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        events: {
          create: { status: 'CANCELLED', label: 'Cancelled by admin' },
        },
      },
    });
    return ok(updated);
  });
}

import { prisma } from '@/server/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/server/api';
import { courier } from '@/features/shipments/server/courier';
import { applyTrackingToShipment } from '@/features/shipments';

type Params = Promise<{ id: string }>;

/**
 * POST /api/admin/shipments/[id]/refresh
 *
 * Pulls latest tracking from the courier the shipment was created with,
 * persists new scans + status, and propagates to the parent Order's status
 * if appropriate.
 */
export async function POST(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const shipment = await prisma.shipment.findUnique({ where: { id } });
    if (!shipment) throw new Error('Shipment not found');
    if (!shipment.awb) throw new Error('Shipment has no AWB to refresh');

    const tracking = await courier.track(shipment.awb, shipment.courier);
    const updated = await applyTrackingToShipment(shipment.id, tracking);
    return ok(updated);
  });
}

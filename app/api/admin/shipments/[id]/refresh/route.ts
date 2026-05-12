import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { delhivery } from '@/lib/delhivery';
import { applyTrackingToShipment } from '@/lib/shipments';

type Params = Promise<{ id: string }>;

/**
 * POST /api/admin/shipments/[id]/refresh
 *
 * Pulls latest tracking from Delhivery, persists new scans + status, and
 * propagates to the parent Order's status if appropriate.
 */
export async function POST(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const shipment = await prisma.shipment.findUnique({ where: { id } });
    if (!shipment) throw new Error('Shipment not found');
    if (!shipment.awb) throw new Error('Shipment has no AWB to refresh');

    const tracking = await delhivery.track(shipment.awb);
    const updated = await applyTrackingToShipment(shipment.id, tracking);
    return ok(updated);
  });
}

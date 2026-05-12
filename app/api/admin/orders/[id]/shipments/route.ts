import { prisma } from '@/lib/prisma';
import { created, fail, handle, isResponse, requireApiRole } from '@/lib/api';
import { delhivery } from '@/lib/delhivery';
import { shipmentCreate } from '@/lib/validators';
import { resolveLab } from '@/lib/shipments';

type Params = Promise<{ id: string }>;

/**
 * POST /api/admin/orders/[id]/shipments
 *
 * Creates a Delhivery shipment for a kit-by-post order.
 * - leg=FORWARD  → dispatch kit from warehouse to user. Call after order is paid.
 * - leg=REVERSE  → schedule reverse pickup from user to lab. Call when admin
 *                  marks "user has collected sample, kit ready for pickup".
 */
export async function POST(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id: orderId } = await params;

    const body = await req.json();
    const input = shipmentCreate.parse(body);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        user: { select: { name: true, phone: true } },
      },
    });
    if (!order) throw new Error('Order not found');
    if (order.fulfillmentMode === 'AT_HOME_PHLEBOTOMIST') {
      return fail('This order uses at-home collection — no kit shipment needed', 400);
    }

    // Prevent duplicate legs
    const existing = await prisma.shipment.findFirst({
      where: { orderId, leg: input.leg, status: { notIn: ['CANCELLED', 'FAILED', 'RTO'] } },
    });
    if (existing) {
      return fail(`A ${input.leg} shipment already exists for this order (${existing.id})`, 409);
    }

    const lab = await resolveLab(input.labId);
    const userAddr = {
      name: order.address.fullName,
      phone: order.address.phone,
      line: `${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}, ${order.address.area}`,
      city: order.address.city,
      pincode: order.address.pincode,
    };

    const pickup = input.leg === 'FORWARD' ? lab.address : (input.pickup ?? userAddr);
    const drop = input.leg === 'FORWARD' ? (input.drop ?? userAddr) : lab.address;
    const refNumber = `KYG-${order.orderNumber}-${input.leg === 'FORWARD' ? 'FWD' : 'REV'}`;
    const weightGrams = input.weightGrams ?? (input.leg === 'FORWARD' ? 350 : 150);
    const declaredValue = input.declaredValue ?? 0;

    const result = await delhivery.createShipment({
      leg: input.leg,
      refNumber,
      pickup,
      drop,
      weightGrams,
      declaredValue,
      pickupLocationName: lab.pickupLocationName,
    });

    const shipment = await prisma.shipment.create({
      data: {
        orderId,
        labId: lab.id,
        leg: input.leg,
        status: result.status,
        awb: result.awb,
        refNumber: result.refNumber,
        pickupName: pickup.name,
        pickupPhone: pickup.phone,
        pickupLine: pickup.line,
        pickupCity: pickup.city,
        pickupPincode: pickup.pincode,
        dropName: drop.name,
        dropPhone: drop.phone,
        dropLine: drop.line,
        dropCity: drop.city,
        dropPincode: drop.pincode,
        weightGrams,
        declaredValue,
        paymentMode: input.leg === 'REVERSE' ? 'Pickup' : 'Prepaid',
        trackingPayload: result.rawResponse as object,
        events: {
          create: { status: result.status, label: 'Shipment created via admin' },
        },
      },
    });

    // Advance order status
    const nextStatus = input.leg === 'FORWARD' ? 'KIT_DISPATCHED' : 'SAMPLE_PICKED_UP';
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        events: {
          create: {
            label:
              input.leg === 'FORWARD'
                ? `Kit dispatched — AWB ${result.awb}`
                : `Reverse pickup scheduled — AWB ${result.awb}`,
            actorId: guard.id,
          },
        },
      },
    });

    return created(shipment);
  });
}

import { prisma } from '@/server/prisma';
import { ApiError, created, fail, handle, isResponse, requireApiRole } from '@/server/api';
import { isTerminal } from '@/features/orders';
import { courier } from '@/features/shipments/server/courier';
import { shipmentCreate } from '@/lib/validators';
import { resolveLab } from '@/features/shipments';

type Params = Promise<{ id: string }>;

/**
 * POST /api/admin/orders/[id]/shipments
 *
 * Creates a Delhivery shipment for a kit-by-post order.
 * - leg=FORWARD  → dispatch kit from warehouse to user. Only after the order is
 *                  PAID - and that is now enforced, not just documented here.
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

    // Never book against a courier we cannot actually reach. Without this the
    // client downgrades to mock, returns a fabricated AWB, and the order
    // advances - a failure that presents to the operator as a success.
    if (courier.isMisconfigured()) {
      return fail('The courier integration is not configured. No shipment was created.', 503);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        user: { select: { name: true, phone: true } },
      },
    });
    if (!order) throw new ApiError('Order not found', 404);

    // The docblock above has said "call after order is paid" since this route was
    // written; nothing checked. Booking a courier leg spends real money, and an
    // unpaid order could be dispatched with one click.
    if (!order.paidAt) {
      return fail(`${order.orderNumber} has not been paid for yet - no kit can be dispatched`, 409);
    }

    // A cancelled or refunded order is finished. Because a dead order usually has
    // no forward Shipment row, the duplicate-leg check below did not fire, so one
    // POST could resurrect it into a real courier booking.
    if (isTerminal(order.status)) {
      return fail(`${order.orderNumber} is ${order.status} - no shipment can be created`, 409);
    }

    if (order.fulfillmentMode === 'AT_HOME_PHLEBOTOMIST') {
      return fail('This order uses at-home collection - no kit shipment needed', 400);
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

    const result = await courier.createShipment({
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
        courier: courier.activeCourier(),
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
                ? `Kit dispatched - AWB ${result.awb}`
                : `Reverse pickup scheduled - AWB ${result.awb}`,
            actorId: guard.id,
          },
        },
      },
    });

    return created(shipment);
  });
}

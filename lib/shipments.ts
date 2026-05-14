/**
 * Shared helpers for shipments. Pulled out so both admin routes and the
 * webhook handler agree on tracking/state transitions.
 */
import { prisma } from '@/lib/prisma';
import type { TrackingResult } from '@/lib/delhivery';
import type { OrderStatus, ShipmentLeg, ShipmentStatus } from '@prisma/client';

export interface PartyAddress {
  name: string;
  phone: string;
  line: string;
  city: string;
  pincode: string;
}

/**
 * Resolve which KYG lab to use for a shipment, returning both the address
 * snapshot (for the Shipment row) and the lab id + Delhivery pickup-location
 * name (for the courier call).
 *
 * Strategy: explicit `labId` wins. Otherwise pick the active default. If no
 * default exists, fall back to any active lab. Throws if no active lab is
 * configured - admin must create one before kit shipments can run.
 */
export async function resolveLab(labId?: string | null): Promise<{
  id: string;
  pickupLocationName: string;
  address: PartyAddress;
}> {
  let lab = null;
  if (labId) {
    lab = await prisma.lab.findUnique({ where: { id: labId } });
    if (!lab || !lab.active) throw new Error('Selected lab is inactive or missing');
  } else {
    lab =
      (await prisma.lab.findFirst({ where: { isDefault: true, active: true } })) ??
      (await prisma.lab.findFirst({ where: { active: true }, orderBy: { createdAt: 'asc' } }));
  }
  if (!lab) {
    throw new Error('No active KYG lab configured. Create one in /admin/labs before processing kit shipments.');
  }
  return {
    id: lab.id,
    pickupLocationName: lab.pickupLocationName,
    address: {
      name: lab.name,
      phone: lab.phone,
      line: `${lab.addressLine}, ${lab.city}`,
      city: lab.city,
      pincode: lab.pincode,
    },
  };
}

/**
 * Apply a tracking pull / webhook payload to a shipment: persist new scans,
 * update status, propagate to the parent order if a meaningful transition
 * happened.
 */
export async function applyTrackingToShipment(shipmentId: string, tracking: TrackingResult) {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { events: true },
  });
  if (!shipment) throw new Error('Shipment not found');

  // Insert new scans we don't already have. We dedupe on (status, label, occurredAt) since
  // Delhivery doesn't give us a stable scan id.
  const known = new Set(shipment.events.map((e) => `${e.status}|${e.label}|${e.occurredAt.toISOString()}`));
  const newScans = tracking.scans.filter((s) => !known.has(`${s.status}|${s.label}|${s.occurredAt.toISOString()}`));

  const data: {
    status: ShipmentStatus;
    deliveredAt?: Date;
    pickedUpAt?: Date;
    cancelledAt?: Date;
    trackingPayload: object;
    events?: { create: Array<{ status: ShipmentStatus; label: string; location?: string; occurredAt: Date }> };
  } = {
    status: tracking.currentStatus,
    trackingPayload: tracking.rawResponse as object,
  };

  if (tracking.currentStatus === 'DELIVERED' && !shipment.deliveredAt) {
    data.deliveredAt = new Date();
  }
  if (
    (tracking.currentStatus === 'IN_TRANSIT' || tracking.currentStatus === 'OUT_FOR_DELIVERY') &&
    shipment.leg === 'REVERSE' &&
    !shipment.pickedUpAt
  ) {
    data.pickedUpAt = new Date();
  }
  if (tracking.currentStatus === 'CANCELLED' && !shipment.cancelledAt) {
    data.cancelledAt = new Date();
  }

  if (newScans.length > 0) {
    data.events = {
      create: newScans.map((s) => ({
        status: s.status,
        label: s.label,
        location: s.location,
        occurredAt: s.occurredAt,
      })),
    };
  }

  const updated = await prisma.shipment.update({ where: { id: shipmentId }, data });

  // Propagate to order status. We only advance forward; we never roll the
  // order backward based on a courier scan.
  const next = mapShipmentToOrderStatus(shipment.leg, updated.status);
  if (next) {
    const order = await prisma.order.findUnique({ where: { id: shipment.orderId }, select: { status: true } });
    if (order && shouldAdvance(order.status, next)) {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: {
          status: next,
          events: {
            create: { label: `Auto-updated from ${shipment.leg} shipment: ${updated.status}` },
          },
        },
      });
    }
  }

  return updated;
}

function mapShipmentToOrderStatus(leg: ShipmentLeg, status: ShipmentStatus): OrderStatus | null {
  if (leg === 'FORWARD') {
    if (status === 'DELIVERED') return 'KIT_DELIVERED';
    if (status === 'MANIFESTED' || status === 'IN_TRANSIT' || status === 'OUT_FOR_DELIVERY') return 'KIT_DISPATCHED';
    return null;
  }
  // REVERSE
  if (status === 'DELIVERED') return 'AT_LAB';
  if (status === 'IN_TRANSIT' || status === 'OUT_FOR_DELIVERY') return 'SAMPLE_IN_TRANSIT';
  if (status === 'PICKUP_SCHEDULED' || status === 'MANIFESTED') return 'SAMPLE_PICKED_UP';
  return null;
}

const ORDER_STATUS_RANK: Record<OrderStatus, number> = {
  BOOKED: 0,
  KIT_DISPATCHED: 1,
  KIT_DELIVERED: 2,
  SAMPLE_PICKED_UP: 3,
  SAMPLE_IN_TRANSIT: 4,
  AGENT_ASSIGNED: 1,
  AGENT_EN_ROUTE: 2,
  SAMPLE_COLLECTED: 3,
  AT_LAB: 5,
  REPORT_READY: 6,
  CANCELLED: 99,
  REFUNDED: 99,
};

function shouldAdvance(current: OrderStatus, next: OrderStatus): boolean {
  if (current === 'CANCELLED' || current === 'REFUNDED') return false;
  return ORDER_STATUS_RANK[next] > ORDER_STATUS_RANK[current];
}

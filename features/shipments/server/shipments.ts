/**
 * Shared helpers for shipments. Pulled out so both admin routes and the
 * webhook handler agree on tracking/state transitions.
 */
import { prisma } from '@/server/prisma';
import type { TrackingResult } from '@/features/shipments/server/delhivery';
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
    // Forward-only on the shipment too. This used to assign the incoming status
    // unconditionally, three lines above a comment promising the opposite - and
    // both mappers fall back to 'CREATED' for any string they do not recognise.
    // A routine follow-up scan with unfamiliar wording therefore overwrote
    // DELIVERED with CREATED, leaving a row that had been delivered and not yet
    // created, whose write-once deliveredAt no later scan could re-stamp.
    status: shipmentMovesForward(shipment.status, tracking.currentStatus) ? tracking.currentStatus : shipment.status,
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

/**
 * Progress along ONE leg. The two legs are separate chains and are ranked
 * separately, because they used to share a single integer ladder on which
 * KIT_DISPATCHED and AGENT_ASSIGNED were both 1, KIT_DELIVERED and
 * AGENT_EN_ROUTE both 2, SAMPLE_PICKED_UP and SAMPLE_COLLECTED both 3 - and
 * `shouldAdvance` compared them as if they were one total order.
 *
 * That had teeth in both directions. An order sitting at AGENT_ASSIGNED (1)
 * whose kit then delivered was moved to KIT_DELIVERED (2): it left the agent leg
 * silently, vanished from every agent view, and the agent's own API then refused
 * to move it. And an order at SAMPLE_COLLECTED (3) whose kit delivered (2) failed
 * the comparison, so the delivery was recorded on the Shipment and never on the
 * order, with no error either way.
 *
 * Ranking within a leg and refusing to compare across legs is what makes
 * "forward only" mean anything.
 */
const KIT_RANK: Partial<Record<OrderStatus, number>> = {
  BOOKED: 0,
  KIT_DISPATCHED: 1,
  KIT_DELIVERED: 2,
  SAMPLE_PICKED_UP: 3,
  SAMPLE_IN_TRANSIT: 4,
  AT_LAB: 5,
  REPORT_READY: 6,
};

const AT_HOME_RANK: Partial<Record<OrderStatus, number>> = {
  BOOKED: 0,
  AGENT_ASSIGNED: 1,
  AGENT_EN_ROUTE: 2,
  SAMPLE_COLLECTED: 3,
  AT_LAB: 5,
  REPORT_READY: 6,
};

function shouldAdvance(current: OrderStatus, next: OrderStatus): boolean {
  if (current === 'CANCELLED' || current === 'REFUNDED') return false;

  // Both statuses must live on the SAME leg to be comparable. A courier scan
  // that would move an order onto the other leg is not progress, it is a
  // category error - so it is dropped rather than applied.
  const leg =
    KIT_RANK[current] !== undefined && KIT_RANK[next] !== undefined
      ? KIT_RANK
      : AT_HOME_RANK[current] !== undefined && AT_HOME_RANK[next] !== undefined
        ? AT_HOME_RANK
        : null;

  if (!leg) {
    console.warn(
      `[shipments] refusing cross-leg order transition ${current} -> ${next}; ` +
        'the shipment was recorded but the order status was left alone'
    );
    return false;
  }

  return leg[next]! > leg[current]!;
}

/**
 * Whether a shipment status may replace the one already recorded.
 *
 * Terminal states stay put: once a parcel is DELIVERED, CANCELLED or RTO, later
 * chatter from the courier cannot undo it. Everything else may move up the
 * ladder but not down, so an unrecognised scan (which both mappers render as
 * CREATED) leaves the row as it was.
 */
const SHIPMENT_RANK: Record<ShipmentStatus, number> = {
  CREATED: 0,
  MANIFESTED: 1,
  PICKUP_SCHEDULED: 2,
  IN_TRANSIT: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
  FAILED: 5,
  RTO: 5,
  CANCELLED: 5,
};

function shipmentMovesForward(current: ShipmentStatus, next: ShipmentStatus): boolean {
  if (current === next) return true;
  const TERMINAL: ShipmentStatus[] = ['DELIVERED', 'CANCELLED', 'RTO', 'FAILED'];
  if (TERMINAL.includes(current)) return false;
  return SHIPMENT_RANK[next] > SHIPMENT_RANK[current];
}

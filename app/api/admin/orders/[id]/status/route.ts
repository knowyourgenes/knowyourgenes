import type { OrderStatus } from '@prisma/client';
import { prisma } from '@/server/prisma';
import { ApiError, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { orderStatusUpdate } from '@/lib/validators';
import { isTerminal } from '@/features/orders';

type Params = Promise<{ id: string }>;

/**
 * PATCH /api/admin/orders/[id]/status
 *
 * WHAT MAY FOLLOW WHAT. This route used to write whatever enum value arrived,
 * without reading the order first - so any status could follow any other. An
 * order could go backwards from REPORT_READY to BOOKED, come back out of
 * CANCELLED, or jump straight from BOOKED to REPORT_READY with nothing
 * collected. The UI hands an operator all twelve values in one flat per-row
 * dropdown that fires on selection, so a single mis-click was enough.
 *
 * The two fulfilment legs are kept apart here, which is the other half of the
 * problem: the kit-by-post leg and the at-home leg are separate chains, and an
 * order belongs to exactly one of them by `fulfillmentMode`. Mixing them is what
 * let a couriered order sit in AGENT_ASSIGNED.
 *
 * CANCELLED and REFUNDED are reachable from anywhere that is not already
 * terminal, because a real order can go wrong at any point. Nothing is reachable
 * FROM them - reopening a finished order silently re-adds its money to the
 * revenue reports and re-arms fulfilment. That needs a deliberate new order, not
 * a dropdown.
 */
const KIT_LEG: OrderStatus[] = [
  'BOOKED',
  'KIT_DISPATCHED',
  'KIT_DELIVERED',
  'SAMPLE_PICKED_UP',
  'SAMPLE_IN_TRANSIT',
  'AT_LAB',
  'REPORT_READY',
];

const AT_HOME_LEG: OrderStatus[] = [
  'BOOKED',
  'AGENT_ASSIGNED',
  'AGENT_EN_ROUTE',
  'SAMPLE_COLLECTED',
  'AT_LAB',
  'REPORT_READY',
];

const ENDINGS: OrderStatus[] = ['CANCELLED', 'REFUNDED'];

/**
 * Forward along the order's own leg, by one step or several.
 *
 * Skipping ahead is permitted deliberately: operations legitimately runs ahead
 * of the courier feed, and refusing to let an admin mark AT_LAB because no
 * KIT_DELIVERED scan arrived would just push them to fix it in the database.
 * Going backwards is not, because every backwards move rewrites a timestamp that
 * recorded something physical.
 */
function nextStatuses(current: OrderStatus, mode: 'KIT_BY_POST' | 'AT_HOME_PHLEBOTOMIST' | 'EITHER'): OrderStatus[] {
  if (isTerminal(current)) return [];
  const leg = mode === 'AT_HOME_PHLEBOTOMIST' ? AT_HOME_LEG : KIT_LEG;
  const i = leg.indexOf(current);
  // A status from the other leg (legacy rows, or an order whose mode changed)
  // leaves only the endings, rather than trapping the row with no way out.
  if (i === -1) return [...ENDINGS];
  return [...leg.slice(i + 1), ...ENDINGS];
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN', 'COUNSELLOR']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const { status, note } = orderStatusUpdate.parse(body);

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paidAt: true,
        fulfillmentMode: true,
        collectedAt: true,
        deliveredAt: true,
      },
    });
    if (!order) throw new ApiError('Order not found', 404);

    if (status === order.status) return ok(order); // idempotent, not an error

    // Fulfilment cannot begin before the money arrives. Cancelling is always
    // allowed - an unpaid order is exactly the kind you want to be able to close.
    if (!order.paidAt && !ENDINGS.includes(status)) {
      throw new ApiError(
        `${order.orderNumber} has not been paid for yet. Only CANCELLED or REFUNDED are available.`,
        409
      );
    }

    const allowed = nextStatuses(order.status, order.fulfillmentMode);
    if (!allowed.includes(status)) {
      throw new ApiError(
        isTerminal(order.status)
          ? `${order.orderNumber} is ${order.status}. A finished order cannot be reopened.`
          : `${order.orderNumber} cannot move from ${order.status} to ${status}.`,
        409,
        { from: order.status, allowed }
      );
    }

    // Write-once. These record when something physically happened, and stamping
    // them again on a repeat visit rewrote the delivery record.
    const timestamp =
      status === 'SAMPLE_COLLECTED' && !order.collectedAt
        ? { collectedAt: new Date() }
        : status === 'REPORT_READY' && !order.deliveredAt
          ? { deliveredAt: new Date() }
          : {};

    const [updated] = await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { status, ...timestamp },
      }),
      prisma.orderEvent.create({
        data: {
          orderId: id,
          label: `Status → ${status}${note ? ` (${note})` : ''}`,
          meta: { from: order.status, to: status },
          actorId: guard.id,
        },
      }),
    ]);
    return ok(updated);
  });
}

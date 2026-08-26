import { prisma } from '@/server/prisma';
import { ApiError, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { orderAssignLab } from '@/lib/validators';
import { isTerminal, requirePaidOrder } from '@/features/orders';
import { linkLabAndNotify } from '@/features/lab';

type Params = Promise<{ id: string }>;

/**
 * POST /api/admin/orders/[id]/assign-lab
 *
 * Puts an order with a processing lab, by hand.
 *
 * WHY THIS EXISTS RATHER THAN THE ORDER PICKING ITS OWN LAB: the lab used to be
 * chosen automatically the moment a payment was captured - default active lab,
 * else the first one - and emailed immediately. With two labs and more coming,
 * that is a routing decision nobody made. Assignment is now a deliberate admin
 * action, and the lab is notified at THAT moment rather than before anyone has
 * decided the work is theirs.
 *
 * REASSIGNMENT IS ALLOWED but never silent. `linkLabAndNotify` only ever moves
 * an order from no-lab to a lab (its update is guarded on `labId: null`), so a
 * genuine re-route is done here explicitly and recorded as its own event - the
 * timeline then shows both labs, which is what an operator needs when a sample
 * has already been couriered somewhere.
 */
export async function POST(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const { labId } = orderAssignLab.parse(body);

    const lab = await prisma.lab.findUnique({
      where: { id: labId },
      select: { id: true, name: true, partnerId: true, active: true },
    });
    if (!lab) throw new ApiError('Lab not found', 404);
    if (!lab.active) throw new ApiError('That lab is not active', 409);

    // Routing commits a lab's capacity and sends them an email that states, in
    // words, that the sample has been paid for. It used to select three columns
    // and payment was not among them, so it said that about orders nobody had
    // paid for.
    const order = await requirePaidOrder(id);

    if (isTerminal(order.status)) {
      throw new ApiError(`${order.orderNumber} is ${order.status} and cannot be routed`, 409);
    }

    const isReassignment = order.labId !== null && order.labId !== lab.id;

    let notified;
    if (isReassignment) {
      // Already routed somewhere. linkLabAndNotify only ever moves an order
      // from no-lab to a lab, so it cannot do this - the move is explicit here,
      // and partnerId travels with the lab so Order.partnerId is never left
      // pointing at the previous lab's parent organisation.
      await prisma.$transaction([
        prisma.order.update({ where: { id }, data: { labId: lab.id, partnerId: lab.partnerId } }),
        prisma.orderEvent.create({
          data: {
            orderId: id,
            label: `Re-routed to ${lab.name}`,
            meta: { labId: lab.id, previousLabId: order.labId },
            actorId: guard.id,
          },
        }),
      ]);
      notified = { status: 're-routed' as const, labId: lab.id };
    } else {
      // FIRST assignment: let linkLabAndNotify do the linking, because it links
      // and emails as one step. Writing labId here first would make it see an
      // order that already has a lab, take its idempotency path, and return
      // 'skipped' - the lab would be assigned and never told. That is exactly
      // what happened before this branch existed, and the smoke test caught it.
      notified = await linkLabAndNotify(id, { labId: lab.id });

      // BRANCH ON THE RESULT. This used to be a bare `await` followed
      // unconditionally by a "Lab assigned" event and HTTP 200 - so when
      // linkLabAndNotify returned 'error' or 'no-lab', the order kept labId
      // null, the sample was routed nowhere, and the operator was shown positive
      // confirmation that it had been routed. A failure that reports success is
      // worse than a failure, because nobody goes looking.
      if (notified.status === 'error' || notified.status === 'no-lab') {
        await prisma.orderEvent.create({
          data: {
            orderId: id,
            label: `Lab routing FAILED: ${lab.name}`,
            meta: { labId: lab.id, notify: notified.status, detail: notified.detail ?? null },
            actorId: guard.id,
          },
        });
        throw new ApiError(
          `Could not route ${order.orderNumber} to ${lab.name}. The order is unchanged - please try again.`,
          502,
          { notified }
        );
      }

      await prisma.orderEvent.create({
        data: {
          orderId: id,
          label: `Lab assigned: ${lab.name}`,
          meta: { labId: lab.id, notify: notified.status },
          actorId: guard.id,
        },
      });
    }

    const updated = await prisma.order.findUnique({
      where: { id },
      select: { id: true, orderNumber: true, labId: true, partnerId: true },
    });

    return ok({ order: updated, lab: { id: lab.id, name: lab.name }, notified });
  });
}

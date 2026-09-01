import 'server-only';

/**
 * Lab notification on paid booking.
 *
 * This is the piece that was missing: when a customer's order is *paid*, the
 * processing lab needs to know a sample is coming. Previously booking created
 * only Order/Payment/OrderEvent rows and no lab was ever informed, and
 * Order.labId / Order.partnerId were never set.
 *
 * `linkLabAndNotify(orderId)`:
 *   1. Resolves the processing lab (explicit default active lab, else the
 *      oldest active lab).
 *   2. Atomically links it onto the order (updateMany guarded on labId:null)
 *      so concurrent capture paths (verify route + webhook) can't double-send.
 *   3. Emails the lab (via lib/mailer - a no-op when SMTP is unconfigured).
 *   4. Writes a Notification comms-log row and an OrderEvent.
 *
 * It NEVER throws: money has already been captured by the time this runs, so a
 * missing lab or a failing SMTP server must not break the payment path. All
 * outcomes are returned as a status.
 */
import { prisma } from '@/server/prisma';
import { sendMail } from '@/lib/mailer';

export type LabNotifyStatus = 'notified' | 'skipped' | 'no-lab' | 'error';

export interface LabNotifyResult {
  status: LabNotifyStatus;
  labId?: string;
  notificationId?: string;
  detail?: string;
}

export const LAB_NOTIFY_TEMPLATE = 'LAB_ORDER_ASSIGNED';

/**
 * Links a processing lab onto an order and emails it.
 *
 * `opts.labId` names the lab explicitly. Without it the function picks one -
 * the default active lab, else the oldest active - which is what the automatic
 * capture path wanted. Manual assignment from the admin panel MUST pass a
 * labId, because the whole point of routing by hand is that the operator, not
 * this function, chooses.
 *
 * Either way the link is claimed atomically on `labId: null`, so two callers
 * racing (verify and the webhook, say) produce exactly one email.
 */
export async function linkLabAndNotify(orderId: string, opts: { labId?: string } = {}): Promise<LabNotifyResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      // `items` is the real contents of the order; `package` is only the
      // denormalised primary line and is null on orders placed after the cart
      // shipped, so the email is built from items.
      include: { package: true, items: true, user: true, address: true },
    });
    if (!order) return { status: 'error', detail: 'order not found' };

    // Idempotent: a lab is already linked (the other capture path ran first).
    if (order.labId) return { status: 'skipped', labId: order.labId };

    // An explicitly chosen lab wins outright. `active: true` is still required:
    // an admin should not be able to route work to a lab that has been switched
    // off, and the caller checks this too - this is the backstop.
    const lab = opts.labId
      ? await prisma.lab.findFirst({
          where: { id: opts.labId, active: true },
          include: { partner: true },
        })
      : ((await prisma.lab.findFirst({
          where: { isDefault: true, active: true },
          include: { partner: true },
        })) ??
        (await prisma.lab.findFirst({
          where: { active: true },
          orderBy: { createdAt: 'asc' },
          include: { partner: true },
        })));

    if (!lab) {
      // No lab configured. Record it so ops can see the miss, but don't fail.
      await prisma.orderEvent
        .create({
          data: { orderId: order.id, label: 'Lab notification skipped: no active lab configured' },
        })
        .catch(() => {});
      return { status: 'no-lab' };
    }

    // Atomically claim the link. If another concurrent capture path already
    // linked a lab, count === 0 and we bail without sending a duplicate email.
    const claim = await prisma.order.updateMany({
      where: { id: order.id, labId: null },
      data: { labId: lab.id, partnerId: lab.partnerId },
    });
    if (claim.count === 0) {
      return { status: 'skipped', labId: lab.id, detail: 'linked concurrently' };
    }

    const to = lab.contactEmail || lab.partner.contactEmail;
    const patient = order.user?.name ?? order.user?.email ?? 'Customer';
    // A posted kit has no collection visit, so there is genuinely no slot.
    const slot = order.slotDate
      ? `${order.slotDate.toISOString().slice(0, 10)} (${order.slotWindow})`
      : 'Not applicable (kit by post)';
    // One order can now carry several tests. Fall back to the primary package
    // for orders placed before OrderItem existed.
    const testLines = order.items.length
      ? order.items.map((i) => (i.quantity > 1 ? `${i.nameSnapshot} × ${i.quantity}` : i.nameSnapshot))
      : [order.package?.name ?? 'Unknown test'];
    const testSummary = testLines.join(', ');
    const subject = `New sample booked · ${order.orderNumber} · ${testSummary}`;
    const text = [
      `A new sample has been booked and paid for.`,
      ``,
      `Order:        ${order.orderNumber}`,
      `Test:         ${testLines.join('\n              ')}`,
      `Fulfillment:  ${order.fulfillmentMode}`,
      `Patient:      ${patient}`,
      `Slot:         ${slot}`,
      `Location:     ${order.address?.city ?? '-'} ${order.address?.pincode ?? ''}`,
      `Lab:          ${lab.name} (${lab.partner.name})`,
      ``,
      `Please prepare to receive/process this sample.`,
      `- Know Your Genes`,
    ].join('\n');

    const mail = await sendMail({ to, subject, text });

    const status = mail.ok ? (mail.delivered ? 'SENT' : 'QUEUED') : 'FAILED';
    const notification = await prisma.notification.create({
      data: {
        userId: null,
        channel: 'EMAIL',
        template: LAB_NOTIFY_TEMPLATE,
        to,
        status,
        payload: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          labId: lab.id,
          partnerId: lab.partnerId,
          package: testSummary,
        },
        providerId: mail.providerId ?? null,
        sentAt: mail.delivered ? new Date() : null,
        errorMessage: mail.ok ? null : (mail.error ?? null),
      },
    });

    await prisma.orderEvent
      .create({
        data: {
          orderId: order.id,
          label: `Lab notified: ${lab.name}${mail.delivered ? '' : ' (email queued)'}`,
          meta: { labId: lab.id, notificationId: notification.id, emailStatus: status },
        },
      })
      .catch(() => {});

    return { status: 'notified', labId: lab.id, notificationId: notification.id };
  } catch (err) {
    // Backstop: never propagate into the payment path.
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[lab-notify] failed for order ${orderId}: ${detail}`);
    return { status: 'error', detail };
  }
}

import { prisma } from '@/server/prisma';
import { ApiError, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { notifyCustomer } from '@/features/notifications';
import { isTerminal } from '@/features/orders';

type Params = Promise<{ id: string }>;

/**
 * POST /api/admin/reports/[id]/approve
 *
 * KYG signs off a lab's report and releases it to the customer. This is the step
 * that was designed and never built: `Report.reviewedById` is commented
 * "counsellor who QC'd" and `Report.deliveredAt` has existed since the first
 * migration, and nothing has ever written either.
 *
 * Everything that makes a report visible to the customer happens HERE and
 * nowhere else:
 *   - reviewedById   who signed it off
 *   - deliveredAt    when it was released
 *   - Order.status   becomes REPORT_READY
 *   - the email      "your report is ready", carrying no finding
 *
 * KYG ONLY. A PARTNER uploads and cannot approve - a lab signing off its own
 * work is not review, and the whole reason this step exists is that an outside
 * company should not be able to publish to our customer unsupervised.
 *
 * IDEMPOTENT. `deliveredAt` is the claim: a second approve returns the same
 * result and does not send a second email. Two people clicking at once is the
 * expected case on a shared ops screen, not an edge one.
 */
export async function POST(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN', 'COUNSELLOR']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
      select: {
        id: true,
        reportNumber: true,
        deliveredAt: true,
        orderId: true,
        userId: true,
        order: { select: { orderNumber: true, status: true, paidAt: true } },
        user: { select: { name: true, email: true } },
      },
    });
    if (!report) throw new ApiError('Report not found', 404);

    if (report.deliveredAt) {
      // Already released. Say so plainly rather than pretending to do it again.
      return ok({
        id: report.id,
        reportNumber: report.reportNumber,
        deliveredAt: report.deliveredAt,
        alreadyDelivered: true,
      });
    }

    if (!report.order.paidAt) {
      throw new ApiError(`${report.order.orderNumber} has not been paid for`, 409);
    }
    if (isTerminal(report.order.status)) {
      throw new ApiError(`${report.order.orderNumber} is ${report.order.status} - its report cannot be released`, 409);
    }

    // The claim. `deliveredAt: null` in the WHERE is what makes a double-click
    // send one email rather than two - the same mechanism payment capture uses.
    const claimed = await prisma.$transaction(async (tx) => {
      const { count } = await tx.report.updateMany({
        where: { id, deliveredAt: null },
        data: { deliveredAt: new Date(), reviewedById: guard.id ?? null },
      });
      if (count === 0) return false;

      await tx.order.update({
        where: { id: report.orderId },
        data: {
          status: 'REPORT_READY',
          deliveredAt: new Date(),
          events: {
            create: {
              label: `Report ${report.reportNumber} approved and released`,
              meta: { reportNumber: report.reportNumber },
              actorId: guard.id ?? null,
            },
          },
        },
      });

      return true;
    });

    if (!claimed) {
      // Someone else won the race between our read and our write.
      const fresh = await prisma.report.findUnique({
        where: { id },
        select: { deliveredAt: true, reportNumber: true },
      });
      return ok({ id, reportNumber: fresh?.reportNumber, deliveredAt: fresh?.deliveredAt, alreadyDelivered: true });
    }

    // Sent AFTER the transaction commits. A mail server is a network call with
    // someone else's latency, and notifyCustomer cannot throw - so a bad
    // afternoon at an SMTP host can never roll back a release that happened.
    const notified = await notifyCustomer({
      template: 'REPORT_READY',
      to: report.user?.email ?? null,
      userId: report.userId,
      data: {
        orderNumber: report.order.orderNumber,
        customerName: report.user?.name ?? null,
        reportNumber: report.reportNumber,
      },
    });

    // Stamped only when a message actually left the building. With SMTP unset
    // the mailer skips and this stays null, which is the honest record.
    if (notified.status === 'sent') {
      await prisma.report.update({ where: { id }, data: { emailSentAt: new Date() } });
    }

    return ok({
      id,
      reportNumber: report.reportNumber,
      delivered: true,
      notified: notified.status,
    });
  });
}

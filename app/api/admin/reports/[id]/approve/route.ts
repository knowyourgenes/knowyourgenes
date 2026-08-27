import { prisma } from '@/server/prisma';
import { ApiError, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { notifyCustomer } from '@/features/notifications';
import { isTerminal } from '@/features/orders';
import { getObjectBytes, objectSize } from '@/features/reports';

type Params = Promise<{ id: string }>;

/**
 * Largest PDF we will put in an email.
 *
 * Gmail refuses over 25MB and most relays cap lower; base64 encoding adds
 * roughly a third on top of the raw size, so 8MB of PDF is about 11MB on the
 * wire. Anything bigger goes out as a link, which is a worse experience and a
 * far better outcome than a bounce nobody sees.
 */
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

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
        pdfKey: true,
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

    // THE PDF TRAVELS WITH THE EMAIL.
    //
    // Fetched here rather than in the transaction: pulling several megabytes out
    // of object storage is a network call, and holding a database transaction
    // open across one is how a slow bucket becomes a database problem.
    //
    // Size is checked BEFORE reading. Relays reject an oversized message with an
    // SMTP error that arrives long after anyone is looking, and the failure mode
    // - the customer is never told their report exists - is far worse than the
    // inconvenience of one extra click. Over the limit, the same email goes out
    // without the file and still carries the link.
    let attachments: { filename: string; content: Buffer; contentType: string }[] | undefined;
    let attachmentNote: 'attached' | 'too-large' | 'unavailable' = 'unavailable';

    try {
      const size = await objectSize(report.pdfKey);
      if (size !== null && size <= MAX_ATTACHMENT_BYTES) {
        const file = await getObjectBytes(report.pdfKey);
        attachments = [
          {
            // Named for the customer's own record, not for our object key.
            filename: `${report.reportNumber}-${report.order.orderNumber}.pdf`,
            content: file.body,
            contentType: 'application/pdf',
          },
        ];
        attachmentNote = 'attached';
      } else if (size !== null) {
        attachmentNote = 'too-large';
        console.warn(
          `[approve] ${report.reportNumber} is ${size} bytes, over the ${MAX_ATTACHMENT_BYTES} attachment limit - sending link only`
        );
      }
    } catch (err) {
      // Storage having a bad moment must not stop the customer being told their
      // report is ready. The link in the email still works.
      console.error(`[approve] could not read ${report.pdfKey} to attach:`, err);
    }

    // Sent AFTER the transaction commits. A mail server is a network call with
    // someone else's latency, and notifyCustomer cannot throw - so a bad
    // afternoon at an SMTP host can never roll back a release that happened.
    const notified = await notifyCustomer({
      template: 'REPORT_READY',
      to: report.user?.email ?? null,
      userId: report.userId,
      attachments,
      data: {
        orderNumber: report.order.orderNumber,
        customerName: report.user?.name ?? null,
        reportNumber: report.reportNumber,
        attached: attachmentNote === 'attached',
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
      attachment: attachmentNote,
    });
  });
}

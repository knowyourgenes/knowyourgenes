import { prisma } from '@/server/prisma';
import { requireOrderInScope } from '@/features/lab/server/lab-scope';
import { created, fail, handle, isResponse, requireApiRole } from '@/server/api';
import { putObject, reportKey, R2_CONFIGURED } from '@/features/reports';

/**
 * POST /api/admin/reports/upload
 *   multipart/form-data:
 *     orderId          (string, required)
 *     file             (PDF, required, max 25MB)
 *     summary          (JSON string of string[], optional)
 *     criticalFinding  ("true"/"false", optional)
 *
 * Uploads the PDF to object storage and creates a Report row against the order.
 *
 * THE LAB UPLOADS, KYG RELEASES. This creates the report in an UNREVIEWED state
 * and tells the customer nothing: no email, and the order's status is left where
 * it was. Releasing it is a separate, deliberate act -
 * POST /api/admin/reports/[id]/approve - which is where the customer is emailed
 * and the order becomes REPORT_READY.
 *
 * That split is the whole point of the review step. This route used to write
 * `status: 'REPORT_READY'` and email the customer on upload, which meant a lab
 * publishing a PDF published it straight to the customer with no KYG involvement
 * at all - for a genetic report, on an account we are responsible for.
 *
 * OPEN TO THE ASSIGNED LAB. A PARTNER may upload against an order routed to
 * their own lab and no other; the scope is resolved from the database, not from
 * the token.
 */
const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN', 'COUNSELLOR', 'PARTNER']);
    if (isResponse(guard)) return guard;
    if (!R2_CONFIGURED) {
      return fail('Report storage is not configured. Contact KYG - nothing was uploaded.', 503);
    }

    const form = await req.formData();
    const orderId = form.get('orderId');
    const file = form.get('file');
    const summaryRaw = form.get('summary');
    const criticalFinding = form.get('criticalFinding') === 'true';

    if (typeof orderId !== 'string' || !orderId) return fail('orderId is required', 422);
    if (!(file instanceof File)) return fail('file is required', 422);
    if (file.type !== 'application/pdf') return fail('Only PDFs are accepted', 422);
    if (file.size > MAX_BYTES) return fail('File exceeds 25MB limit', 422);

    let summary: string[] = [];
    if (typeof summaryRaw === 'string' && summaryRaw.trim()) {
      try {
        const parsed = JSON.parse(summaryRaw);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) summary = parsed;
      } catch {
        return fail('summary must be a JSON string array', 422);
      }
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        package: { select: { name: true } },
        items: { select: { nameSnapshot: true } },
        // For the report-ready email.
        user: { select: { name: true, email: true } },
      },
    });
    if (!order) return fail('Order not found', 404);

    // A lab may only upload against an order routed to it. Answers 404 rather
    // than 403 for someone else's order, so an id probe cannot confirm that
    // another lab's order exists.
    await requireOrderInScope(guard.role, guard.id!, orderId);

    if (!order.paidAt) {
      return fail(`${order.orderNumber} has not been paid for - no report can be filed against it`, 409);
    }

    const existing = await prisma.report.findUnique({ where: { orderId } });
    if (existing)
      return fail(`Order already has a report (${existing.reportNumber}). Delete it first to replace.`, 409);

    const reportNumber = await nextReportNumber();
    const key = reportKey(order.orderNumber, reportNumber);

    const buffer = Buffer.from(await file.arrayBuffer());
    await putObject({
      key,
      body: buffer,
      contentType: 'application/pdf',
      contentDisposition: `inline; filename="${reportNumber}.pdf"`,
      metadata: { orderId, reportNumber, uploadedBy: guard.id ?? '' },
    });

    const report = await prisma.report.create({
      data: {
        reportNumber,
        orderId,
        userId: order.userId,
        // A Report is 1:1 with an Order, so a multi-test order produces one
        // report covering every test on it - name them all rather than picking.
        packageName: order.items.length
          ? order.items.map((i) => i.nameSnapshot).join(' + ')
          : (order.package?.name ?? 'Unknown test'),
        pdfKey: key,
        summary,
        criticalFinding,
        uploadedById: guard.id ?? null,
      },
    });

    // STATUS IS NOT TOUCHED, and no email goes out. The report exists; whether
    // the customer may see it is KYG's call, made at /approve. Writing
    // REPORT_READY here would have said "your report is ready" on the customer's
    // own order page before anyone had looked at it.
    await prisma.orderEvent.create({
      data: {
        orderId,
        label: `Report ${reportNumber} uploaded - awaiting KYG review`,
        meta: { reportNumber, uploadedBy: guard.role },
        actorId: guard.id ?? null,
      },
    });

    return created({ ...report, awaitingReview: true });
  });
}

// RPT-NNNNNN - sequential, gap-tolerant. Fine for dev; replace with a real
// sequence when concurrency matters.
async function nextReportNumber(): Promise<string> {
  const last = await prisma.report.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { reportNumber: true },
  });
  const n = last?.reportNumber.match(/RPT-(\d+)/)?.[1] ? Number(last.reportNumber.match(/RPT-(\d+)/)![1]) + 1 : 1;
  return `RPT-${String(n).padStart(6, '0')}`;
}

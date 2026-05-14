import { prisma } from '@/lib/prisma';
import { created, fail, handle, isResponse, requireApiRole } from '@/lib/api';
import { putObject, reportKey, R2_CONFIGURED } from '@/lib/r2';

/**
 * POST /api/admin/reports/upload
 *   multipart/form-data:
 *     orderId          (string, required)
 *     file             (PDF, required, max 25MB)
 *     summary          (JSON string of string[], optional)
 *     criticalFinding  ("true"/"false", optional)
 *
 * Uploads the PDF to R2 and creates a Report row linked to the order's user.
 * The report is created in undelivered state - admin sends it separately
 * via the "send to user" action (email + WhatsApp; not yet implemented).
 */
const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    if (!R2_CONFIGURED) return fail('R2 not configured. Add R2_* env vars.', 500);

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
      include: { package: { select: { name: true } } },
    });
    if (!order) return fail('Order not found', 404);

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
        packageName: order.package.name,
        pdfKey: key,
        summary,
        criticalFinding,
        uploadedById: guard.id ?? null,
      },
    });

    // Move the order toward REPORT_READY. Admin still needs to "send" it.
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'REPORT_READY',
        events: { create: { label: `Report ${reportNumber} uploaded`, actorId: guard.id ?? null } },
      },
    });

    return created(report);
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

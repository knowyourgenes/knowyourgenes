import { prisma } from '@/server/prisma';
import { ApiError, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { presignDownload } from '@/features/reports';

type Params = Promise<{ id: string }>;

/**
 * POST /api/reports/[id]/download
 *
 * A customer fetching their own report. Returns a short-lived signed URL rather
 * than the bytes, so the PDF streams straight from object storage and never
 * passes through this server.
 *
 * SEPARATE FROM THE ADMIN ROUTE, deliberately. /api/admin/reports/[id]/download
 * serves staff and answers for any report; this one answers for exactly one
 * person's own reports. Widening the admin route to also serve customers would
 * put "whose report is this" inside a branch, and the day that branch is wrong
 * it hands someone else's genetic results to a stranger.
 *
 * POST, not GET, for the same reason the admin route is: a signed URL in a GET
 * lands in browser history and in the Referer header of whatever the PDF viewer
 * loads next.
 *
 * NOT RELEASED, NOT READABLE. `deliveredAt` is the gate - a report a lab has
 * uploaded but KYG has not yet approved does not exist as far as the customer is
 * concerned, and answering 404 rather than 403 keeps it that way.
 */
export async function POST(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    // Every signed-in role can own an order, so every role can own a report.
    const guard = await requireApiRole(['USER', 'ADMIN', 'AGENT', 'COUNSELLOR', 'PARTNER']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
      select: { id: true, userId: true, pdfKey: true, reportNumber: true, deliveredAt: true },
    });

    // One answer for "no such report", "not yours" and "not released yet". Three
    // different answers would let someone walk ids and learn which exist.
    if (!report || report.userId !== guard.id || !report.deliveredAt) {
      throw new ApiError('Report not found', 404);
    }

    const url = await presignDownload(report.pdfKey, 600);
    return ok({ url, reportNumber: report.reportNumber, expiresInSeconds: 600 });
  });
}

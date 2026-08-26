import { prisma } from '@/server/prisma';
import { ApiError, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { presignDownload } from '@/features/reports';

type Params = Promise<{ id: string }>;

/**
 * POST /api/admin/reports/[id]/download
 *
 * Returns a short-lived presigned R2 URL the client can fetch directly.
 * We POST instead of GET so the URL never lands in browser history / referer
 * headers.
 */
export async function POST(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN', 'COUNSELLOR', 'PARTNER']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    // ROLE IS NOT ENOUGH HERE. This is the only one of the admin handlers that
    // admits PARTNER, and it used to select the file key with no ownership
    // predicate at all - so any lab partner could fetch any customer's genetic
    // report by id. The sibling listing route refuses PARTNER outright, which
    // makes the asymmetry plain: a role judged untrustworthy to see the INDEX of
    // reports was trusted to fetch any single one.
    //
    // Report carries no labId of its own (nothing populates it), so ownership is
    // resolved through the order the report belongs to.
    const report = await prisma.report.findUnique({
      where: { id },
      select: { pdfKey: true, order: { select: { labId: true, orderNumber: true } } },
    });
    if (!report) throw new ApiError('Report not found', 404);

    if (guard.role === 'PARTNER') {
      const labs = await prisma.lab.findMany({
        where: { userId: guard.id! },
        select: { id: true },
      });
      const mine = new Set(labs.map((l) => l.id));
      if (!report.order?.labId || !mine.has(report.order.labId)) {
        // Same answer as a missing report - an id probe must not confirm that
        // someone else's report exists.
        throw new ApiError('Report not found', 404);
      }
    }

    const url = await presignDownload(report.pdfKey, 600);
    return ok({ url, expiresInSeconds: 600 });
  });
}

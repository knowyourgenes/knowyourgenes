import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { presignDownload } from '@/lib/r2';

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

    const report = await prisma.report.findUnique({ where: { id }, select: { pdfKey: true } });
    if (!report) throw new Error('Report not found');

    const url = await presignDownload(report.pdfKey, 600);
    return ok({ url, expiresInSeconds: 600 });
  });
}

import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { deleteObject } from '@/lib/r2';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN', 'COUNSELLOR']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        order: { select: { orderNumber: true, status: true } },
        user: { select: { name: true, email: true, phone: true } },
        markers: { orderBy: { position: 'asc' } },
      },
    });
    if (!report) throw new Error('Report not found');
    return ok(report);
  });
}

// Hard delete (R2 + db). Use with care — usually we'd soft-delete, but
// reports are PII and should be removable on user-deletion request.
export async function DELETE(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) throw new Error('Report not found');

    await deleteObject(report.pdfKey).catch(() => {
      // Don't block delete if R2 already missing — log and continue.
    });
    await prisma.report.delete({ where: { id } });
    return ok({ id });
  });
}

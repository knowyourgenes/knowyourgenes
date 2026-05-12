import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { labUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const lab = await prisma.lab.findUnique({ where: { id } });
    if (!lab) throw new Error('Lab not found');
    return ok(lab);
  });
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = labUpdate.parse(body);

    const lab = await prisma.$transaction(async (tx) => {
      if (data.isDefault === true) {
        await tx.lab.updateMany({
          where: { isDefault: true, NOT: { id } },
          data: { isDefault: false },
        });
      }
      return tx.lab.update({ where: { id }, data });
    });
    return ok(lab);
  });
}

// Soft-delete: deactivate. Refuse if it's the only active lab or the default.
export async function DELETE(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;

    const lab = await prisma.lab.findUnique({ where: { id } });
    if (!lab) throw new Error('Lab not found');
    if (lab.isDefault) throw new Error('Cannot deactivate the default lab. Promote another lab first.');

    const otherActive = await prisma.lab.count({ where: { active: true, NOT: { id } } });
    if (otherActive === 0) throw new Error('Cannot deactivate the only active lab.');

    const updated = await prisma.lab.update({ where: { id }, data: { active: false } });
    return ok(updated);
  });
}

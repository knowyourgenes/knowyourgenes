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
    const parsed = labUpdate.parse(body);
    // `login` is a create-time provisioning helper, not a Lab column. Editing
    // an existing lab's login is out of scope here — manage that on the user.
    const { login: _login, ...data } = parsed;

    const lab =
      data.isDefault === true
        ? (
            await prisma.$transaction([
              prisma.lab.updateMany({
                where: { isDefault: true, NOT: { id } },
                data: { isDefault: false },
              }),
              prisma.lab.update({ where: { id }, data }),
            ])
          )[1]
        : await prisma.lab.update({ where: { id }, data });
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

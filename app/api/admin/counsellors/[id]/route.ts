import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { counsellorUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = counsellorUpdate.parse(body);

    const { name, phone, ...profile } = data;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone: phone.replace(/\D/g, '') } : {}),
        counsellorProfile: { update: profile },
      },
      include: { counsellorProfile: true },
    });
    return ok(user);
  });
}

// Soft: set CounsellorProfile.active=false (keep audit trail).
// Permanent: delete User row — CounsellorProfile cascades via @relation.
export async function DELETE(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const permanent = new URL(req.url).searchParams.get('permanent') === 'true';

    if (permanent) {
      try {
        await prisma.user.delete({ where: { id } });
        return ok({ id, deleted: true });
      } catch (e) {
        if ((e as { code?: string }).code === 'P2003') {
          throw new Error('Cannot delete permanently: this counsellor has consultations or reviews. Deactivate instead.');
        }
        throw e;
      }
    }

    await prisma.counsellorProfile.update({ where: { userId: id }, data: { active: false } });
    return ok({ id, active: false });
  });
}

import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { partnerUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = partnerUpdate.parse(body);

    const { name, phone, ...profile } = data;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone: phone.replace(/\D/g, '') } : {}),
        labPartnerProfile: { update: profile },
      },
      include: { labPartnerProfile: true },
    });
    return ok(user);
  });
}

// Soft: LabPartner.active=false. Permanent: delete User (cascades LabPartner).
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
          throw new Error('Cannot delete permanently: this partner has orders assigned. Deactivate instead.');
        }
        throw e;
      }
    }

    await prisma.labPartner.update({ where: { userId: id }, data: { active: false } });
    return ok({ id, active: false });
  });
}

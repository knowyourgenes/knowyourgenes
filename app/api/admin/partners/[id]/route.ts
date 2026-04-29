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

// Deactivate only - sets LabPartner.active=false. KYG policy never hard-deletes.
export async function DELETE(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    await prisma.labPartner.update({ where: { userId: id }, data: { active: false } });
    return ok({ id, active: false });
  });
}

import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { partnerUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const partner = await prisma.labPartner.findUnique({
      where: { id },
      include: { locations: true },
    });
    if (!partner) throw new Error('Partner not found');
    return ok(partner);
  });
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = partnerUpdate.parse(body);
    const partner = await prisma.labPartner.update({ where: { id }, data });
    return ok(partner);
  });
}

// Soft-delete: deactivate the partner. Lab locations under it are left
// active so an in-flight order isn't orphaned mid-flow; deactivate them
// individually if needed.
export async function DELETE(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const partner = await prisma.labPartner.update({ where: { id }, data: { active: false } });
    return ok(partner);
  });
}

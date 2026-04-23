import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { serviceAreaUpdate } from '@/lib/validators';

type Params = Promise<{ pincode: string }>;

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { pincode } = await params;
    const body = await req.json();
    const data = serviceAreaUpdate.parse(body);
    const row = await prisma.serviceArea.update({ where: { pincode }, data });
    return ok(row);
  });
}

// Soft: active=false. Permanent: delete.
export async function DELETE(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { pincode } = await params;
    const permanent = new URL(req.url).searchParams.get('permanent') === 'true';

    if (permanent) {
      await prisma.serviceArea.delete({ where: { pincode } });
      return ok({ pincode, deleted: true });
    }

    const row = await prisma.serviceArea.update({ where: { pincode }, data: { active: false } });
    return ok(row);
  });
}

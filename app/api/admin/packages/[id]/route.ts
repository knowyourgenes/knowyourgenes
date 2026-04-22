import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { packageUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) throw new Error('Package not found');
    return ok(pkg);
  });
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = packageUpdate.parse(body);
    const pkg = await prisma.package.update({ where: { id }, data });
    return ok(pkg);
  });
}

// Archive (soft delete) by setting active=false. Keeps order history intact.
export async function DELETE(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const pkg = await prisma.package.update({ where: { id }, data: { active: false } });
    return ok(pkg);
  });
}

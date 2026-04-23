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

// DELETE: soft-delete by default (active=false). ?permanent=true hard-deletes.
export async function DELETE(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const permanent = new URL(req.url).searchParams.get('permanent') === 'true';

    if (permanent) {
      try {
        const pkg = await prisma.package.delete({ where: { id } });
        return ok(pkg);
      } catch (e) {
        if ((e as { code?: string }).code === 'P2003') {
          throw new Error('Cannot delete permanently: this package has orders referencing it. Deactivate instead.');
        }
        throw e;
      }
    }

    const pkg = await prisma.package.update({ where: { id }, data: { active: false } });
    return ok(pkg);
  });
}

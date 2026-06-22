import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { categoryUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error('Category not found');
    return ok(category);
  });
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = categoryUpdate.parse(body);
    const category = await prisma.category.update({ where: { id }, data });
    return ok(category);
  });
}

// Soft-delete: deactivate. Data is preserved.
export async function DELETE(_req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const category = await prisma.category.update({ where: { id }, data: { active: false } });
    return ok(category);
  });
}

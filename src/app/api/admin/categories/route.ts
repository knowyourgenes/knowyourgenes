import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { categoryCreate } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const items = await prisma.category.findMany({
      orderBy: [{ active: 'desc' }, { position: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        icon: true,
        position: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return ok(items);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const body = await req.json();
    const data = categoryCreate.parse(body);
    const category = await prisma.category.create({ data });
    return created(category);
  });
}

import { prisma } from '@/lib/prisma';
import { handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { couponUpdate } from '@/lib/validators';

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const body = await req.json();
    const data = couponUpdate.parse(body);
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        ...(data.code ? { code: data.code.toUpperCase() } : {}),
        ...(data.expiresAt ? { expiresAt: new Date(data.expiresAt) } : {}),
      },
    });
    return ok(coupon);
  });
}

// Soft: active=false. Permanent: full delete.
export async function DELETE(req: Request, { params }: { params: Params }) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const { id } = await params;
    const permanent = new URL(req.url).searchParams.get('permanent') === 'true';

    if (permanent) {
      const coupon = await prisma.coupon.delete({ where: { id } });
      return ok(coupon);
    }

    const coupon = await prisma.coupon.update({ where: { id }, data: { active: false } });
    return ok(coupon);
  });
}

import { prisma } from '@/lib/prisma';
import { created, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { couponCreate } from '@/lib/validators';

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const items = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return ok(items);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;
    const body = await req.json();
    const data = couponCreate.parse(body);
    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return created(coupon);
  });
}

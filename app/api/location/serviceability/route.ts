import { prisma } from '@/lib/prisma';
import { fail, handle, ok } from '@/lib/api';
import { delhivery } from '@/lib/delhivery';
import { z } from 'zod';

/**
 * GET /api/location/serviceability?pincode=110001[&type=forward|reverse]
 *
 * Combines two checks:
 *   1. Our own ServiceArea master - admin must have opted-in this pincode.
 *   2. Delhivery's pincode API - confirms the courier actually services it for
 *      the requested leg (forward = prepaid out, reverse = pickup from user).
 *
 * Returns serviceable=true only when BOTH agree. The UI uses this to gate the
 * "kit-by-post" fulfillment option at checkout.
 */

const querySchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
  type: z.enum(['forward', 'reverse', 'any']).default('any'),
});

export async function GET(req: Request) {
  return handle(async () => {
    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      pincode: url.searchParams.get('pincode'),
      type: url.searchParams.get('type') ?? 'any',
    });
    if (!parsed.success) return fail('Invalid pincode', 422, { issues: parsed.error.issues });

    const { pincode, type } = parsed.data;

    const [local, courier] = await Promise.all([
      prisma.serviceArea.findUnique({ where: { pincode } }),
      delhivery.serviceability(pincode).catch((e) => ({ error: e.message })),
    ]);

    const localActive = local?.active ?? false;
    const courierOk =
      'error' in courier
        ? false
        : type === 'forward'
          ? courier.prepaidForward
          : type === 'reverse'
            ? courier.reversePickup
            : courier.serviceable;

    return ok({
      pincode,
      type,
      serviceable: localActive && courierOk,
      local: {
        active: localActive,
        area: local?.area ?? null,
        district: local?.district ?? null,
        state: local?.state ?? null,
      },
      courier: 'error' in courier ? { error: courier.error } : courier,
      mock: delhivery.isMock(),
    });
  });
}

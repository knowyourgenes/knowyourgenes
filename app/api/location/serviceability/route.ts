import { prisma } from '@/lib/prisma';
import { fail, handle, ok } from '@/lib/api';
import { courier as courierClient } from '@/lib/courier';
import { z } from 'zod';

/**
 * GET /api/location/serviceability?pincode=110001[&type=forward|reverse]
 *
 * Combines two checks:
 *   1. Our own ServiceArea master - admin must have opted-in this pincode.
 *   2. The active courier's pincode API - confirms the courier actually
 *      services it for the requested leg (forward = prepaid out, reverse =
 *      pickup from user).
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

    // One pincode → many area rows. We treat the pincode as serviceable if
    // ANY area row under it is active. `local` is just an arbitrary row used
    // to surface the area/district/state names back to the caller.
    const [activeAreaCount, local, courierResult] = await Promise.all([
      prisma.serviceArea.count({ where: { pincode, active: true } }),
      prisma.serviceArea.findFirst({
        where: { pincode },
        orderBy: [{ active: 'desc' }, { area: 'asc' }], // prefer an active row
      }),
      courierClient.serviceability(pincode).catch((e: Error) => ({ error: e.message })),
    ]);

    const localActive = activeAreaCount > 0;
    const courierOk =
      'error' in courierResult
        ? false
        : type === 'forward'
          ? courierResult.prepaidForward
          : type === 'reverse'
            ? courierResult.reversePickup
            : courierResult.serviceable;

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
      courier: 'error' in courierResult ? { error: courierResult.error } : courierResult,
      provider: courierClient.activeCourier(),
      mock: courierClient.isMock(),
    });
  });
}

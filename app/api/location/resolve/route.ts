import { z } from 'zod';

import { fail, handle, ok } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { mapplsReverseGeocode } from '@/lib/mappls';

const schema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Public endpoint - guests use it before signing up to check if we deliver.
// POST { lat, lng } -> { pincode, area, district, state, serviceable }
export async function POST(req: Request) {
  return handle(async () => {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return fail('Invalid lat/lng', 400, { issues: parsed.error.issues });

    const geo = await mapplsReverseGeocode(parsed.data.lat, parsed.data.lng);
    if (!geo) return fail('Could not resolve location to an Indian pincode', 404);

    const sa = await prisma.serviceArea.findUnique({
      where: { pincode: geo.pincode },
      select: { active: true, district: true, state: true, area: true },
    });

    return ok({
      pincode: geo.pincode,
      area: sa?.area || geo.area,
      district: sa?.district || geo.district,
      state: sa?.state || geo.state,
      serviceable: sa?.active === true,
    });
  });
}

// Also accept GET ?pincode=XXXXXX as a cheaper check when client already has
// the pincode (e.g. user typed it manually). No Mappls call needed.
export async function GET(req: Request) {
  return handle(async () => {
    const url = new URL(req.url);
    const pincode = (url.searchParams.get('pincode') ?? '').trim();
    if (!/^\d{6}$/.test(pincode)) return fail('Invalid pincode', 400);

    const sa = await prisma.serviceArea.findUnique({
      where: { pincode },
      select: { pincode: true, area: true, district: true, state: true, active: true },
    });

    if (!sa) return ok({ pincode, serviceable: false, area: '', district: '', state: '' });

    return ok({
      pincode: sa.pincode,
      area: sa.area,
      district: sa.district,
      state: sa.state,
      serviceable: sa.active,
    });
  });
}

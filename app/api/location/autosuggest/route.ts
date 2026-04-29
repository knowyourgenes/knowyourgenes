import { prisma } from '@/lib/prisma';
import { handle, ok } from '@/lib/api';
import { mapplsAutosuggest } from '@/lib/mappls';

// GET /api/location/autosuggest?q=DLF+Phase
// Returns: { items: [{ placeName, placeAddress, pincode, area, district, state, serviceable }, ...] }
//
// Each item is annotated with `serviceable` by cross-checking Mappls' pincode
// against the ServiceArea table. Items whose pincode is not in the DB, or
// whose DB row is active=false, come back as serviceable=false.
//
// Public endpoint - used by the LocationGate dialog on the customer site.
// Short query (<2 chars) short-circuits to an empty list so we don't waste
// Mappls credit on single-letter typing.
export async function GET(req: Request) {
  return handle(async () => {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') ?? '').trim();
    if (q.length < 2) return ok({ items: [] });

    // Optional geographic bias - if caller already has a rough location.
    const lat = Number(url.searchParams.get('lat'));
    const lng = Number(url.searchParams.get('lng'));
    const bias = Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : {};

    const hits = await mapplsAutosuggest(q, { ...bias, region: 'ind', limit: 8 });

    // Bulk-check serviceability for all returned pincodes in a single DB query.
    const pincodes = [...new Set(hits.map((h) => h.pincode).filter((p): p is string => !!p))];
    const activePincodes = pincodes.length
      ? new Set(
          (
            await prisma.serviceArea.findMany({
              where: { pincode: { in: pincodes }, active: true },
              select: { pincode: true },
            })
          ).map((r) => r.pincode)
        )
      : new Set<string>();

    const items = hits.map((h) => ({
      placeName: h.placeName,
      placeAddress: h.placeAddress,
      pincode: h.pincode,
      area: h.area,
      district: h.district,
      state: h.state,
      lat: h.lat,
      lng: h.lng,
      type: h.type,
      serviceable: h.pincode ? activePincodes.has(h.pincode) : false,
    }));

    return ok({ items });
  });
}

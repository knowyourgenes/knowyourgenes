import { z } from 'zod';

import { fail, handle, ok } from '@/lib/api';
import { mapplsGeocode } from '@/lib/mappls';

const schema = z.object({
  address: z.string().min(3).max(400),
});

// POST /api/location/geocode  { address: "Plot 14, Okhla, Delhi 110020" }
// Returns { lat, lng, formatted, pincode }
// Wired for future use on the checkout address form.
export async function POST(req: Request) {
  return handle(async () => {
    const body = schema.safeParse(await req.json().catch(() => null));
    if (!body.success) return fail('Invalid address', 400, { issues: body.error.issues });

    const result = await mapplsGeocode(body.data.address);
    if (!result) return fail('Could not geocode this address', 404);

    return ok(result);
  });
}

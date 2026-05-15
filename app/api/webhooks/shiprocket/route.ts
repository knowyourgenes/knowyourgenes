import { prisma } from '@/lib/prisma';
import { applyTrackingToShipment } from '@/lib/shipments';
import type { ShipmentStatus } from '@prisma/client';

/**
 * POST /api/webhooks/shiprocket
 *
 * Shiprocket push-status webhook. Format (per Shiprocket "Order Tracking
 * Webhook" docs, current as of 2026):
 *
 * {
 *   "awb": "1234567890",
 *   "current_status": "Delivered",
 *   "current_status_id": 7,
 *   "current_timestamp": "2026-05-14 10:23:00",
 *   "order_id": "KYG-...-FWD",
 *   "courier_name": "Delhivery",
 *   "etd": "2026-05-15",
 *   "scans": [{ "date": "...", "activity": "...", "location": "..." }]
 * }
 *
 * Auth: shared-secret header `X-Api-Key` matched against
 * SHIPROCKET_WEBHOOK_TOKEN. Configure this in the Shiprocket dashboard
 * (Settings → API → Webhooks).
 */
export async function POST(req: Request) {
  const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
  const got = req.headers.get('x-api-key') ?? req.headers.get('x-shiprocket-token');
  if (expected && got !== expected) {
    return new Response('forbidden', { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const awb = (body.awb as string | undefined) ?? (body.awb_code as string | undefined);
  if (!awb) return new Response('missing awb', { status: 400 });

  const shipment = await prisma.shipment.findUnique({ where: { awb } });
  if (!shipment) return new Response('unknown awb', { status: 404 });

  const statusRaw = (body.current_status as string | undefined) ?? '';
  const status = mapStatus(statusRaw);
  const occurredAt = body.current_timestamp ? new Date(body.current_timestamp as string) : new Date();
  const location = body.location as string | undefined;
  const label = (body.activity as string | undefined) ?? (body.current_status as string | undefined) ?? status;

  await applyTrackingToShipment(shipment.id, {
    awb,
    currentStatus: status,
    scans: [{ status, label, location, occurredAt }],
    rawResponse: body,
  });

  return Response.json({ ok: true });
}

function mapStatus(s: string): ShipmentStatus {
  const v = s.toLowerCase();
  if (!v) return 'CREATED';
  if (v.includes('delivered')) return 'DELIVERED';
  if (v.includes('out for delivery')) return 'OUT_FOR_DELIVERY';
  if (v.includes('rto')) return 'RTO';
  if (v.includes('pickup scheduled') || v.includes('pickup generated') || v.includes('pickup queued'))
    return 'PICKUP_SCHEDULED';
  if (v.includes('picked up') || (v.includes('pickup') && v.includes('done'))) return 'IN_TRANSIT';
  if (v.includes('manifested') || v.includes('shipment booked') || v.includes('awb assigned')) return 'MANIFESTED';
  if (v.includes('cancel')) return 'CANCELLED';
  if (v.includes('undelivered') || v.includes('failed')) return 'FAILED';
  if (v.includes('in transit')) return 'IN_TRANSIT';
  return 'CREATED';
}

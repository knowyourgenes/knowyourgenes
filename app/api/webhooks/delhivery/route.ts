import { prisma } from '@/server/prisma';
import { applyTrackingToShipment } from '@/features/shipments';
import type { ShipmentStatus } from '@prisma/client';

/**
 * POST /api/webhooks/delhivery
 *
 * Delhivery push-status webhook. Their format isn't fully standardised across
 * accounts; we accept either:
 *   - { Shipment: { AWB, Status, StatusDateTime, ... } }   (older)
 *   - { waybill, status, status_datetime, location, ... }  (newer)
 *
 * Auth: shared-secret header `X-Delhivery-Token` matched against
 * DELHIVERY_WEBHOOK_SECRET. Configure this with Delhivery support when you
 * register the webhook URL.
 */
export async function POST(req: Request) {
  const expected = process.env.DELHIVERY_WEBHOOK_SECRET;
  const got = req.headers.get('x-delhivery-token');
  // FAIL CLOSED. This used to read `if (expected && got !== expected)`, so an
  // unset secret disabled the check entirely and every request was accepted -
  // the guard only existed once it was already configured. That is the opposite
  // of what the payments webhook does one directory over, and it was wired to
  // the endpoint that writes Order.status. The only input an attacker needed was
  // an AWB, which the customer's own order page prints.
  if (!expected) {
    console.error('[webhook] DELHIVERY_WEBHOOK_SECRET is not set - refusing tracking callbacks');
    return new Response('webhook not configured', { status: 503 });
  }
  if (got !== expected) {
    return new Response('forbidden', { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const awb = extractAwb(body);
  if (!awb) return new Response('missing awb', { status: 400 });

  const shipment = await prisma.shipment.findUnique({ where: { awb } });
  if (!shipment) return new Response('unknown awb', { status: 404 });

  const status = mapStatus(extractStatus(body));
  const occurredAt = extractDate(body) ?? new Date();
  const location = extractLocation(body);
  const label = extractLabel(body) ?? status;

  await applyTrackingToShipment(shipment.id, {
    awb,
    currentStatus: status,
    scans: [{ status, label, location, occurredAt }],
    rawResponse: body,
  });

  return Response.json({ ok: true });
}

// Helpers - Delhivery field shapes vary between webhook generations so we
// defensively look in both shapes.

function extractAwb(b: Record<string, unknown>): string | null {
  const ship = b.Shipment as Record<string, unknown> | undefined;
  return (
    (b.waybill as string | undefined) ??
    (b.AWB as string | undefined) ??
    (ship?.AWB as string | undefined) ??
    (ship?.Waybill as string | undefined) ??
    null
  );
}

function extractStatus(b: Record<string, unknown>): string {
  const ship = b.Shipment as Record<string, unknown> | undefined;
  const sub = ship?.Status as Record<string, unknown> | undefined;
  return (b.status as string | undefined) ?? (sub?.Status as string | undefined) ?? '';
}

function extractDate(b: Record<string, unknown>): Date | null {
  const ship = b.Shipment as Record<string, unknown> | undefined;
  const sub = ship?.Status as Record<string, unknown> | undefined;
  const v = (b.status_datetime as string | undefined) ?? (sub?.StatusDateTime as string | undefined);
  return v ? new Date(v) : null;
}

function extractLocation(b: Record<string, unknown>): string | undefined {
  const ship = b.Shipment as Record<string, unknown> | undefined;
  const sub = ship?.Status as Record<string, unknown> | undefined;
  return (b.location as string | undefined) ?? (sub?.StatusLocation as string | undefined);
}

function extractLabel(b: Record<string, unknown>): string | undefined {
  return (b.instructions as string | undefined) ?? (b.remarks as string | undefined);
}

/**
 * ORDER MATTERS HERE, and it is not the order a reader expects.
 *
 * 'delivered' is a substring of 'undelivered', and 'rto delivered' contains
 * both. Every negative case must therefore be tested BEFORE the positive one,
 * or a failed delivery is recorded as a successful one. This file already
 * guarded RTO that way; 'undelivered' slipped through and reached the
 * `v.includes('fail')` line that could never see it.
 */
function mapStatus(s: string): ShipmentStatus {
  const v = s.toLowerCase();
  if (v.includes('undelivered') || v.includes('not delivered') || v.includes('fail')) return 'FAILED';
  if (v.includes('rto')) return 'RTO';
  if (v.includes('delivered')) return 'DELIVERED';
  if (v.includes('out for delivery')) return 'OUT_FOR_DELIVERY';
  if (v.includes('pickup scheduled')) return 'PICKUP_SCHEDULED';
  if (v.includes('manifested')) return 'MANIFESTED';
  if (v.includes('cancel')) return 'CANCELLED';
  if (v.includes('in transit') || (v.includes('pickup') && v.includes('done'))) return 'IN_TRANSIT';
  return 'CREATED';
}

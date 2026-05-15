/**
 * Shiprocket API client.
 *
 * Shiprocket is a multi-courier aggregator: one API, ~25 backend couriers
 * (Delhivery, Bluedart, DTDC, Ekart, Shadowfax, Xpressbees, etc.). Good for
 * launch because we get nationwide reverse-pickup serviceability without
 * negotiating with each courier individually.
 *
 * Auth model: POST email+password → JWT (10-day TTL). We cache the token in
 * module scope and lazily refresh on 401 or before expiry.
 *
 * Two modes:
 *   - Real: hits Shiprocket using SHIPROCKET_EMAIL + SHIPROCKET_PASSWORD.
 *   - Mock: deterministic fake responses so the rest of the system is
 *     demoable before credentials land. Toggle with SHIPROCKET_MOCK=true,
 *     auto-enabled when EMAIL is empty.
 *
 * The shape of the return values matches lib/delhivery.ts exactly so the
 * courier abstraction in lib/courier.ts can hot-swap providers via env.
 */
import type { ShipmentLeg, ShipmentStatus as PrismaShipmentStatus } from '@prisma/client';
import type {
  CreateShipmentInput,
  CreateShipmentResult,
  PartyAddress,
  PickupRequestResult,
  ServiceabilityResult,
  TrackingResult,
  TrackingScan,
} from '@/lib/delhivery';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BASE_URL = process.env.SHIPROCKET_BASE_URL ?? 'https://apiv2.shiprocket.in';
const EMAIL = process.env.SHIPROCKET_EMAIL ?? '';
const PASSWORD = process.env.SHIPROCKET_PASSWORD ?? '';
const DEFAULT_PICKUP_LOCATION = process.env.SHIPROCKET_PICKUP_LOCATION ?? 'KYG-LAB-DELHI';
const CHANNEL_ID = process.env.SHIPROCKET_CHANNEL_ID ?? '';
export const MOCK = process.env.SHIPROCKET_MOCK === 'true' || !EMAIL || !PASSWORD;

// ---------------------------------------------------------------------------
// Token cache (module-scoped — fine because Node single-threads per worker)
// ---------------------------------------------------------------------------

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

async function getToken(): Promise<string> {
  // Refresh 12h before the 10-day window closes.
  const now = Date.now();
  if (cachedToken && cachedTokenExpiresAt - now > 12 * 60 * 60 * 1000) {
    return cachedToken;
  }
  const res = await fetch(`${BASE_URL}/v1/external/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Shiprocket auth failed: ${res.status} ${body}`);
  }
  const json = (await res.json()) as { token?: string };
  if (!json.token) throw new Error('Shiprocket auth: missing token in response');
  cachedToken = json.token;
  cachedTokenExpiresAt = now + 10 * 24 * 60 * 60 * 1000; // 10 days
  return cachedToken;
}

async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (res.status === 401) {
    // Token expired between cache refresh and now; clear and retry once.
    cachedToken = null;
    cachedTokenExpiresAt = 0;
    const fresh = await getToken();
    headers.set('Authorization', `Bearer ${fresh}`);
    return fetch(`${BASE_URL}${path}`, { ...init, headers });
  }
  return res;
}

// ---------------------------------------------------------------------------
// Public client (same contract as lib/delhivery.ts)
// ---------------------------------------------------------------------------

export const shiprocket = {
  isMock: () => MOCK,

  /**
   * Shiprocket serviceability. POST /v1/external/courier/serviceability/
   * with pickup_postcode + delivery_postcode. Response includes per-courier
   * rate cards. We collapse it to a boolean per leg type.
   */
  async serviceability(pincode: string, pickupPincode?: string): Promise<ServiceabilityResult> {
    if (MOCK) return mockServiceability(pincode);

    // Default pickup pin for the serviceability check; the real shipment will
    // use the lab's actual pin. This is just to decide "can we reach the user
    // at all" before we commit to a lab.
    const pickup = pickupPincode ?? '110034'; // Pitam Pura, registered office

    const qs = new URLSearchParams({
      pickup_postcode: pickup,
      delivery_postcode: pincode,
      cod: '0',
      weight: '0.5',
    });
    const res = await authedFetch(`/v1/external/courier/serviceability/?${qs}`);
    if (!res.ok) {
      // 422 means no courier services this lane — treat as unserviceable, not an error.
      if (res.status === 422) {
        return { pincode, serviceable: false, prepaidForward: false, reversePickup: false, cod: false };
      }
      throw new Error(`Shiprocket serviceability failed: ${res.status}`);
    }
    const json = (await res.json()) as {
      data?: {
        available_courier_companies?: Array<{
          courier_company_id: number;
          courier_name: string;
          cod: number;
          pickup_availability?: string;
          delivery_postcode_country?: string;
        }>;
      };
    };
    const couriers = json.data?.available_courier_companies ?? [];
    if (couriers.length === 0) {
      return { pincode, serviceable: false, prepaidForward: false, reversePickup: false, cod: false };
    }
    const cod = couriers.some((c) => c.cod === 1);
    // Any courier that can deliver means prepaid-forward works. Reverse is harder —
    // not every courier supports reverse pickup. Best signal is calling the
    // reverse-pickup specific serviceability endpoint. Keeping conservative here:
    // if there's at least one courier, we mark reverse as available and let
    // shipment creation fail loudly if it doesn't.
    return {
      pincode,
      serviceable: true,
      prepaidForward: true,
      reversePickup: true,
      cod,
    };
  },

  /**
   * Create a shipment.
   *
   * Shiprocket's flow is two-step:
   *   1) POST /v1/external/orders/create/adhoc        — creates the order
   *   2) POST /v1/external/courier/assign/awb         — assigns an AWB (auto-rate-shop)
   *
   * For REVERSE legs the endpoint differs:
   *   POST /v1/external/orders/create/return          — creates a return order
   *   AWB assignment same as forward.
   */
  async createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
    if (MOCK) return mockCreateShipment(input);

    const isReverse = input.leg === 'REVERSE';
    const endpoint = isReverse ? '/v1/external/orders/create/return' : '/v1/external/orders/create/adhoc';

    // Shiprocket expects pickup_location to match a saved Pickup Address nickname.
    const pickupLocation = input.pickupLocationName ?? DEFAULT_PICKUP_LOCATION;

    // Names are split into first/last for Shiprocket; we keep it pragmatic.
    const [billingFirstName, ...billingRest] = input.drop.name.split(' ');
    const [pickupFirstName, ...pickupRest] = input.pickup.name.split(' ');

    const orderPayload: Record<string, unknown> = {
      order_id: input.refNumber, // our ref → Shiprocket's order_id
      order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pickup_location: pickupLocation,
      channel_id: CHANNEL_ID || undefined,
      billing_customer_name: billingFirstName ?? input.drop.name,
      billing_last_name: billingRest.join(' '),
      billing_address: input.drop.line,
      billing_city: input.drop.city,
      billing_pincode: input.drop.pincode,
      billing_state: '',
      billing_country: 'India',
      billing_email: 'care@kyg.in',
      billing_phone: input.drop.phone,
      shipping_is_billing: true,
      order_items: [
        {
          name: isReverse ? 'Saliva sample (biological)' : 'DNA test kit',
          sku: isReverse ? 'KYG-SAMPLE' : 'KYG-KIT',
          units: 1,
          selling_price: (input.declaredValue / 100).toFixed(2),
        },
      ],
      payment_method: isReverse ? 'COD' : 'Prepaid',
      sub_total: (input.declaredValue / 100).toFixed(2),
      length: 15,
      breadth: 10,
      height: 8,
      weight: (input.weightGrams / 1000).toFixed(3),
    };

    if (isReverse) {
      // Return-order payload puts the user as PICKUP (sample origin) and lab as DELIVERY.
      orderPayload.pickup_customer_name = pickupFirstName ?? input.pickup.name;
      orderPayload.pickup_last_name = pickupRest.join(' ');
      orderPayload.pickup_address = input.pickup.line;
      orderPayload.pickup_city = input.pickup.city;
      orderPayload.pickup_pincode = input.pickup.pincode;
      orderPayload.pickup_country = 'India';
      orderPayload.pickup_state = '';
      orderPayload.pickup_email = 'care@kyg.in';
      orderPayload.pickup_phone = input.pickup.phone;
    }

    const orderRes = await authedFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
    const orderJson = (await orderRes.json()) as {
      order_id?: number;
      shipment_id?: number;
      status?: string;
      status_code?: number;
      message?: string;
    };
    if (!orderRes.ok || !orderJson.shipment_id) {
      throw new Error(`Shiprocket create order failed: ${orderJson.message ?? orderRes.status}`);
    }

    // Step 2: assign AWB (auto rate-shop). Shiprocket picks the cheapest serviceable courier.
    const awbRes = await authedFetch('/v1/external/courier/assign/awb', {
      method: 'POST',
      body: JSON.stringify({ shipment_id: orderJson.shipment_id }),
    });
    const awbJson = (await awbRes.json()) as {
      awb_assign_status?: number;
      response?: {
        data?: {
          awb_code?: string;
          courier_company_id?: number;
          courier_name?: string;
        };
      };
      message?: string;
    };
    const awb = awbJson.response?.data?.awb_code;
    if (!awbRes.ok || !awb) {
      throw new Error(`Shiprocket AWB assign failed: ${awbJson.message ?? awbRes.status}`);
    }

    return {
      awb,
      refNumber: input.refNumber,
      status: 'MANIFESTED',
      rawResponse: { order: orderJson, awb: awbJson },
    };
  },

  /**
   * Schedule a reverse pickup. Shiprocket needs the shipment_id from the
   * return order — we already have the AWB so we look the shipment_id up via
   * GET /v1/external/courier/track/awb/<awb>.
   *
   * In practice, Shiprocket auto-schedules pickups for return orders at AWB
   * assignment time. This method is provided for parity with the Delhivery
   * client and just acks the AWB.
   */
  async schedulePickup(opts: {
    awb: string;
    pickupDate: Date;
    expectedPackageCount?: number;
    pickupLocationName?: string;
  }): Promise<PickupRequestResult> {
    if (MOCK) return mockSchedulePickup(opts);

    // Look up the shipment_id from the AWB so we can call /generate/pickup.
    const lookup = await authedFetch(`/v1/external/courier/track/awb/${encodeURIComponent(opts.awb)}`);
    const lookupJson = (await lookup.json()) as { tracking_data?: { shipment_id?: number } };
    const shipmentId = lookupJson.tracking_data?.shipment_id;
    if (!shipmentId) {
      // Reverse pickups are auto-scheduled — soft success.
      return {
        pickupRequestId: `SR-AUTO-${opts.awb}`,
        expectedAt: opts.pickupDate,
        rawResponse: { autoScheduled: true, awb: opts.awb },
      };
    }
    const res = await authedFetch('/v1/external/courier/generate/pickup', {
      method: 'POST',
      body: JSON.stringify({ shipment_id: [shipmentId] }),
    });
    const json = (await res.json()) as {
      pickup_status?: number;
      response?: { pickup_token_number?: string; pickup_scheduled_date?: string };
      message?: string;
    };
    return {
      pickupRequestId: json.response?.pickup_token_number ?? `SR-${shipmentId}`,
      expectedAt: json.response?.pickup_scheduled_date
        ? new Date(json.response.pickup_scheduled_date)
        : opts.pickupDate,
      rawResponse: json,
    };
  },

  /**
   * Track. GET /v1/external/courier/track/awb/<awb>
   */
  async track(awb: string): Promise<TrackingResult> {
    if (MOCK) return mockTrack(awb);

    const res = await authedFetch(`/v1/external/courier/track/awb/${encodeURIComponent(awb)}`);
    if (!res.ok) throw new Error(`Shiprocket track failed: ${res.status}`);
    const json = (await res.json()) as {
      tracking_data?: {
        shipment_status?: string;
        shipment_track?: Array<{ current_status?: string }>;
        shipment_track_activities?: Array<{
          date?: string;
          status?: string;
          activity?: string;
          location?: string;
          'sr-status'?: string;
        }>;
      };
    };
    const td = json.tracking_data;
    if (!td) throw new Error(`Shiprocket track: AWB ${awb} not found`);
    const currentStatus = mapShiprocketStatus(td.shipment_status ?? td.shipment_track?.[0]?.current_status ?? '');
    const scans: TrackingScan[] = (td.shipment_track_activities ?? []).map((a) => ({
      status: mapShiprocketStatus(a['sr-status'] ?? a.status ?? ''),
      label: a.activity ?? a.status ?? 'Scan',
      location: a.location,
      occurredAt: a.date ? new Date(a.date) : new Date(),
    }));
    return { awb, currentStatus, scans, rawResponse: json };
  },

  /**
   * Cancel a shipment. POST /v1/external/orders/cancel with awb list.
   */
  async cancel(awb: string): Promise<{ ok: boolean; rawResponse: unknown }> {
    if (MOCK) return { ok: true, rawResponse: { mock: true, awb } };

    const res = await authedFetch('/v1/external/orders/cancel', {
      method: 'POST',
      body: JSON.stringify({ awbs: [awb] }),
    });
    const json = await res.json();
    return { ok: res.ok, rawResponse: json };
  },
};

// ---------------------------------------------------------------------------
// Status mapping. Shiprocket's `sr-status` codes (numeric) and `status` strings
// vary; we cover the common ones. Anything we don't recognise falls back to
// CREATED so the operator can investigate.
// ---------------------------------------------------------------------------

function mapShiprocketStatus(s: string): PrismaShipmentStatus {
  const v = s.toLowerCase();
  if (!v) return 'CREATED';
  if (v.includes('delivered')) return 'DELIVERED';
  if (v.includes('out for delivery')) return 'OUT_FOR_DELIVERY';
  if (v.includes('rto')) return 'RTO';
  if (v.includes('pickup scheduled') || v.includes('pickup generated') || v.includes('pickup queued'))
    return 'PICKUP_SCHEDULED';
  if (v.includes('pickup') && v.includes('done')) return 'IN_TRANSIT';
  if (v.includes('picked up')) return 'IN_TRANSIT';
  if (v.includes('manifested') || v.includes('shipment booked') || v.includes('awb assigned')) return 'MANIFESTED';
  if (v.includes('cancel')) return 'CANCELLED';
  if (v.includes('undelivered') || v.includes('failed')) return 'FAILED';
  if (v.includes('in transit')) return 'IN_TRANSIT';
  return 'CREATED';
}

// ---------------------------------------------------------------------------
// Mocks — same shape as Delhivery's so the abstraction layer doesn't care.
// ---------------------------------------------------------------------------

function mockServiceability(pincode: string): ServiceabilityResult {
  const last = Number(pincode.slice(-1));
  if (last === 0) {
    return { pincode, serviceable: false, prepaidForward: false, reversePickup: false, cod: false };
  }
  const reverse = last !== 9;
  return {
    pincode,
    serviceable: true,
    prepaidForward: true,
    reversePickup: reverse,
    cod: true,
    city: 'Mock City',
    state: 'DL',
  };
}

function mockCreateShipment(input: CreateShipmentInput): CreateShipmentResult {
  const awb = `SRMOCK${input.leg === 'FORWARD' ? 'F' : 'R'}${Date.now().toString().slice(-9)}`;
  return {
    awb,
    refNumber: input.refNumber,
    status: 'MANIFESTED',
    rawResponse: { mock: true, provider: 'shiprocket', input },
  };
}

function mockSchedulePickup(opts: { awb: string; pickupDate: Date }): PickupRequestResult {
  return {
    pickupRequestId: `SRMOCKPR${Date.now().toString().slice(-8)}`,
    expectedAt: opts.pickupDate,
    rawResponse: { mock: true, awb: opts.awb },
  };
}

function mockTrack(awb: string): TrackingResult {
  return {
    awb,
    currentStatus: 'MANIFESTED',
    scans: [
      {
        status: 'MANIFESTED',
        label: 'Shipment booked (mock)',
        location: 'Origin Hub',
        occurredAt: new Date(),
      },
    ],
    rawResponse: { mock: true, awb },
  };
}

// Re-export shared types for callers who only import shiprocket.
export type { PartyAddress, CreateShipmentInput, CreateShipmentResult, PickupRequestResult, TrackingResult };

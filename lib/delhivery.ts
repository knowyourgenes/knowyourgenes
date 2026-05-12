/**
 * Delhivery B2C surface API client.
 *
 * Two modes:
 *   - Real: hits Delhivery's API using DELHIVERY_BASE_URL + DELHIVERY_TOKEN.
 *   - Mock: returns deterministic fake responses so the rest of the system
 *     (admin UI, order state machine, seeds) is demoable before credentials
 *     land. Toggle with DELHIVERY_MOCK=true.
 *
 * Delhivery's exact endpoint paths and field names have shifted between
 * versions of their docs; treat the URLs below as the current best guess and
 * confirm against your KAM's onboarding pack before going live. The shape of
 * the *response* objects we return from this module is our own contract — the
 * rest of the codebase only depends on these typed return values.
 */
import type { ShipmentLeg, ShipmentStatus as PrismaShipmentStatus } from '@prisma/client';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BASE_URL = process.env.DELHIVERY_BASE_URL ?? 'https://staging-express.delhivery.com';
const TOKEN = process.env.DELHIVERY_TOKEN ?? '';
// Default pickup-location name. Per-lab names are now passed at call time;
// this env var is the legacy/global fallback used only when a Lab row hasn't
// been resolved (shouldn't happen in normal flow).
const DEFAULT_PICKUP_LOCATION = process.env.DELHIVERY_PICKUP_LOCATION ?? 'KYG-LAB-DELHI';
export const MOCK = process.env.DELHIVERY_MOCK === 'true' || !TOKEN;

function authHeaders(): HeadersInit {
  return {
    Authorization: `Token ${TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

// ---------------------------------------------------------------------------
// Shared types (our contract; the wrappers normalise Delhivery's response)
// ---------------------------------------------------------------------------

export interface ServiceabilityResult {
  pincode: string;
  serviceable: boolean; // any leg
  prepaidForward: boolean; // we can ship a kit Prepaid to this pin
  reversePickup: boolean; // we can pick a sample up from this pin
  cod: boolean;
  city?: string;
  state?: string;
}

export interface CreateShipmentInput {
  leg: ShipmentLeg;
  refNumber: string; // our internal id (KYG-<order>-FWD/REV)
  pickup: PartyAddress;
  drop: PartyAddress;
  weightGrams: number;
  declaredValue: number; // paise
  /**
   * Delhivery's "pickup_location.name" — must match a warehouse registered
   * in their portal. If omitted, falls back to DELHIVERY_PICKUP_LOCATION env.
   * Should be set per-Lab so multi-lab shipments work.
   */
  pickupLocationName?: string;
}

export interface PartyAddress {
  name: string;
  phone: string;
  line: string;
  city: string;
  pincode: string;
}

export interface CreateShipmentResult {
  awb: string;
  refNumber: string;
  status: PrismaShipmentStatus;
  rawResponse: unknown;
}

export interface PickupRequestResult {
  pickupRequestId: string;
  expectedAt: Date | null;
  rawResponse: unknown;
}

export interface TrackingScan {
  status: PrismaShipmentStatus;
  label: string;
  location?: string;
  occurredAt: Date;
}

export interface TrackingResult {
  awb: string;
  currentStatus: PrismaShipmentStatus;
  scans: TrackingScan[];
  rawResponse: unknown;
}

// ---------------------------------------------------------------------------
// Public client
// ---------------------------------------------------------------------------

export const delhivery = {
  isMock: () => MOCK,

  /**
   * Pincode serviceability. Endpoint: /c/api/pin-codes/json/?filter_codes=<pin>
   * Response (real) is shaped:
   *   { delivery_codes: [{ postal_code: { ..., pre_paid: "Y"/"N", pickup: "Y"/"N", cod: "Y"/"N" }}] }
   */
  async serviceability(pincode: string): Promise<ServiceabilityResult> {
    if (MOCK) return mockServiceability(pincode);

    const url = `${BASE_URL}/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pincode)}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Delhivery serviceability failed: ${res.status}`);
    const json = (await res.json()) as {
      delivery_codes?: Array<{ postal_code?: Record<string, string> }>;
    };
    const pc = json.delivery_codes?.[0]?.postal_code;
    if (!pc) {
      return {
        pincode,
        serviceable: false,
        prepaidForward: false,
        reversePickup: false,
        cod: false,
      };
    }
    const yes = (v: string | undefined) => v?.toUpperCase() === 'Y';
    return {
      pincode,
      serviceable: true,
      prepaidForward: yes(pc.pre_paid),
      reversePickup: yes(pc.pickup),
      cod: yes(pc.cod),
      city: pc.city,
      state: pc.state_code,
    };
  },

  /**
   * Create a shipment (forward or reverse). Endpoint: /api/cmu/create.json
   * Real Delhivery expects form-urlencoded body with `format=json&data=<JSON>`.
   */
  async createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
    if (MOCK) return mockCreateShipment(input);

    const order = {
      name: input.drop.name,
      add: input.drop.line,
      pin: input.drop.pincode,
      city: input.drop.city,
      country: 'India',
      phone: input.drop.phone,
      order: input.refNumber,
      payment_mode: input.leg === 'REVERSE' ? 'Pickup' : 'Prepaid',
      return_pin: input.pickup.pincode,
      return_city: input.pickup.city,
      return_phone: input.pickup.phone,
      return_add: input.pickup.line,
      return_name: input.pickup.name,
      products_desc: input.leg === 'FORWARD' ? 'DNA test kit' : 'Saliva sample (biological)',
      hsn_code: '',
      cod_amount: '0',
      order_date: new Date().toISOString(),
      total_amount: (input.declaredValue / 100).toFixed(2),
      seller_add: input.pickup.line,
      seller_name: input.pickup.name,
      seller_inv: '',
      quantity: '1',
      waybill: '',
      shipment_width: '15',
      shipment_height: '10',
      weight: input.weightGrams.toString(),
      shipping_mode: 'Surface',
      address_type: 'home',
    };

    const payload = {
      shipments: [order],
      pickup_location: { name: input.pickupLocationName ?? DEFAULT_PICKUP_LOCATION },
    };

    const body = `format=json&data=${encodeURIComponent(JSON.stringify(payload))}`;
    const res = await fetch(`${BASE_URL}/api/cmu/create.json`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
    });
    const json = (await res.json()) as {
      success?: boolean;
      packages?: Array<{ waybill?: string; refnum?: string; status?: string; remarks?: string[] }>;
      rmk?: string;
    };
    if (!res.ok || !json.success || !json.packages?.[0]?.waybill) {
      throw new Error(
        `Delhivery createShipment failed: ${json.rmk ?? json.packages?.[0]?.remarks?.join(', ') ?? res.status}`
      );
    }
    return {
      awb: json.packages[0].waybill!,
      refNumber: json.packages[0].refnum ?? input.refNumber,
      status: 'MANIFESTED',
      rawResponse: json,
    };
  },

  /**
   * Schedule a reverse pickup at the user's door. Endpoint: /fm/request/new/
   * Only valid for REVERSE legs. Forward leg pickups are auto-scheduled by
   * Delhivery from the registered warehouse.
   */
  async schedulePickup(opts: {
    awb: string;
    pickupDate: Date;
    expectedPackageCount?: number;
    pickupLocationName?: string;
  }): Promise<PickupRequestResult> {
    if (MOCK) return mockSchedulePickup(opts);

    const body = {
      pickup_location: opts.pickupLocationName ?? DEFAULT_PICKUP_LOCATION,
      pickup_date: opts.pickupDate.toISOString().slice(0, 10),
      pickup_time: '14:00:00',
      expected_package_count: opts.expectedPackageCount ?? 1,
    };
    const res = await fetch(`${BASE_URL}/fm/request/new/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { pickup_id?: string; pr_status?: string };
    if (!res.ok || !json.pickup_id) {
      throw new Error(`Delhivery schedulePickup failed: ${res.status}`);
    }
    return {
      pickupRequestId: String(json.pickup_id),
      expectedAt: opts.pickupDate,
      rawResponse: json,
    };
  },

  /**
   * Tracking. Endpoint: /api/v1/packages/json/?waybill=<awb>
   */
  async track(awb: string): Promise<TrackingResult> {
    if (MOCK) return mockTrack(awb);

    const url = `${BASE_URL}/api/v1/packages/json/?waybill=${encodeURIComponent(awb)}`;
    const res = await fetch(url, { headers: authHeaders() });
    const json = (await res.json()) as {
      ShipmentData?: Array<{
        Shipment?: {
          Status?: { Status?: string; StatusDateTime?: string; StatusLocation?: string };
          Scans?: Array<{
            ScanDetail?: {
              Scan?: string;
              ScanDateTime?: string;
              StatusDateTime?: string;
              ScannedLocation?: string;
              Instructions?: string;
            };
          }>;
        };
      }>;
    };
    const pkg = json.ShipmentData?.[0]?.Shipment;
    if (!pkg) throw new Error(`Delhivery track: AWB ${awb} not found`);

    const scans: TrackingScan[] = (pkg.Scans ?? []).map((s) => {
      const detail = s.ScanDetail;
      const occurred = detail?.ScanDateTime ?? detail?.StatusDateTime ?? new Date().toISOString();
      return {
        status: mapDelhiveryStatus(detail?.Scan ?? ''),
        label: detail?.Instructions ?? detail?.Scan ?? 'Scan',
        location: detail?.ScannedLocation,
        occurredAt: new Date(occurred),
      };
    });
    return {
      awb,
      currentStatus: mapDelhiveryStatus(pkg.Status?.Status ?? ''),
      scans,
      rawResponse: json,
    };
  },

  /**
   * Cancel a shipment. Endpoint: /api/p/edit (cancellation set to true).
   */
  async cancel(awb: string): Promise<{ ok: boolean; rawResponse: unknown }> {
    if (MOCK) return { ok: true, rawResponse: { mock: true, awb } };

    const body = `format=json&data=${encodeURIComponent(JSON.stringify({ waybill: awb, cancellation: 'true' }))}`;
    const res = await fetch(`${BASE_URL}/api/p/edit`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
    });
    const json = await res.json();
    return { ok: res.ok, rawResponse: json };
  },
};

// ---------------------------------------------------------------------------
// Status mapping. Delhivery's Scan strings include:
//   "Manifested", "In Transit", "Out For Delivery", "Delivered",
//   "Pending", "RTO", "DTO" (return), "Pickup Scheduled", "Pickup Done", etc.
// ---------------------------------------------------------------------------

function mapDelhiveryStatus(s: string): PrismaShipmentStatus {
  const v = s.toLowerCase();
  if (v.includes('delivered') && !v.includes('rto')) return 'DELIVERED';
  if (v.includes('out for delivery') || v.includes('out-for-delivery')) return 'OUT_FOR_DELIVERY';
  if (v.includes('rto')) return 'RTO';
  if (v.includes('pickup scheduled')) return 'PICKUP_SCHEDULED';
  if (v.includes('pickup') && v.includes('done')) return 'IN_TRANSIT';
  if (v.includes('manifested')) return 'MANIFESTED';
  if (v.includes('cancel')) return 'CANCELLED';
  if (v.includes('fail')) return 'FAILED';
  if (v.includes('in transit') || v.includes('in-transit')) return 'IN_TRANSIT';
  return 'CREATED';
}

// ---------------------------------------------------------------------------
// Mock implementations - deterministic from inputs so tests are stable.
// ---------------------------------------------------------------------------

function mockServiceability(pincode: string): ServiceabilityResult {
  // Pincode ending in 0 = unserviceable (lets us demo the failure path).
  const last = Number(pincode.slice(-1));
  if (last === 0) {
    return { pincode, serviceable: false, prepaidForward: false, reversePickup: false, cod: false };
  }
  // Pincode ending in 9 = forward only (no reverse pickup, lets us demo "kit-by-post unavailable here")
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
  const awb = `MOCK${input.leg === 'FORWARD' ? 'F' : 'R'}${Date.now().toString().slice(-9)}`;
  return {
    awb,
    refNumber: input.refNumber,
    status: 'MANIFESTED',
    rawResponse: { mock: true, input },
  };
}

function mockSchedulePickup(opts: { awb: string; pickupDate: Date }): PickupRequestResult {
  return {
    pickupRequestId: `MOCKPR${Date.now().toString().slice(-8)}`,
    expectedAt: opts.pickupDate,
    rawResponse: { mock: true, awb: opts.awb },
  };
}

function mockTrack(awb: string): TrackingResult {
  // Mock tracking: report MANIFESTED + a single fake scan.
  return {
    awb,
    currentStatus: 'MANIFESTED',
    scans: [
      {
        status: 'MANIFESTED',
        label: 'Shipment manifested (mock)',
        location: 'Origin Hub',
        occurredAt: new Date(),
      },
    ],
    rawResponse: { mock: true, awb },
  };
}

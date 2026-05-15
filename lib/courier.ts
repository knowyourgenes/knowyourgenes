/**
 * Courier provider abstraction.
 *
 * Dispatches to Shiprocket OR Delhivery depending on COURIER_PROVIDER env var.
 * Both clients implement the same shape (see lib/delhivery.ts for the contract
 * types). The rest of the codebase imports from this file — never directly
 * from a provider — so flipping providers is a one-line env change.
 *
 *   COURIER_PROVIDER=shiprocket   → recommended for launch (multi-courier)
 *   COURIER_PROVIDER=delhivery    → switch when volume justifies direct rates
 *
 * The Shipment row records which provider was used on the `courier` column,
 * so historical shipments stay correctly routed for tracking pulls even if
 * the active provider is later flipped.
 */
import type { ShipmentCourier } from '@prisma/client';
import { delhivery } from '@/lib/delhivery';
import { shiprocket } from '@/lib/shiprocket';
import type {
  CreateShipmentInput,
  CreateShipmentResult,
  PickupRequestResult,
  ServiceabilityResult,
  TrackingResult,
} from '@/lib/delhivery';

type CourierKey = 'shiprocket' | 'delhivery';

function active(): CourierKey {
  const v = (process.env.COURIER_PROVIDER ?? 'shiprocket').toLowerCase();
  return v === 'delhivery' ? 'delhivery' : 'shiprocket';
}

export function activeCourierEnum(): ShipmentCourier {
  return active() === 'delhivery' ? 'DELHIVERY' : 'SHIPROCKET';
}

function clientFor(courier?: ShipmentCourier | null) {
  // When we're refreshing tracking on a Shipment row, prefer the courier the
  // shipment was *created* with. Falls back to the active env provider for new
  // shipments.
  if (courier === 'DELHIVERY') return delhivery;
  if (courier === 'SHIPROCKET') return shiprocket;
  return active() === 'delhivery' ? delhivery : shiprocket;
}

export const courier = {
  /**
   * Which courier the new shipment will be booked through. Use this to set
   * Shipment.courier at create time so the value on the row is authoritative.
   */
  activeCourier: activeCourierEnum,

  isMock(c?: ShipmentCourier | null): boolean {
    return clientFor(c).isMock();
  },

  serviceability(pincode: string, pickupPincode?: string): Promise<ServiceabilityResult> {
    const c = clientFor();
    // Delhivery's serviceability ignores pickupPincode (takes a single pin).
    if (c === delhivery) return c.serviceability(pincode);
    return shiprocket.serviceability(pincode, pickupPincode);
  },

  createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
    return clientFor().createShipment(input);
  },

  schedulePickup(opts: {
    awb: string;
    pickupDate: Date;
    expectedPackageCount?: number;
    pickupLocationName?: string;
    courier?: ShipmentCourier | null;
  }): Promise<PickupRequestResult> {
    return clientFor(opts.courier).schedulePickup(opts);
  },

  track(awb: string, c?: ShipmentCourier | null): Promise<TrackingResult> {
    return clientFor(c).track(awb);
  },

  cancel(awb: string, c?: ShipmentCourier | null): Promise<{ ok: boolean; rawResponse: unknown }> {
    return clientFor(c).cancel(awb);
  },
};

export type { CreateShipmentInput, CreateShipmentResult, PickupRequestResult, ServiceabilityResult, TrackingResult };

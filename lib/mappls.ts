/**
 * MapMyIndia / Mappls API client (server-only)
 * --------------------------------------------
 * Uses a single long-lived **Static Key** (REST API key) issued by a Mappls
 * Cloud app. Per official docs, the key is passed as the `access_token`
 * query parameter on every call.
 *
 *   Reverse Geocoding: lat/lng  -> pincode + address
 *   Autosuggest:        query  -> predictions with lat/lng + pincode
 *   Geocoding:          address -> lat/lng
 *
 * Ref:
 *   https://developer.mappls.com (Reverse Geocoding / Autosuggest / Geocoding)
 *
 * Required env:
 *   MAPPLS_API_KEY  - the Static Key from the Credentials tab of your Cloud app.
 *
 * Never import from a client component. Make sure the Reverse Geocoding,
 * Autosuggest, and Geocode APIs are Active in your app's Allocations tab.
 */

const BASE = 'https://apis.mappls.com/advancedmaps/v1';

function requireKey(): string {
  const key = process.env.MAPPLS_API_KEY;
  if (!key) throw new Error('MAPPLS_API_KEY not set');
  return key;
}

async function mapplsGet<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const key = requireKey();
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  url.searchParams.set('access_token', key);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Mappls ${path} failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Reverse Geocoding - lat/lng -> pincode + address
// ---------------------------------------------------------------------------

export type ReverseGeocodeResult = {
  pincode: string;
  area: string;
  district: string;
  state: string;
  city: string;
  formatted?: string;
};

type RevGeoItem = {
  pincode?: string | number;
  poi?: string;
  area?: string;
  locality?: string;
  street?: string;
  city?: string;
  subDistrict?: string;
  district?: string;
  state?: string;
  formatted_address?: string;
};

type RevGeoResponse = {
  results?: RevGeoItem[];
  responseCode?: number;
};

export async function mapplsReverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
  const json = await mapplsGet<RevGeoResponse>('/rev_geocode', { lat, lng });
  const hit = json.results?.[0];
  if (!hit) return null;

  const pincode = String(hit.pincode ?? '').trim();
  if (!/^\d{6}$/.test(pincode)) return null;

  const district = (hit.district ?? hit.subDistrict ?? '').toString().trim();
  const state = (hit.state ?? '').toString().trim();

  return {
    pincode,
    area: (hit.area ?? hit.locality ?? hit.street ?? hit.poi ?? '').toString().trim(),
    district,
    state,
    city: (hit.city ?? district).toString().trim(),
    formatted: hit.formatted_address,
  };
}

// ---------------------------------------------------------------------------
// Autosuggest - as-you-type place/address/POI predictions
// ---------------------------------------------------------------------------

export type AutosuggestHit = {
  eLoc?: string;
  placeName: string; // e.g. "Connaught Place"
  placeAddress: string; // full address string Mappls returns
  pincode: string | null; // may be null for POIs that don't map to a single PIN
  area: string;
  district: string;
  state: string;
  lat: number | null;
  lng: number | null;
  type?: string; // POI, LOCALITY, SUB_LOCALITY, CITY, …
};

type AutosuggestResponseItem = {
  eLoc?: string;
  placeName?: string;
  placeAddress?: string;
  type?: string;
  addressTokens?: {
    poi?: string;
    subLocality?: string;
    locality?: string;
    village?: string;
    subDistrict?: string;
    district?: string;
    city?: string;
    state?: string;
    pincode?: string | number;
  };
  latitude?: number | string;
  longitude?: number | string;
};

type AutosuggestResponse = {
  suggestedLocations?: AutosuggestResponseItem[];
  responseCode?: number;
};

/**
 * Fetch Mappls autosuggest predictions for a query.
 *
 * @param query    partial text the user typed
 * @param opts     optional geographic bias (centred around these coords)
 */
export async function mapplsAutosuggest(
  query: string,
  opts: { lat?: number; lng?: number; region?: 'ind'; limit?: number } = {}
): Promise<AutosuggestHit[]> {
  const params: Record<string, string | number> = { query };
  if (opts.lat !== undefined && opts.lng !== undefined) {
    params.location = `${opts.lat},${opts.lng}`;
  }
  if (opts.region) params.region = opts.region;

  const json = await mapplsGet<AutosuggestResponse>('/autosuggest', params);
  const rows = json.suggestedLocations ?? [];

  const limit = opts.limit ?? 10;
  return rows.slice(0, limit).map((r) => {
    const t = r.addressTokens ?? {};
    const pin = (t.pincode ?? '').toString().trim();
    const lat = r.latitude != null ? Number(r.latitude) : null;
    const lng = r.longitude != null ? Number(r.longitude) : null;
    return {
      eLoc: r.eLoc,
      placeName: (r.placeName ?? '').trim(),
      placeAddress: (r.placeAddress ?? '').trim(),
      pincode: /^\d{6}$/.test(pin) ? pin : null,
      area: (t.subLocality ?? t.locality ?? t.village ?? t.poi ?? '').toString().trim(),
      district: (t.district ?? t.subDistrict ?? '').toString().trim(),
      state: (t.state ?? '').toString().trim(),
      lat: lat !== null && Number.isFinite(lat) ? lat : null,
      lng: lng !== null && Number.isFinite(lng) ? lng : null,
      type: r.type,
    };
  });
}

// ---------------------------------------------------------------------------
// Geocoding - address string -> lat/lng
// ---------------------------------------------------------------------------

export type GeocodeResult = {
  lat: number;
  lng: number;
  formatted: string;
  pincode: string | null;
};

type GeocodeResponseItem = {
  latitude?: number | string;
  longitude?: number | string;
  formatted_address?: string;
  pincode?: string | number;
};

type GeocodeResponse = {
  copResults?: GeocodeResponseItem | GeocodeResponseItem[];
  results?: GeocodeResponseItem[];
  responseCode?: number;
};

export async function mapplsGeocode(address: string): Promise<GeocodeResult | null> {
  const json = await mapplsGet<GeocodeResponse>('/geo_code', { addr: address });
  // Mappls responses vary: sometimes `copResults` (single object), sometimes `results` (array).
  const pick = Array.isArray(json.copResults) ? json.copResults[0] : (json.copResults ?? json.results?.[0]);
  if (!pick) return null;

  const lat = pick.latitude != null ? Number(pick.latitude) : NaN;
  const lng = pick.longitude != null ? Number(pick.longitude) : NaN;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const pin = (pick.pincode ?? '').toString().trim();
  return {
    lat,
    lng,
    formatted: (pick.formatted_address ?? '').trim(),
    pincode: /^\d{6}$/.test(pin) ? pin : null,
  };
}

# API reference

Concise route catalog. Live OpenAPI is generated at `/api-docs` (Swagger UI in the admin shell).

All admin endpoints require `requireApiRole(['ADMIN', ...])` and respond with the envelope `{ ok: true, data }` or `{ ok: false, error }`.

---

## Public

| Method   | Path                                | Notes                                                                                                                      |
| -------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| GET/POST | `/api/auth/[...nextauth]`           | NextAuth handlers (Google OAuth + Credentials).                                                                            |
| POST     | `/api/auth/register`                | Email/phone signup. Hashes password with bcrypt.                                                                           |
| GET      | `/api/location/serviceability`     | `?pincode=...&type=forward\|reverse\|any` — Combines our master ServiceArea + active courier (Shiprocket/Delhivery) reach. |
| GET      | `/api/location/resolve`             | `?pincode=...` or POST `{lat,lng}` for reverse-geocode. Mappls-backed.                                                     |
| GET      | `/api/location/autosuggest`         | Address autocomplete via Mappls.                                                                                           |
| GET      | `/api/location/geocode`             | Forward geocode address → coords.                                                                                          |
| POST     | `/api/track/visit`                  | Anonymous visit beacon (UTM analytics). IP-masked, UA-truncated, fails soft.                                               |
| GET      | `/api/openapi.json`                 | Live OpenAPI spec.                                                                                                         |

## Customer (authenticated)

| Method | Path                       | Notes                                                                                                                   |
| ------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/checkout`            | Create `BOOKED` Order + Razorpay order. Reads + denormalises the `kyg_attr` cookie onto the Order at this moment.       |
| POST   | `/api/checkout/verify`     | Client-side payment callback. HMAC-verifies signature, marks Order paid, increments coupon usage.                       |

## Webhooks (server-to-server)

| Method | Path                            | Auth                                            |
| ------ | ------------------------------- | ----------------------------------------------- |
| POST   | `/api/webhooks/razorpay`        | `X-Razorpay-Signature` HMAC of raw body.        |
| POST   | `/api/webhooks/shiprocket`      | `X-Api-Key` shared secret.                      |
| POST   | `/api/webhooks/delhivery`       | `X-Delhivery-Token` shared secret.              |

All webhook handlers return 200 even on unknown events — non-2xx triggers vendor retries.

## Admin

### Orders & shipments

| Method | Path                                                | Roles                  |
| ------ | --------------------------------------------------- | ---------------------- |
| GET    | `/api/admin/orders`                                 | ADMIN, COUNSELLOR      |
| PATCH  | `/api/admin/orders/[id]/status`                     | ADMIN                  |
| POST   | `/api/admin/orders/[id]/assign-agent`               | ADMIN                  |
| POST   | `/api/admin/orders/[id]/shipments`                  | ADMIN — creates forward or reverse shipment via the active courier (`COURIER_PROVIDER`). |
| GET    | `/api/admin/shipments`                              | ADMIN                  |
| GET    | `/api/admin/shipments/[id]`                         | ADMIN                  |
| POST   | `/api/admin/shipments/[id]/refresh`                 | ADMIN — pulls latest tracking from the courier the shipment was created with. |
| POST   | `/api/admin/shipments/[id]/cancel`                  | ADMIN                  |

### Catalog & ops

| Method            | Path                                  | Roles |
| ----------------- | ------------------------------------- | ----- |
| GET/POST          | `/api/admin/packages`                 | ADMIN |
| GET/PATCH/DELETE  | `/api/admin/packages/[id]`            | ADMIN |
| GET/POST          | `/api/admin/coupons`                  | ADMIN |
| GET/PATCH/DELETE  | `/api/admin/coupons/[id]`             | ADMIN |
| GET/POST          | `/api/admin/labs`                     | ADMIN — KYG-owned facilities. `Lab.pickupLocationName` must match the courier's saved warehouse nickname. |
| GET/PATCH/DELETE  | `/api/admin/labs/[id]`                | ADMIN |
| GET/POST          | `/api/admin/agents`                   | ADMIN — phlebotomists (Phase 2). |
| GET/PATCH/DELETE  | `/api/admin/agents/[id]`              | ADMIN |
| GET/POST          | `/api/admin/counsellors`              | ADMIN |
| GET/PATCH/DELETE  | `/api/admin/counsellors/[id]`         | ADMIN |
| GET/POST          | `/api/admin/partners`                 | ADMIN |
| GET/PATCH/DELETE  | `/api/admin/partners/[id]`            | ADMIN |
| GET/POST          | `/api/admin/users`                    | ADMIN |
| PATCH             | `/api/admin/users/[id]/role`          | ADMIN |
| PATCH             | `/api/admin/users/[id]/status`        | ADMIN |

### Reports

| Method | Path                                       | Roles             |
| ------ | ------------------------------------------ | ----------------- |
| GET    | `/api/admin/reports`                       | ADMIN, COUNSELLOR |
| GET    | `/api/admin/reports/[id]`                  | ADMIN, COUNSELLOR |
| POST   | `/api/admin/reports/upload`                | ADMIN — uploads PDF to R2, creates Report row. |
| GET    | `/api/admin/reports/[id]/download`         | ADMIN, COUNSELLOR — short-lived presigned R2 URL. |

### Marketing (UTM / attribution)

| Method | Path                                | Notes                                                  |
| ------ | ----------------------------------- | ------------------------------------------------------ |
| GET/POST          | `/api/admin/campaigns`     | Builds and lists trackable UTM campaign links.        |
| GET/PATCH/DELETE  | `/api/admin/campaigns/[id]` | Per-row CRUD.                                          |

### Service area (pincodes)

| Method            | Path                                                   | Notes                                                                          |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| GET/POST          | `/api/admin/service-area`                              | List with q/state/district/active filters. POST = single row or bulk array.    |
| PATCH/DELETE      | `/api/admin/service-area/[id]`                         | Single-row toggle / soft-delete by cuid.                                       |
| POST              | `/api/admin/service-area/bulk-toggle`                  | `{ state?, district?, pincodes?, ids?, active }` — at least one scope key.     |
| GET               | `/api/admin/service-area/stats`                        | Top-card numbers. **Single aggregate query.**                                  |
| GET               | `/api/admin/service-area/tree`                         | State→district hierarchy with counts. **Single aggregate query.**              |
| GET               | `/api/admin/service-area/tree/areas`                   | `?state=...&district=...` — lazy-loaded area rows for one district.            |

## Agent (Phase 2)

| Method | Path                                    | Notes                                |
| ------ | --------------------------------------- | ------------------------------------ |
| GET    | `/api/agent/me`                         | Self profile.                        |
| GET    | `/api/agent/orders`                     | Today's slots assigned to agent.     |
| GET    | `/api/agent/orders/[id]`                | Order detail.                        |
| POST   | `/api/agent/orders/[id]/transition`     | Drive the AT_HOME state machine.     |
| GET/PATCH | `/api/agent/profile`                 | Profile update.                      |
| GET/PATCH | `/api/agent/availability`            | Slot window opt-in/out.              |

---

## Response shape

```json
// Success
{ "ok": true, "data": { /* payload */ } }
// Failure
{ "ok": false, "error": "human-readable string", "issues": [/* Zod issues, if any */] }
```

Status codes: `200` OK · `201` created · `400` validation/business error · `401` unauthenticated · `403` wrong role · `404` not found · `409` conflict (e.g. duplicate shipment leg) · `422` Zod validation · `500` internal · `502` upstream (Razorpay / courier).

---

## Performance notes

See [docs/PERFORMANCE.md](./PERFORMANCE.md) for the measured profile of the heaviest endpoints, the indexes that back them, and how to re-measure.

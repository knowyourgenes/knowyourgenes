# Performance

Measured profile of the hot paths and the optimisations that landed. Re-measure with `pnpm tsx scripts/perf-baseline.ts` after any schema or query change.

---

## Current measured timings (DB latency only)

Measured against Aiven Postgres with 154,463 `ServiceArea` rows. These are wall-clock from Node, including network round-trip to the DB region.

| Endpoint                                  | DB latency        | Notes                                                                |
| ----------------------------------------- | ----------------- | -------------------------------------------------------------------- |
| `/api/admin/service-area/stats`           | **~140 ms**       | Was ~1.1 s (6 queries). Now 1 `$queryRaw` with FILTER aggregates.    |
| `/api/admin/service-area/tree`            | **~110 ms**       | Was ~155 ms (2 groupBy). Now 1 `$queryRaw`.                          |
| `/api/admin/service-area` (list, default) | **~100 ms**       | findMany + count, both fast — indexed.                               |
| `/api/admin/service-area` (search alpha)  | **~140 ms** total | Was ~700 ms. pg_trgm GIN index + drop pointless pincode OR branch.   |
| `/api/admin/service-area` (search digits) | **~80 ms**        | pincode btree `startsWith`.                                          |
| `/api/admin/service-area/tree/areas` (one district) | ~50 ms  | lazy-loaded, indexed on (state, district).                           |
| `/admin/attribution` page                 | ~250 ms (max)     | Was sum of 4 sequential queries; now `Promise.all`.                  |
| `/api/admin/orders` (list)                | ~500 ms cold/empty | Prisma nested include planning overhead. Worth re-measuring once data lands. |

---

## Index inventory

Indexes on `ServiceArea` (the hottest table):

| Index name                          | Columns                 | What it serves                              |
| ----------------------------------- | ----------------------- | ------------------------------------------- |
| `ServiceArea_pkey`                  | `id`                    | Single-row PATCH/DELETE.                    |
| `ServiceArea_pincode_area_key`      | `(pincode, area)` UNIQUE | Composite identity (multi-area per pincode). |
| `ServiceArea_pincode_idx`           | `pincode`               | Serviceability lookup, prefix search.       |
| `ServiceArea_active_idx`            | `active`                | Filter active rows for stats.               |
| `ServiceArea_state_idx`             | `state`                 | State filter in list view.                  |
| `ServiceArea_district_idx`          | `district`              | District filter in list view.               |
| `ServiceArea_state_district_idx`    | `(state, district)`     | Tree/areas lookup, district filter under state. |
| `ServiceArea_area_trgm_idx`         | `area` (GIN, gin_trgm_ops) | Case-insensitive substring search on area. |
| `ServiceArea_district_trgm_idx`     | `district` (GIN, gin_trgm_ops) | Case-insensitive substring search on district. |

Other key indexes added along the way:
- `Order.attrSource, attrMedium` — attribution dashboard groupBy.
- `Order.campaignId` — campaign → order count.
- `Order.razorpayOrderId` — webhook lookup.
- `Shipment.awb` UNIQUE — webhook lookup.
- `AttributionVisit.source, medium` + `campaign` + `createdAt` — visit analytics.

---

## Pattern catalog

What we use across endpoints and why.

### 1. Conditional aggregates over multi-query stat panels

Anywhere you need "count A, count B, count distinct C" for a UI card, use **one** raw query with `COUNT(*) FILTER (WHERE ...)`. Six round-trips of "300 ms each waiting for the network" beats any clever Prisma findMany trick.

```ts
const [r] = await prisma.$queryRaw<Row[]>`
  SELECT
    COUNT(*)::bigint                       AS total,
    COUNT(*) FILTER (WHERE active)::bigint AS active,
    COUNT(DISTINCT col)::bigint            AS unique_col
  FROM "Table"
`;
```

### 2. `findMany({ distinct: [...] }).length` is a trap

It pulls the entire distinct set across the wire just so you can call `.length` on the array. Use `COUNT(DISTINCT col)` in raw SQL instead — 10× faster for any non-trivial table.

### 3. Smart query shape based on input content

The search box accepts pincode digits, area names, and district names — three different indexes serve them. Don't OR all three branches always; **detect input shape and dispatch**:

```ts
const hasDigits = /\d/.test(q);
const hasAlpha = /[a-zA-Z]/.test(q);
const branches = [];
if (hasDigits) branches.push({ pincode: { startsWith: q } });
if (hasAlpha)  branches.push({ area: { contains: q, mode: 'insensitive' } });
```

For an alpha-only query, you don't make the planner consider the pincode index for no rows.

### 4. Parallelize independent server-component queries

Server components that fetch from multiple tables run sequentially by default. Wrap in `Promise.all` when there are no dependencies. The page TTFB drops from `sum(times)` to `max(times)`.

### 5. Stale-while-revalidate on the client

`/admin/service-area` caches stats + tree + area lists in `sessionStorage` for 5 min. First paint of a revisit is **instant**; a background refetch updates if stale. See [lib/client-cache.ts](../lib/client-cache.ts).

### 6. In-flight request dedupe

A `Map<string, Promise>` collapses duplicate concurrent fetches (e.g. tab switches firing the same loader). Same logical call fires once.

### 7. Optimistic updates with rollback

Switches in `/admin/service-area` flip locally first, hit the API in background, roll back on failure. Latency-tolerant UX.

---

## How to find a new bottleneck

```powershell
# 1. Time the suspected endpoint
pnpm tsx scripts/perf-baseline.ts
```

```sql
-- 2. EXPLAIN ANALYZE the slow query
EXPLAIN (ANALYZE, BUFFERS) <the SQL Prisma generated>;
```

Look for:
- **Seq Scan on big table** → missing index. Add one.
- **Rows Removed by Filter: N** → query reaches the index but filters too late; add a composite index.
- **Hash Join with huge build side** → consider denormalising the column you're joining on.

```powershell
# 3. Re-time
pnpm tsx scripts/perf-baseline.ts
```

Anything in `scripts/` that helped find a bottleneck stays in `scripts/` for future regression testing.

---

## What we deliberately did NOT optimise

- `prisma.order.findMany` with nested `agent.user.name` include: 500 ms cold on the empty table. The Order table is empty at launch. Optimising on speculative data shape risks changing the response payload contract before it matters. Re-measure once orders accumulate, then either flatten the include or denormalise an `agentName` column onto Order.
- Webhook handlers: they're already O(1) DB writes; webhook latency is dominated by the vendor's outbound retry behaviour, not our code.
- The Sanity blog queries (`lib/sanity.ts`): the blog routes don't exist yet; nothing to optimise.

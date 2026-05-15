-- ServiceArea search uses case-insensitive substring match across area and
-- district names. Without trigram indexes the planner falls back to a
-- sequential scan and the count() side of the search takes ~600ms on the
-- 154K-row table. GIN trigram indexes bring it down to ~30ms.
--
-- pg_trgm is a standard extension; Aiven / RDS / Supabase / mainline Postgres
-- all support it.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "ServiceArea_area_trgm_idx"
  ON "ServiceArea" USING GIN ("area" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "ServiceArea_district_trgm_idx"
  ON "ServiceArea" USING GIN ("district" gin_trgm_ops);

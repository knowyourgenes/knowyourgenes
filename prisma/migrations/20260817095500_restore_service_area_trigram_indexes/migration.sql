-- Restores the two GIN trigram indexes on ServiceArea.
--
-- WHY THIS EXISTS: trigram indexes cannot be expressed in schema.prisma, so
-- Prisma treats them as drift and emits a DROP INDEX into the next migration it
-- generates. That is exactly what happened in
-- 20260817094719_add_order_items_and_optional_slot, which silently dropped both
-- and sent ServiceArea search back to a sequential scan (~600ms on 154K rows).
--
-- IF YOU GENERATE A MIGRATION AND SEE "DropIndex ServiceArea_*_trgm_idx" AGAIN:
-- delete those two lines from the generated SQL before applying it. They are
-- not real schema changes.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "ServiceArea_area_trgm_idx"
  ON "ServiceArea" USING GIN ("area" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "ServiceArea_district_trgm_idx"
  ON "ServiceArea" USING GIN ("district" gin_trgm_ops);

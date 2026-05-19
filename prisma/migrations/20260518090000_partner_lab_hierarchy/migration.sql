-- KYG model change: KYG no longer owns labs. Each Lab is now a physical
-- location belonging to a LabPartner (parent org), with optional per-lab login.
--
-- 1) Detach Order.labPartnerId
-- 2) Drop the old LabPartner table (1:1 with User)
-- 3) Recreate LabPartner as a parent-org table with its own PK
-- 4) Add Lab.partnerId (required) + Lab.userId (optional per-lab login)
-- 5) Add Order.partnerId + Order.labId
-- 6) Add Report.labId

-- --- ORDER: remove old labPartnerId FK + index + column ---
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_labPartnerId_fkey";
DROP INDEX IF EXISTS "Order_labPartnerId_idx";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "labPartnerId";

-- --- LAB PARTNER: drop and recreate with new shape ---
DROP TABLE IF EXISTS "LabPartner" CASCADE;

CREATE TABLE "LabPartner" (
    "id"            TEXT NOT NULL,
    "slug"          TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "accreditation" TEXT NOT NULL,
    "contactEmail"  TEXT NOT NULL,
    "contactPhone"  TEXT NOT NULL,
    "active"        BOOLEAN NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabPartner_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LabPartner_slug_key" ON "LabPartner"("slug");
CREATE INDEX "LabPartner_active_idx" ON "LabPartner"("active");

-- --- LAB: add partnerId (required) + per-lab login userId (optional) ---
ALTER TABLE "Lab"
    ADD COLUMN "partnerId" TEXT,
    ADD COLUMN "userId"    TEXT;

-- partnerId is required by the new model. Table is empty after reset, so a
-- straight NOT NULL works.
ALTER TABLE "Lab" ALTER COLUMN "partnerId" SET NOT NULL;

ALTER TABLE "Lab"
    ADD CONSTRAINT "Lab_partnerId_fkey"
    FOREIGN KEY ("partnerId") REFERENCES "LabPartner"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Lab"
    ADD CONSTRAINT "Lab_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Lab_userId_key" ON "Lab"("userId");
CREATE INDEX "Lab_partnerId_idx" ON "Lab"("partnerId");

-- --- ORDER: add new partner + lab FKs ---
ALTER TABLE "Order"
    ADD COLUMN "partnerId" TEXT,
    ADD COLUMN "labId"     TEXT;

ALTER TABLE "Order"
    ADD CONSTRAINT "Order_partnerId_fkey"
    FOREIGN KEY ("partnerId") REFERENCES "LabPartner"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order"
    ADD CONSTRAINT "Order_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "Lab"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Order_partnerId_idx" ON "Order"("partnerId");
CREATE INDEX "Order_labId_idx"     ON "Order"("labId");

-- --- REPORT: add lab attribution ---
ALTER TABLE "Report" ADD COLUMN "labId" TEXT;

ALTER TABLE "Report"
    ADD CONSTRAINT "Report_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "Lab"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Report_labId_idx" ON "Report"("labId");

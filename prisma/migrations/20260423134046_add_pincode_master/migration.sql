-- AlterTable
ALTER TABLE "ServiceArea" ADD COLUMN     "district" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "state" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "city" SET DEFAULT '',
ALTER COLUMN "active" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "ServiceArea_state_idx" ON "ServiceArea"("state");

-- CreateIndex
CREATE INDEX "ServiceArea_district_idx" ON "ServiceArea"("district");

-- CreateIndex
CREATE INDEX "ServiceArea_state_district_idx" ON "ServiceArea"("state", "district");

-- One Indian pincode covers many post offices / localities, so we replace the
-- single @unique(pincode) constraint with a composite @@unique(pincode, area).
-- An index on pincode alone is added back for fast lookup-by-pincode queries
-- (serviceability checks).

-- DropIndex
DROP INDEX "ServiceArea_pincode_key";

-- CreateIndex
CREATE UNIQUE INDEX "ServiceArea_pincode_area_key" ON "ServiceArea"("pincode", "area");

-- CreateIndex
CREATE INDEX "ServiceArea_pincode_idx" ON "ServiceArea"("pincode");

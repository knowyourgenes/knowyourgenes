-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PARTNER';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "labPartnerId" TEXT;

-- CreateTable
CREATE TABLE "LabPartner" (
    "userId" TEXT NOT NULL,
    "labName" TEXT NOT NULL,
    "accreditation" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabPartner_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "LabPartner_active_idx" ON "LabPartner"("active");

-- CreateIndex
CREATE INDEX "Order_labPartnerId_idx" ON "Order"("labPartnerId");

-- AddForeignKey
ALTER TABLE "LabPartner" ADD CONSTRAINT "LabPartner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_labPartnerId_fkey" FOREIGN KEY ("labPartnerId") REFERENCES "LabPartner"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

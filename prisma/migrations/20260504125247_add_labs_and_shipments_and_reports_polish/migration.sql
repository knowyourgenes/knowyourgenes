-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('AT_HOME_PHLEBOTOMIST', 'KIT_BY_POST', 'EITHER');

-- CreateEnum
CREATE TYPE "ShipmentLeg" AS ENUM ('FORWARD', 'REVERSE');

-- CreateEnum
CREATE TYPE "ShipmentCourier" AS ENUM ('DELHIVERY');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('CREATED', 'MANIFESTED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RTO', 'CANCELLED', 'FAILED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'KIT_DISPATCHED';
ALTER TYPE "OrderStatus" ADD VALUE 'KIT_DELIVERED';
ALTER TYPE "OrderStatus" ADD VALUE 'SAMPLE_PICKED_UP';
ALTER TYPE "OrderStatus" ADD VALUE 'SAMPLE_IN_TRANSIT';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "fulfillmentMode" "FulfillmentType" NOT NULL DEFAULT 'AT_HOME_PHLEBOTOMIST';

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "fulfillmentType" "FulfillmentType" NOT NULL DEFAULT 'AT_HOME_PHLEBOTOMIST',
ADD COLUMN     "kitShippingFee" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Delhi',
    "pincode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "pickupLocationName" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "labId" TEXT,
    "leg" "ShipmentLeg" NOT NULL,
    "courier" "ShipmentCourier" NOT NULL DEFAULT 'DELHIVERY',
    "status" "ShipmentStatus" NOT NULL DEFAULT 'CREATED',
    "awb" TEXT,
    "refNumber" TEXT NOT NULL,
    "pickupRequestId" TEXT,
    "pickupName" TEXT NOT NULL,
    "pickupPhone" TEXT NOT NULL,
    "pickupLine" TEXT NOT NULL,
    "pickupCity" TEXT NOT NULL,
    "pickupPincode" TEXT NOT NULL,
    "dropName" TEXT NOT NULL,
    "dropPhone" TEXT NOT NULL,
    "dropLine" TEXT NOT NULL,
    "dropCity" TEXT NOT NULL,
    "dropPincode" TEXT NOT NULL,
    "weightGrams" INTEGER NOT NULL DEFAULT 300,
    "declaredValue" INTEGER NOT NULL DEFAULT 0,
    "paymentMode" TEXT NOT NULL DEFAULT 'Prepaid',
    "expectedAt" TIMESTAMP(3),
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "trackingPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentEvent" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "label" TEXT NOT NULL,
    "location" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw" JSONB,

    CONSTRAINT "ShipmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lab_slug_key" ON "Lab"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_pickupLocationName_key" ON "Lab"("pickupLocationName");

-- CreateIndex
CREATE INDEX "Lab_active_idx" ON "Lab"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_awb_key" ON "Shipment"("awb");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_refNumber_key" ON "Shipment"("refNumber");

-- CreateIndex
CREATE INDEX "Shipment_orderId_idx" ON "Shipment"("orderId");

-- CreateIndex
CREATE INDEX "Shipment_labId_idx" ON "Shipment"("labId");

-- CreateIndex
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");

-- CreateIndex
CREATE INDEX "Shipment_leg_idx" ON "Shipment"("leg");

-- CreateIndex
CREATE INDEX "Shipment_awb_idx" ON "Shipment"("awb");

-- CreateIndex
CREATE INDEX "ShipmentEvent_shipmentId_idx" ON "ShipmentEvent"("shipmentId");

-- CreateIndex
CREATE INDEX "ShipmentEvent_occurredAt_idx" ON "ShipmentEvent"("occurredAt");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentEvent" ADD CONSTRAINT "ShipmentEvent_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

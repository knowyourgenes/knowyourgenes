-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "attrCampaign" TEXT,
ADD COLUMN     "attrContent" TEXT,
ADD COLUMN     "attrFirstSeenAt" TIMESTAMP(3),
ADD COLUMN     "attrLandingPath" TEXT,
ADD COLUMN     "attrMedium" TEXT,
ADD COLUMN     "attrPayload" JSONB,
ADD COLUMN     "attrReferrer" TEXT,
ADD COLUMN     "attrSource" TEXT,
ADD COLUMN     "attrTerm" TEXT,
ADD COLUMN     "campaignId" TEXT;

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "term" TEXT,
    "content" TEXT,
    "destination" TEXT NOT NULL DEFAULT '/',
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");

-- CreateIndex
CREATE INDEX "Campaign_active_idx" ON "Campaign"("active");

-- CreateIndex
CREATE INDEX "Campaign_source_idx" ON "Campaign"("source");

-- CreateIndex
CREATE INDEX "Campaign_source_medium_idx" ON "Campaign"("source", "medium");

-- CreateIndex
CREATE INDEX "Order_campaignId_idx" ON "Order"("campaignId");

-- CreateIndex
CREATE INDEX "Order_attrSource_attrMedium_idx" ON "Order"("attrSource", "attrMedium");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

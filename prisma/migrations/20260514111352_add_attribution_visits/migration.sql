-- CreateTable
CREATE TABLE "AttributionVisit" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "userId" TEXT,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "term" TEXT,
    "content" TEXT,
    "referrer" TEXT,
    "landingPath" TEXT,
    "userAgent" TEXT,
    "ipPrefix" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttributionVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttributionVisit_source_medium_idx" ON "AttributionVisit"("source", "medium");

-- CreateIndex
CREATE INDEX "AttributionVisit_campaign_idx" ON "AttributionVisit"("campaign");

-- CreateIndex
CREATE INDEX "AttributionVisit_createdAt_idx" ON "AttributionVisit"("createdAt");

-- CreateIndex
CREATE INDEX "AttributionVisit_sessionId_idx" ON "AttributionVisit"("sessionId");

-- CreateIndex
CREATE INDEX "AttributionVisit_userId_idx" ON "AttributionVisit"("userId");

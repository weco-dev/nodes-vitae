-- CreateTable
CREATE TABLE "DemoSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "currentPageIndex" INTEGER NOT NULL DEFAULT 0,
    "surveyData" TEXT NOT NULL DEFAULT '{}',
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL DEFAULT '1.0'
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoSession_sessionId_key" ON "DemoSession"("sessionId");

-- CreateIndex
CREATE INDEX "DemoSession_sessionId_idx" ON "DemoSession"("sessionId");

-- CreateIndex
CREATE INDEX "DemoSession_completedAt_idx" ON "DemoSession"("completedAt");

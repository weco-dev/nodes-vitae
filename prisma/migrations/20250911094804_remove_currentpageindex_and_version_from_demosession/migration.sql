/*
  Warnings:

  - You are about to drop the column `currentPageIndex` on the `DemoSession` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `DemoSession` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DemoSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "surveyData" TEXT NOT NULL DEFAULT '{}',
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_DemoSession" ("completedAt", "id", "isCompleted", "sessionId", "startTime", "surveyData") SELECT "completedAt", "id", "isCompleted", "sessionId", "startTime", "surveyData" FROM "DemoSession";
DROP TABLE "DemoSession";
ALTER TABLE "new_DemoSession" RENAME TO "DemoSession";
CREATE UNIQUE INDEX "DemoSession_sessionId_key" ON "DemoSession"("sessionId");
CREATE INDEX "DemoSession_sessionId_idx" ON "DemoSession"("sessionId");
CREATE INDEX "DemoSession_completedAt_idx" ON "DemoSession"("completedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

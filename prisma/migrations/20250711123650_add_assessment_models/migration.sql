-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "currentPageIndex" INTEGER NOT NULL DEFAULT 0,
    "surveyData" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionName" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssessmentAnswer_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Assessment_userId_idx" ON "Assessment"("userId");

-- CreateIndex
CREATE INDEX "Assessment_userId_status_idx" ON "Assessment"("userId", "status");

-- CreateIndex
CREATE INDEX "AssessmentAnswer_assessmentId_idx" ON "AssessmentAnswer"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentAnswer_assessmentId_questionId_idx" ON "AssessmentAnswer"("assessmentId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentAnswer_assessmentId_questionId_key" ON "AssessmentAnswer"("assessmentId", "questionId");

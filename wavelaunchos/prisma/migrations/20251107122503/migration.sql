/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "careerMilestones" TEXT,
    "careerTurningPoints" TEXT,
    "ventureVision" TEXT,
    "ventureGoals" TEXT,
    "industryFocus" TEXT,
    "targetAudience" TEXT,
    "audienceDemographics" TEXT,
    "audiencePainPoints" TEXT,
    "audienceAge" TEXT,
    "differentiation" TEXT,
    "uniqueValue" TEXT,
    "competitors" TEXT,
    "brandImage" TEXT,
    "admiredInfluencers" TEXT,
    "brandAesthetics" TEXT,
    "brandEmotions" TEXT,
    "brandPersonality" TEXT,
    "brandFontPreference" TEXT,
    "scalingGoals" TEXT,
    "growthStrategies" TEXT,
    "longTermVision" TEXT,
    "additionalInfo" TEXT,
    "keyDeadlines" TEXT,
    "discoveryChannels" TEXT,
    "audienceGender" TEXT,
    "audienceMaritalStatus" TEXT,
    "brandValues" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Application" ("additionalInfo", "admiredInfluencers", "audienceAge", "audienceDemographics", "audienceGender", "audienceMaritalStatus", "audiencePainPoints", "brandAesthetics", "brandEmotions", "brandFontPreference", "brandImage", "brandPersonality", "brandValues", "careerMilestones", "careerTurningPoints", "competitors", "differentiation", "discoveryChannels", "email", "fullName", "growthStrategies", "id", "industryFocus", "keyDeadlines", "longTermVision", "scalingGoals", "submittedAt", "targetAudience", "timestamp", "uniqueValue", "ventureGoals", "ventureVision") SELECT "additionalInfo", "admiredInfluencers", "audienceAge", "audienceDemographics", "audienceGender", "audienceMaritalStatus", "audiencePainPoints", "brandAesthetics", "brandEmotions", "brandFontPreference", "brandImage", "brandPersonality", "brandValues", "careerMilestones", "careerTurningPoints", "competitors", "differentiation", "discoveryChannels", "email", "fullName", "growthStrategies", "id", "industryFocus", "keyDeadlines", "longTermVision", "scalingGoals", "submittedAt", "targetAudience", "timestamp", "uniqueValue", "ventureGoals", "ventureVision" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_email_idx" ON "Application"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Client_email_key" ON "Client"("email");

-- RedefineIndex
CREATE UNIQUE INDEX IF NOT EXISTS "DashboardMetric_label_key" ON "DashboardMetric"("label");

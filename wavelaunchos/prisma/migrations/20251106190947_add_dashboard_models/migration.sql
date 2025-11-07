/*
  Warnings:

  - Added the required column `sectionType` to the `Deliverable` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "DashboardMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "delta" TEXT NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "subheading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DashboardMetric_label_key" UNIQUE ("label")
);

-- CreateTable
CREATE TABLE "VisitorMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "desktop" INTEGER NOT NULL,
    "mobile" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deliverable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "sectionType" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "pdfPath" TEXT,
    "rejectionReason" TEXT,
    "generatedById" TEXT,
    "reviewerId" TEXT,
    "target" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Deliverable_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Deliverable_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Deliverable_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Deliverable" (
    "id",
    "clientId",
    "month",
    "title",
    "status",
    "sectionType",
    "contentHtml",
    "contentMarkdown",
    "pdfPath",
    "rejectionReason",
    "generatedById",
    "reviewerId",
    "target",
    "createdAt",
    "updatedAt"
) SELECT
    "id",
    "clientId",
    "month",
    "title",
    "status",
    'Narrative',
    "contentHtml",
    "contentMarkdown",
    "pdfPath",
    "rejectionReason",
    "generatedById",
    NULL,
    NULL,
    "createdAt",
    "updatedAt"
FROM "Deliverable";
DROP TABLE "Deliverable";
ALTER TABLE "new_Deliverable" RENAME TO "Deliverable";
CREATE UNIQUE INDEX "Deliverable_clientId_month_title_key" ON "Deliverable"("clientId", "month", "title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VisitorMetric_date_key" ON "VisitorMetric"("date");

import "dotenv/config";
import bcrypt from "bcryptjs";

import {
  ActivityType,
  ClientStatus,
  DeliverableStatus,
  PlanStatus,
  PrismaClient,
  UserRole,
} from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@wavelaunchos.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
const CLIENT_EMAIL = process.env.CLIENT_EMAIL ?? "client@wavelaunchos.com";
const CLIENT_PASSWORD = process.env.CLIENT_PASSWORD ?? "ChangeMe123!";

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      name: "WaveLaunch Admin",
    },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      role: UserRole.ADMIN,
      name: "WaveLaunch Admin",
    },
  });

  console.info(`Admin user ensured (${ADMIN_EMAIL}).`);
  return admin.id;
}

async function seedClientUser() {
  const passwordHash = await bcrypt.hash(CLIENT_PASSWORD, 12);

  const clientUser = await prisma.user.upsert({
    where: { email: CLIENT_EMAIL },
    update: {
      passwordHash,
      role: UserRole.CLIENT,
      name: "WaveLaunch Client",
    },
    create: {
      email: CLIENT_EMAIL,
      passwordHash,
      role: UserRole.CLIENT,
      name: "WaveLaunch Client",
    },
  });

  console.info(`Client user ensured (${CLIENT_EMAIL}).`);
  return clientUser.id;
}

async function seedClients(adminId: string, clientUserId: string) {
  const acme = await prisma.client.upsert({
    where: { email: CLIENT_EMAIL },
    update: {},
    create: {
      creatorName: "Eddie Lake",
      brandName: "Acme Studios",
      email: CLIENT_EMAIL,
      status: ClientStatus.ACTIVE,
      niche: "Creative Studio",
      goals: "Increase client retention and scale retainer engagements.",
      onboardedAt: new Date(),
      socialHandles: {
        instagram: "@acmestudios",
        youtube: "acme-studios",
      },
    },
  });

  const blueHarbor = await prisma.client.upsert({
    where: { email: "ops@blueharbor.ai" },
    update: {},
    create: {
      creatorName: "Alicia Barr",
      brandName: "Blue Harbor AI",
      email: "ops@blueharbor.ai",
      status: ClientStatus.ACTIVE,
      niche: "AI SaaS",
      goals: "Launch new GTM playbook and increase ARR.",
    },
  });

  const deliverableData = [
    {
      clientId: acme.id,
      month: 10,
      title: "Cover page",
      sectionType: "Overview",
      status: DeliverableStatus.PENDING_REVIEW,
      target: 18,
      reviewerEmail: "eddie@wavelaunchos.com",
    },
    {
      clientId: acme.id,
      month: 10,
      title: "Table of contents",
      sectionType: "Narrative",
      status: DeliverableStatus.DELIVERED,
      target: 29,
      reviewerEmail: "alicia@wavelaunchos.com",
    },
    {
      clientId: blueHarbor.id,
      month: 10,
      title: "Executive summary",
      sectionType: "Narrative",
      status: DeliverableStatus.DELIVERED,
      target: 13,
      reviewerEmail: "eddie@wavelaunchos.com",
    },
    {
      clientId: blueHarbor.id,
      month: 10,
      title: "Financial projections",
      sectionType: "Analysis",
      status: DeliverableStatus.PENDING_REVIEW,
      target: 8,
      reviewerEmail: "inez@wavelaunchos.com",
    },
    {
      clientId: acme.id,
      month: 11,
      title: "Ad copy refresh",
      sectionType: "Marketing",
      status: DeliverableStatus.REVISION_REQUESTED,
      target: 6,
      reviewerEmail: "eddie@wavelaunchos.com",
    },
  ];

  const reviewerMap = new Map<string, string>();
  reviewerMap.set(ADMIN_EMAIL, adminId);

  for (const deliverable of deliverableData) {
    const { reviewerEmail } = deliverable;

    if (!reviewerMap.has(reviewerEmail)) {
      const reviewer = await prisma.user.upsert({
        where: { email: reviewerEmail },
        update: {},
        create: {
          email: reviewerEmail,
          name: reviewerEmail.split("@")[0].replace(/\./g, " "),
          passwordHash: await bcrypt.hash("ChangeMe123!", 12),
          role: UserRole.ADMIN,
        },
      });
      reviewerMap.set(reviewerEmail, reviewer.id);
    }

    await prisma.deliverable.upsert({
      where: { clientId_month_title: { clientId: deliverable.clientId, month: deliverable.month, title: deliverable.title } },
      update: {
        status: deliverable.status,
        sectionType: deliverable.sectionType,
        target: deliverable.target,
        reviewerId: reviewerMap.get(reviewerEmail),
        contentHtml: "<p>Live deliverable content in HTML.</p>",
        contentMarkdown: "Live deliverable content in Markdown.",
      },
      create: {
        clientId: deliverable.clientId,
        month: deliverable.month,
        title: deliverable.title,
        status: deliverable.status,
        sectionType: deliverable.sectionType,
        target: deliverable.target,
        reviewerId: reviewerMap.get(reviewerEmail),
        generatedById: adminId,
        contentHtml: "<p>Live deliverable content in HTML.</p>",
        contentMarkdown: "Live deliverable content in Markdown.",
      },
    });
  }

  const existingPlan = await prisma.businessPlan.findFirst({
    where: { clientId: acme.id, version: 1 },
  });

  if (!existingPlan) {
    await prisma.businessPlan.create({
      data: {
        clientId: acme.id,
        version: 1,
        status: PlanStatus.DELIVERED,
        contentHtml: "<h1>Acme Growth Blueprint</h1><p>This plan outlines the next-quarter GTM strategy.</p>",
        contentMarkdown: "# Acme Growth Blueprint\n\nThis plan outlines the next-quarter GTM strategy.",
        generatedById: adminId,
        approvedAt: new Date(),
      },
    });
  }

  await prisma.note.upsert({
    where: { id: "seed-acme-note" },
    update: {
      content: "Discuss paid media experiments during next sync.",
    },
    create: {
      id: "seed-acme-note",
      clientId: acme.id,
      authorId: adminId,
      content: "Discuss paid media experiments during next sync.",
      isImportant: true,
    },
  });

  await prisma.activity.upsert({
    where: { id: "seed-activity-acme-created" },
    update: {
      description: "Client Acme Studios onboarded via seed script.",
      metadata: { userId: adminId, seeded: true },
    },
    create: {
      id: "seed-activity-acme-created",
      clientId: acme.id,
      type: ActivityType.CLIENT_CREATED,
      description: "Client Acme Studios onboarded via seed script.",
      metadata: { userId: adminId, seeded: true },
    },
  });

  if (clientUserId) {
    await prisma.activity.upsert({
      where: { id: "seed-activity-acme-portal" },
      update: {
        description: "Client portal access provisioned for seeded client user.",
        metadata: { userId: clientUserId, seeded: true },
      },
      create: {
        id: "seed-activity-acme-portal",
        clientId: acme.id,
        type: ActivityType.CLIENT_UPDATED,
        description: "Client portal access provisioned for seeded client user.",
        metadata: { userId: clientUserId, seeded: true },
      },
    });
  }

  console.info("Clients, deliverables, and supporting records seeded.");
}

async function seedDashboardMetrics() {
  const metrics = [
    {
      label: "Total Revenue",
      value: "$1,250.00",
      delta: "+12.5%",
      isPositive: true,
      subheading: "Trending up this month",
      description: "Visitors for the last 6 months",
      order: 0,
    },
    {
      label: "New Customers",
      value: "1,234",
      delta: "-20%",
      isPositive: false,
      subheading: "Down 20% this period",
      description: "Acquisition needs attention",
      order: 1,
    },
    {
      label: "Active Accounts",
      value: "45,678",
      delta: "+13.5%",
      isPositive: true,
      subheading: "Strong user retention",
      description: "Engagement exceeds targets",
      order: 2,
    },
    {
      label: "Growth Rate",
      value: "4.5%",
      delta: "+4.5%",
      isPositive: true,
      subheading: "Steady performance",
      description: "Meets growth projections",
      order: 3,
    },
  ];

  await Promise.all(
    metrics.map((metric) =>
      prisma.dashboardMetric.upsert({
        where: { label: metric.label },
        update: metric,
        create: metric,
      })
    )
  );

  console.info("Dashboard metrics seeded.");
}

async function seedVisitorMetrics() {
  const baseDate = new Date("2024-06-30T00:00:00Z");
  const dataPoints: { date: Date; desktop: number; mobile: number }[] = [];

  for (let i = 0; i < 90; i += 1) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - i);
    dataPoints.push({
      date,
      desktop: Math.floor(150 + Math.sin(i / 5) * 120 + Math.random() * 80),
      mobile: Math.floor(120 + Math.cos(i / 6) * 100 + Math.random() * 60),
    });
  }

  await Promise.all(
    dataPoints.map((point) =>
      prisma.visitorMetric.upsert({
        where: { date: point.date },
        update: point,
        create: point,
      })
    )
  );

  console.info("Visitor metrics seeded.");
}

async function main() {
  const adminId = await seedAdmin();
  const clientUserId = await seedClientUser();
  await seedClients(adminId, clientUserId);
  await seedDashboardMetrics();
  await seedVisitorMetrics();
}

main()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

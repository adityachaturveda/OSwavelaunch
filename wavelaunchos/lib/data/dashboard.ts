import { prisma } from "@/lib/db/client";

export type DashboardMetricRecord = {
  id: string;
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
  subheading: string;
  description: string;
  order: number;
};

export type VisitorMetricPoint = {
  date: string;
  desktop: number;
  mobile: number;
};

export type DeliverableSummary = {
  id: string;
  title: string;
  sectionType: string;
  status: string;
  target: number | null;
  reviewer: string | null;
};

const FALLBACK_METRICS: DashboardMetricRecord[] = [
  {
    id: "revenue",
    label: "Monthly revenue",
    value: "$24,500",
    delta: "+12.1%",
    isPositive: true,
    subheading: "Compared to last month",
    description: "Track revenue performance across all client workspaces.",
    order: 1,
  },
  {
    id: "clients",
    label: "Active clients",
    value: "18",
    delta: "+3",
    isPositive: true,
    subheading: "Teams onboarding in the last 30 days",
    description: "Clients who logged in at least once this week.",
    order: 2,
  },
  {
    id: "nps",
    label: "Client NPS",
    value: "63",
    delta: "+5",
    isPositive: true,
    subheading: "Survey responses",
    description: "Client sentiment from the latest feedback round.",
    order: 3,
  },
];

const FALLBACK_VISITORS: VisitorMetricPoint[] = Array.from({ length: 7 }).map((_, index) => ({
  date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toISOString(),
  desktop: 320 + index * 15,
  mobile: 210 + index * 12,
}));

const FALLBACK_DELIVERABLES: DeliverableSummary[] = [
  {
    id: "deliv-1",
    title: "Launch playbook refresh",
    sectionType: "Strategy",
    status: "IN_PROGRESS",
    target: 90,
    reviewer: "Taylor Reed",
  },
  {
    id: "deliv-2",
    title: "Weekly social calendar",
    sectionType: "Content",
    status: "REVIEW",
    target: 12,
    reviewer: "Jordan Lee",
  },
  {
    id: "deliv-3",
    title: "Investor update deck",
    sectionType: "Operations",
    status: "COMPLETE",
    target: null,
    reviewer: "Sam Patel",
  },
];

function isPrismaInitializationError(error: unknown) {
  return error instanceof Error && error.name === "PrismaClientInitializationError";
}

export async function getDashboardMetrics(): Promise<DashboardMetricRecord[]> {
  try {
    const metrics = await prisma.dashboardMetric.findMany({
      orderBy: { order: "asc" },
    });

    if (!metrics.length) {
      return FALLBACK_METRICS;
    }

    return metrics.map((metric): DashboardMetricRecord => ({
      id: metric.id,
      label: metric.label,
      value: metric.value,
      delta: metric.delta,
      isPositive: metric.isPositive,
      subheading: metric.subheading,
      description: metric.description,
      order: metric.order,
    }));
  } catch (error) {
    if (isPrismaInitializationError(error)) {
      console.warn("Prisma unavailable, serving fallback dashboard metrics.", error);
      return FALLBACK_METRICS;
    }

    throw error;
  }
}

export async function getVisitorMetrics(): Promise<VisitorMetricPoint[]> {
  try {
    const metrics = await prisma.visitorMetric.findMany({
      orderBy: { date: "asc" },
    });

    if (!metrics.length) {
      return FALLBACK_VISITORS;
    }

    return metrics.map((metric) => ({
      date: metric.date.toISOString(),
      desktop: metric.desktop,
      mobile: metric.mobile,
    }));
  } catch (error) {
    if (isPrismaInitializationError(error)) {
      console.warn("Prisma unavailable, serving fallback visitor metrics.", error);
      return FALLBACK_VISITORS;
    }

    throw error;
  }
}

export async function getRecentDeliverables(limit = 6): Promise<DeliverableSummary[]> {
  try {
    const deliverables = await prisma.deliverable.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        reviewer: {
          select: { name: true, email: true },
        },
      },
    });

    if (!deliverables.length) {
      return FALLBACK_DELIVERABLES.slice(0, limit);
    }

    return deliverables.map((deliverable): DeliverableSummary => ({
      id: deliverable.id,
      title: deliverable.title,
      sectionType: deliverable.sectionType,
      status: deliverable.status,
      target: deliverable.target,
      reviewer: deliverable.reviewer?.name ?? deliverable.reviewer?.email ?? null,
    }));
  } catch (error) {
    if (isPrismaInitializationError(error)) {
      console.warn("Prisma unavailable, serving fallback deliverables.", error);
      return FALLBACK_DELIVERABLES.slice(0, limit);
    }

    throw error;
  }
}

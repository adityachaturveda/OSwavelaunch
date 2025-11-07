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

export async function getDashboardMetrics(): Promise<DashboardMetricRecord[]> {
  const metrics = await prisma.dashboardMetric.findMany({
    orderBy: { order: "asc" },
  });

  return metrics.map((metric) => ({
    id: metric.id,
    label: metric.label,
    value: metric.value,
    delta: metric.delta,
    isPositive: metric.isPositive,
    subheading: metric.subheading,
    description: metric.description,
    order: metric.order,
  }));
}

export async function getVisitorMetrics(): Promise<VisitorMetricPoint[]> {
  const metrics = await prisma.visitorMetric.findMany({
    orderBy: { date: "asc" },
  });

  return metrics.map((metric) => ({
    date: metric.date.toISOString(),
    desktop: metric.desktop,
    mobile: metric.mobile,
  }));
}

export async function getRecentDeliverables(limit = 6): Promise<DeliverableSummary[]> {
  const deliverables = await prisma.deliverable.findMany({
    take: limit,
    orderBy: { updatedAt: "desc" },
    include: {
      reviewer: {
        select: { name: true, email: true },
      },
    },
  });

  return deliverables.map((deliverable) => ({
    id: deliverable.id,
    title: deliverable.title,
    sectionType: deliverable.sectionType,
    status: deliverable.status,
    target: deliverable.target,
    reviewer: deliverable.reviewer?.name ?? deliverable.reviewer?.email ?? null,
  }));
}

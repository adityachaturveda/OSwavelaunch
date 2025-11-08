import { ClientStatus } from "@prisma/client";
import { prisma } from "../db/client";
import type { ClientStatusValue } from "../constants/client";

type ClientListItem = {
  id: string;
  name: string;
  creatorName: string | null;
  brand: string;
  status: ClientStatusValue;
  email: string;
  niche: string | null;
  projects: number;
  totalDeliverables: number;
  totalBusinessPlans: number;
  totalFiles: number;
  lastContact: string;
  lastContactDate: string | null;
  createdAt: Date;
  socialHandles: Record<string, unknown> | null;
};

const FALLBACK_CLIENTS: ClientListItem[] = [
  {
    id: "client-1",
    name: "Nimbus Labs",
    creatorName: "Cassidy James",
    brand: "Nimbus Labs",
    status: "ACTIVE",
    email: "hello@nimbuslabs.com",
    niche: "AI Automation",
    projects: 8,
    totalDeliverables: 12,
    totalBusinessPlans: 4,
    totalFiles: 37,
    lastContact: "3 days ago",
    lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    socialHandles: {
      twitter: "@nimbuslabs",
    },
  },
  {
    id: "client-2",
    name: "Aurora Atelier",
    creatorName: "Monica Rivers",
    brand: "Aurora Atelier",
    status: "INACTIVE",
    email: "hello@auroraatelier.com",
    niche: "Design & Branding",
    projects: 5,
    totalDeliverables: 7,
    totalBusinessPlans: 2,
    totalFiles: 18,
    lastContact: "2 weeks ago",
    lastContactDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    socialHandles: null,
  },
  {
    id: "client-3",
    name: "Horizon Athletics",
    creatorName: "Devon Brooks",
    brand: "Horizon Athletics",
    status: "ACTIVE",
    email: "devon@horizonathletics.com",
    niche: "Fitness & Wellness",
    projects: 6,
    totalDeliverables: 9,
    totalBusinessPlans: 3,
    totalFiles: 24,
    lastContact: "5 hours ago",
    lastContactDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    socialHandles: {
      instagram: "@horizonathletics",
    },
  },
];

const FALLBACK_STATS = {
  total: FALLBACK_CLIENTS.length,
  active: FALLBACK_CLIENTS.filter((client) => client.status === "ACTIVE").length,
  inactive: FALLBACK_CLIENTS.filter((client) => client.status === "INACTIVE").length,
};

function isPrismaInitializationError(error: unknown) {
  return error instanceof Error && error.name === "PrismaClientInitializationError";
}

/**
 * Get all clients for display in the clients list
 * Server-side only
 */
export async function getClientsForList(): Promise<ClientListItem[]> {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            deliverables: true,
            businessPlans: true,
            files: true,
          },
        },
        activities: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            createdAt: true,
          },
        },
      },
    });

    if (!clients.length) {
      return FALLBACK_CLIENTS;
    }

    return clients.map((client): ClientListItem => ({
      id: client.id,
      name: client.brandName,
      creatorName: client.creatorName,
      brand: client.brandName,
      status: client.status as ClientStatusValue,
      email: client.email,
      niche: client.niche,
      projects: client._count.deliverables + client._count.businessPlans,
      totalDeliverables: client._count.deliverables,
      totalBusinessPlans: client._count.businessPlans,
      totalFiles: client._count.files,
      lastContact: client.activities[0]?.createdAt
        ? getRelativeTime(client.activities[0].createdAt)
        : "Never",
      lastContactDate: client.activities[0]?.createdAt
        ? client.activities[0]?.createdAt.toISOString()
        : null,
      createdAt: client.createdAt,
      socialHandles: client.socialHandles as Record<string, unknown> | null,
    }));
  } catch (error) {
    if (isPrismaInitializationError(error)) {
      console.warn("Prisma unavailable, serving fallback client list.", error);
      return FALLBACK_CLIENTS;
    }

    throw error;
  }
}

/**
 * Get client statistics
 */
export async function getClientStatistics() {
  try {
    const [total, active, inactive] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: ClientStatus.ACTIVE } }),
      prisma.client.count({ where: { status: ClientStatus.INACTIVE } }),
    ]);

    return {
      total,
      active,
      inactive,
      capacityUsed: (active / 100) * 100,
      capacityRemaining: 100 - active,
    };
  } catch (error) {
    if (isPrismaInitializationError(error)) {
      console.warn("Prisma unavailable, serving fallback client statistics.", error);
      const { total, active, inactive } = FALLBACK_STATS;

      return {
        total,
        active,
        inactive,
        capacityUsed: (active / 100) * 100,
        capacityRemaining: 100 - active,
      };
    }

    throw error;
  }
}

/**
 * Helper function to get relative time string
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;

  return date.toLocaleDateString();
}

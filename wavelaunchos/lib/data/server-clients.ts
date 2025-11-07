import { ClientStatus } from "../generated/prisma/client";
import { prisma } from "../db/client";

/**
 * Get all clients for display in the clients list
 * Server-side only
 */
export async function getClientsForList() {
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

  return clients.map((client) => ({
    id: client.id,
    name: client.brandName,
    creatorName: client.creatorName,
    brand: client.brandName,
    status: client.status,
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
    socialHandles: client.socialHandles as any,
  }));
}

/**
 * Get client statistics
 */
export async function getClientStatistics() {
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

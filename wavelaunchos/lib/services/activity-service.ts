import { Prisma } from "../generated/prisma/client";
import { prisma } from "../db/client";
import { ApiError } from "../api/error-handler";
import type { CreateActivityInput, ActivityQuery } from "../validations/activity";

/**
 * Create a new activity log
 */
export async function createActivity(data: CreateActivityInput) {
  // Verify client exists
  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });

  if (!client) {
    throw new ApiError("Client not found", 404, "NOT_FOUND");
  }

  const activity = await prisma.activity.create({
    data,
  });

  return activity;
}

/**
 * Get activities with filtering and pagination
 */
export async function getActivities(query: ActivityQuery) {
  const { clientId, type, page, limit, startDate, endDate } = query;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.ActivityWhereInput = {
    ...(clientId && { clientId }),
    ...(type && { type }),
    ...(startDate || endDate ? {
      createdAt: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      },
    } : {}),
  };

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            id: true,
            brandName: true,
            creatorName: true,
          },
        },
      },
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    data: activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + activities.length < total,
    },
  };
}

/**
 * Get recent activities for a client
 */
export async function getRecentActivities(clientId: string, limit: number = 10) {
  const activities = await prisma.activity.findMany({
    where: { clientId },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return activities;
}

/**
 * Delete activities older than a specified date
 */
export async function deleteOldActivities(beforeDate: Date) {
  const result = await prisma.activity.deleteMany({
    where: {
      createdAt: {
        lt: beforeDate,
      },
    },
  });

  return { deleted: result.count };
}

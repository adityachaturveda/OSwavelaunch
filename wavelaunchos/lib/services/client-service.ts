import { Prisma, ClientStatus, ActivityType } from "../generated/prisma/client";
import { prisma } from "../db/client";
import { ApiError } from "../api/error-handler";
import type { CreateClientInput, UpdateClientInput, ClientQuery } from "../validations/client";

/**
 * Maximum number of clients allowed
 */
const MAX_CLIENTS = 100;

/**
 * Create a new client
 */
export async function createClient(
  data: CreateClientInput,
  userId: string
) {
  // Check capacity limit
  const clientCount = await prisma.client.count({
    where: { status: ClientStatus.ACTIVE },
  });

  if (clientCount >= MAX_CLIENTS) {
    throw new ApiError(
      `Maximum client capacity (${MAX_CLIENTS}) reached. Please deactivate existing clients before adding new ones.`,
      400,
      "CAPACITY_EXCEEDED"
    );
  }

  // Check for duplicate email
  const existingClient = await prisma.client.findUnique({
    where: { email: data.email },
  });

  if (existingClient) {
    throw new ApiError(
      "A client with this email already exists",
      409,
      "DUPLICATE_EMAIL"
    );
  }

  // Create client and activity in a transaction
  const client = await prisma.$transaction(async (tx) => {
    const newClient = await tx.client.create({
      data: {
        ...data,
        socialHandles: data.socialHandles || {},
        onboardedAt: new Date(),
      },
    });

    // Log activity
    await tx.activity.create({
      data: {
        clientId: newClient.id,
        type: ActivityType.CLIENT_CREATED,
        description: `Client ${newClient.brandName} created`,
        metadata: { userId },
      },
    });

    return newClient;
  });

  return client;
}

/**
 * Get a client by ID
 */
export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      businessPlans: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      deliverables: {
        orderBy: { month: "asc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      notes: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      files: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          uploadedBy: {
            select: {
              name: true,
            },
          },
        },
      },
      kpis: {
        orderBy: { date: "desc" },
        take: 12,
      },
      _count: {
        select: {
          files: true,
          notes: true,
          chatThreads: true,
        },
      },
    },
  });

  if (!client) {
    throw new ApiError("Client not found", 404, "NOT_FOUND");
  }

  return client;
}

/**
 * Get all clients with pagination, search, and filtering
 */
export async function getClients(query: ClientQuery) {
  const { page, limit, search, status, sortBy, sortOrder } = query;

  const normalizedStatus = status ? (status as ClientStatus) : undefined;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.ClientWhereInput = {
    ...(normalizedStatus && { status: normalizedStatus }),
    ...(search && {
      OR: [
        { creatorName: { contains: search } },
        { brandName: { contains: search } },
        { email: { contains: search } },
        { niche: { contains: search } },
      ],
    }),
  };

  // Execute queries in parallel
  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: {
            businessPlans: true,
            deliverables: true,
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
    }),
    prisma.client.count({ where }),
  ]);

  return {
    data: clients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + clients.length < total,
    },
  };
}

/**
 * Update a client
 */
export async function updateClient(
  id: string,
  data: UpdateClientInput,
  userId: string
) {
  // Check if client exists
  const existingClient = await prisma.client.findUnique({
    where: { id },
  });

  if (!existingClient) {
    throw new ApiError("Client not found", 404, "NOT_FOUND");
  }

  // If email is being updated, check for duplicates
  if (data.email && data.email !== existingClient.email) {
    const duplicateEmail = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (duplicateEmail) {
      throw new ApiError(
        "A client with this email already exists",
        409,
        "DUPLICATE_EMAIL"
      );
    }
  }

  // Update client and log activity
  const client = await prisma.$transaction(async (tx) => {
    const updated = await tx.client.update({
      where: { id },
      data: {
        ...data,
        ...(data.socialHandles && { socialHandles: data.socialHandles }),
      },
    });

    // Log activity
    await tx.activity.create({
      data: {
        clientId: updated.id,
        type: ActivityType.CLIENT_UPDATED,
        description: `Client ${updated.brandName} updated`,
        metadata: { userId, changes: Object.keys(data) },
      },
    });

    return updated;
  });

  return client;
}

/**
 * Delete a client (soft delete by setting status to INACTIVE)
 */
export async function deleteClient(id: string, userId: string) {
  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) {
    throw new ApiError("Client not found", 404, "NOT_FOUND");
  }

  // Soft delete by setting status to INACTIVE
  const updated = await prisma.$transaction(async (tx) => {
    const deactivated = await tx.client.update({
      where: { id },
      data: { status: ClientStatus.INACTIVE },
    });

    // Log activity
    await tx.activity.create({
      data: {
        clientId: deactivated.id,
        type: ActivityType.CLIENT_UPDATED,
        description: `Client ${deactivated.brandName} deactivated`,
        metadata: { userId, action: "deactivate" },
      },
    });

    return deactivated;
  });

  return updated;
}

/**
 * Get client statistics
 */
export async function getClientStats() {
  const [
    totalClients,
    activeClients,
    inactiveClients,
    recentClients,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.client.count({ where: { status: ClientStatus.ACTIVE } }),
    prisma.client.count({ where: { status: ClientStatus.INACTIVE } }),
    prisma.client.findMany({
      where: { status: ClientStatus.ACTIVE },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        brandName: true,
        creatorName: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalClients,
    activeClients,
    inactiveClients,
    capacityRemaining: Math.max(0, MAX_CLIENTS - activeClients),
    capacityPercentage: (activeClients / MAX_CLIENTS) * 100,
    recentClients,
  };
}

/**
 * Check if email is available
 */
export async function isEmailAvailable(email: string, excludeClientId?: string): Promise<boolean> {
  const client = await prisma.client.findUnique({
    where: { email },
  });

  if (!client) {
    return true;
  }

  return excludeClientId ? client.id === excludeClientId : false;
}

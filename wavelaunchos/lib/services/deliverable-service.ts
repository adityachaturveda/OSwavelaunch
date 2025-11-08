import { prisma } from "@/lib/db/client";
import { ApiError } from "@/lib/api/error-handler";
import { DeliverableStatus } from "@prisma/client";

import type {
  CreateDeliverableInput,
  UpdateDeliverableInput,
} from "@/lib/validations/deliverable";

type DeliverableRecord = {
  id: string;
  clientId: string;
  title: string;
  sectionType: string;
  month: number;
  status: DeliverableStatus;
  target: number | null;
  reviewer: {
    id: string | null;
    name: string | null;
    email: string | null;
  } | null;
  generatedBy: {
    id: string | null;
    name: string | null;
    email: string | null;
  } | null;
  updatedAt: string;
  contentHtml?: string | null;
  contentMarkdown?: string | null;
};

let fallbackDeliverables: DeliverableRecord[] = [
  {
    id: "demo-deliverable-1",
    clientId: "acme",
    title: "Brand Strategy Deck",
    sectionType: "Strategy",
    month: 2,
    status: DeliverableStatus.IN_PROGRESS,
    target: 5,
    reviewer: {
      id: "reviewer-1",
      name: "Alex Kim",
      email: "alex.kim@example.com",
    },
    generatedBy: {
      id: "creator-1",
      name: "WaveLaunch Team",
      email: "team@wavelaunchos.com",
    },
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "demo-deliverable-2",
    clientId: "blue-harbor",
    title: "Pilot Rollout Checklist",
    sectionType: "Operations",
    month: 5,
    status: DeliverableStatus.PENDING,
    target: null,
    reviewer: {
      id: "reviewer-2",
      name: "Morgan Patel",
      email: "morgan.patel@example.com",
    },
    generatedBy: {
      id: "creator-2",
      name: "Operations Squad",
      email: "ops@wavelaunchos.com",
    },
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

function isPrismaInitializationError(error: unknown) {
  return error instanceof Error && error.name === "PrismaClientInitializationError";
}

type DeliverableQuery = {
  page: number;
  limit: number;
  status?: DeliverableStatus;
};

export async function listDeliverables(clientId: string, query: DeliverableQuery) {
  const { page, limit, status } = query;
  const skip = (page - 1) * limit;

  const where = {
    clientId,
    ...(status && { status }),
  } as const;

  try {
    const [deliverables, total] = await Promise.all([
      prisma.deliverable.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          generatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.deliverable.count({ where }),
    ]);

    return {
      data: deliverables,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + deliverables.length < total,
      },
    };
  } catch (error) {
    if (!isPrismaInitializationError(error)) {
      throw error;
    }

    const filtered = fallbackDeliverables.filter((deliverable) => {
      if (deliverable.clientId !== clientId) return false;
      if (status && deliverable.status !== status) return false;
      return true;
    });

    const total = filtered.length;
    const slice = filtered.slice(skip, skip + limit);

    return {
      data: slice,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasMore: skip + slice.length < total,
      },
    };
  }
}

export async function createDeliverable(
  input: CreateDeliverableInput,
  userId: string
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: input.clientId },
      select: { id: true },
    });

    if (!client) {
      throw new ApiError("Client not found", 404, "NOT_FOUND");
    }

    const deliverable = await prisma.deliverable.create({
      data: {
        clientId: input.clientId,
        title: input.title,
        sectionType: input.sectionType,
        month: input.month,
        status: input.status,
        target: input.target ?? null,
        reviewerId: input.reviewerId ?? null,
        generatedById: input.generatedById ?? userId,
        contentHtml: input.contentHtml,
        contentMarkdown: input.contentMarkdown,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return deliverable;
  } catch (error) {
    if (!isPrismaInitializationError(error)) {
      throw error;
    }

    const now = new Date();
    const deliverable: DeliverableRecord = {
      id: `demo-deliverable-${Date.now()}`,
      clientId: input.clientId,
      title: input.title,
      sectionType: input.sectionType,
      month: input.month,
      status: input.status,
      target: input.target ?? null,
      reviewer: {
        id: input.reviewerId ?? null,
        name: null,
        email: null,
      },
      generatedBy: {
        id: input.generatedById ?? userId,
        name: "WaveLaunch Team",
        email: "team@wavelaunchos.com",
      },
      updatedAt: now.toISOString(),
      contentHtml: input.contentHtml,
      contentMarkdown: input.contentMarkdown,
    };

    fallbackDeliverables = [deliverable, ...fallbackDeliverables];
    return deliverable;
  }
}

export async function updateDeliverable(
  id: string,
  data: UpdateDeliverableInput
) {
  try {
    const existing = await prisma.deliverable.findUnique({ where: { id } });

    if (!existing) {
      throw new ApiError("Deliverable not found", 404, "NOT_FOUND");
    }

    const updated = await prisma.deliverable.update({
      where: { id },
      data: {
        ...data,
        reviewerId: data.reviewerId ?? existing.reviewerId,
        target: data.target ?? existing.target,
        rejectionReason: data.rejectionReason ?? existing.rejectionReason,
        contentHtml: data.contentHtml ?? existing.contentHtml,
        contentMarkdown: data.contentMarkdown ?? existing.contentMarkdown,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updated;
  } catch (error) {
    if (!isPrismaInitializationError(error)) {
      throw error;
    }

    const index = fallbackDeliverables.findIndex((deliverable) => deliverable.id === id);

    if (index === -1) {
      throw new ApiError("Deliverable not found", 404, "NOT_FOUND");
    }

    const existing = fallbackDeliverables[index];
    const updated: DeliverableRecord = {
      ...existing,
      status: data.status ?? existing.status,
      target: data.target ?? existing.target,
      reviewer: existing.reviewer,
      generatedBy: existing.generatedBy,
      updatedAt: new Date().toISOString(),
      contentHtml: data.contentHtml ?? existing.contentHtml,
      contentMarkdown: data.contentMarkdown ?? existing.contentMarkdown,
    };

    fallbackDeliverables = [
      ...fallbackDeliverables.slice(0, index),
      updated,
      ...fallbackDeliverables.slice(index + 1),
    ];

    return updated;
  }
}

export async function deleteDeliverable(id: string) {
  try {
    const existing = await prisma.deliverable.findUnique({ where: { id } });

    if (!existing) {
      throw new ApiError("Deliverable not found", 404, "NOT_FOUND");
    }

    await prisma.deliverable.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    if (!isPrismaInitializationError(error)) {
      throw error;
    }

    const index = fallbackDeliverables.findIndex((deliverable) => deliverable.id === id);

    if (index === -1) {
      throw new ApiError("Deliverable not found", 404, "NOT_FOUND");
    }

    fallbackDeliverables = fallbackDeliverables.filter((deliverable) => deliverable.id !== id);

    return { success: true };
  }
}


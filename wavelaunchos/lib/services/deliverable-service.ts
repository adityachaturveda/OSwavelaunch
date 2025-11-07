import { prisma } from "@/lib/db/client";
import { ApiError } from "@/lib/api/error-handler";
import { DeliverableStatus } from "@/lib/generated/prisma/client";

import type {
  CreateDeliverableInput,
  UpdateDeliverableInput,
} from "@/lib/validations/deliverable";

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
}

export async function createDeliverable(
  input: CreateDeliverableInput,
  userId: string
) {
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
}

export async function updateDeliverable(
  id: string,
  data: UpdateDeliverableInput
) {
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
}

export async function deleteDeliverable(id: string) {
  const existing = await prisma.deliverable.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError("Deliverable not found", 404, "NOT_FOUND");
  }

  await prisma.deliverable.delete({ where: { id } });

  return { success: true };
}


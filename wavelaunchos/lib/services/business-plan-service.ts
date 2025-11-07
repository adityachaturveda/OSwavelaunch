import { prisma } from "@/lib/db/client";
import { ApiError } from "@/lib/api/error-handler";

import type {
  CreateBusinessPlanInput,
  UpdateBusinessPlanInput,
} from "@/lib/validations/business-plan";

type BusinessPlanQuery = {
  page: number;
  limit: number;
};

export async function listBusinessPlans(clientId: string, query: BusinessPlanQuery) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [plans, total] = await Promise.all([
    prisma.businessPlan.findMany({
      where: { clientId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.businessPlan.count({ where: { clientId } }),
  ]);

  return {
    data: plans,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + plans.length < total,
    },
  };
}

export async function createBusinessPlan(
  input: CreateBusinessPlanInput,
  userId: string
) {
  const client = await prisma.client.findUnique({
    where: { id: input.clientId },
    select: { id: true },
  });

  if (!client) {
    throw new ApiError("Client not found", 404, "NOT_FOUND");
  }

  const plan = await prisma.businessPlan.create({
    data: {
      clientId: input.clientId,
      version: input.version,
      status: input.status,
      contentHtml: input.contentHtml,
      contentMarkdown: input.contentMarkdown,
      generatedById: input.generatedById ?? userId,
      approvedAt: input.approvedAt ?? null,
    },
    include: {
      generatedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return plan;
}

export async function updateBusinessPlan(
  id: string,
  data: UpdateBusinessPlanInput
) {
  const existing = await prisma.businessPlan.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError("Business plan not found", 404, "NOT_FOUND");
  }

  const updated = await prisma.businessPlan.update({
    where: { id },
    data: {
      ...data,
      contentHtml: data.contentHtml ?? existing.contentHtml,
      contentMarkdown: data.contentMarkdown ?? existing.contentMarkdown,
    },
    include: {
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

export async function deleteBusinessPlan(id: string) {
  const existing = await prisma.businessPlan.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError("Business plan not found", 404, "NOT_FOUND");
  }

  await prisma.businessPlan.delete({ where: { id } });

  return { success: true };
}


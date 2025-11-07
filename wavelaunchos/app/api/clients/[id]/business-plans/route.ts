import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, successResponse, createdResponse } from "@/lib/api/error-handler";
import { createBusinessPlan, listBusinessPlans } from "@/lib/services/business-plan-service";
import { createBusinessPlanSchema } from "@/lib/validations/business-plan";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const GET = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = querySchema.parse({
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "10",
    });

    const result = await listBusinessPlans(params.id, query);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    const payload = createBusinessPlanSchema.parse({
      ...body,
      clientId: params.id,
      generatedById: session.user.id,
    });

    const plan = await createBusinessPlan(payload, session.user.id);
    return createdResponse(plan);
  } catch (error) {
    return handleApiError(error);
  }
});


import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, noContentResponse, successResponse } from "@/lib/api/error-handler";
import { deleteBusinessPlan, updateBusinessPlan } from "@/lib/services/business-plan-service";
import { updateBusinessPlanSchema } from "@/lib/validations/business-plan";

type RouteContext = {
  params: {
    id: string;
    planId: string;
  };
};

export const PATCH = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: RouteContext
) => {
  try {
    const payload = updateBusinessPlanSchema.parse(await req.json());
    const plan = await updateBusinessPlan(params.planId, payload);

    return successResponse(plan);
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: RouteContext
) => {
  try {
    await deleteBusinessPlan(params.planId);
    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});


import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, successResponse, createdResponse } from "@/lib/api/error-handler";
import { createActivity, getActivities } from "@/lib/services/activity-service";
import { activityQuerySchema, createActivitySchema } from "@/lib/validations/activity";

/**
 * GET /api/clients/[id]/activities
 * Get activities for a specific client
 */
export const GET = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = activityQuerySchema.parse({
      clientId: params.id,
      type: searchParams.get("type") ?? undefined,
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "20",
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined,
    });

    const result = await getActivities(query);

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
    const validated = createActivitySchema.parse({
      ...body,
      clientId: params.id,
    });

    const activity = await createActivity({
      ...validated,
      metadata: {
        ...(validated.metadata ?? {}),
        userId: session.user.id,
      },
    });

    return createdResponse(activity);
  } catch (error) {
    return handleApiError(error);
  }
});

import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, noContentResponse, successResponse } from "@/lib/api/error-handler";
import { deleteDeliverable, updateDeliverable } from "@/lib/services/deliverable-service";
import { updateDeliverableSchema } from "@/lib/validations/deliverable";

type RouteContext = {
  params: {
    id: string;
    deliverableId: string;
  };
};

export const PATCH = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: RouteContext
) => {
  try {
    const payload = updateDeliverableSchema.parse(await req.json());
    const deliverable = await updateDeliverable(params.deliverableId, payload);

    return successResponse(deliverable);
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
    await deleteDeliverable(params.deliverableId);
    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});


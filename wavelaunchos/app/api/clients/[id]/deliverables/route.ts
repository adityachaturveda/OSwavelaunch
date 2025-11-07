import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, successResponse, createdResponse } from "@/lib/api/error-handler";
import { DeliverableStatus } from "@/lib/generated/prisma/enums";
import { createDeliverable, listDeliverables } from "@/lib/services/deliverable-service";
import { createDeliverableSchema } from "@/lib/validations/deliverable";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: z.nativeEnum(DeliverableStatus).optional(),
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
      limit: searchParams.get("limit") ?? "20",
      status: searchParams.get("status") ?? undefined,
    });

    const result = await listDeliverables(params.id, query);
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
    const payload = createDeliverableSchema.parse({
      ...body,
      clientId: params.id,
      generatedById: session.user.id,
    });

    const deliverable = await createDeliverable(payload, session.user.id);

    return createdResponse(deliverable);
  } catch (error) {
    return handleApiError(error);
  }
});


import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, successResponse, noContentResponse } from "@/lib/api/error-handler";
import { updateClientSchema } from "@/lib/validations/client";
import { getClientById, updateClient, deleteClient } from "@/lib/services/client-service";

/**
 * GET /api/clients/[id]
 * Get a single client by ID with related data
 */
export const GET = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const client = await getClientById(params.id);
    return successResponse(client);
  } catch (error) {
    return handleApiError(error);
  }
});

/**
 * PATCH /api/clients/[id]
 * Update a client
 */
export const PATCH = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = updateClientSchema.parse(body);

    // Update client
    const client = await updateClient(params.id, validatedData, session.user.id);

    return successResponse(client);
  } catch (error) {
    return handleApiError(error);
  }
});

/**
 * DELETE /api/clients/[id]
 * Soft delete a client (set status to INACTIVE)
 */
export const DELETE = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    await deleteClient(params.id, session.user.id);
    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});

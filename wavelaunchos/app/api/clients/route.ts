import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, successResponse, createdResponse } from "@/lib/api/error-handler";
import { createClientSchema, clientQuerySchema } from "@/lib/validations/client";
import { createClient, getClients, getClientStats } from "@/lib/services/client-service";

/**
 * GET /api/clients
 * Get all clients with pagination, search, and filtering
 * Query params: page, limit, search, status, sortBy, sortOrder
 */
export const GET = requireAdmin(async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);

    // Parse and validate query parameters
    const query = clientQuerySchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });

    const result = await getClients(query);

    // Also get stats for the header/dashboard
    const stats = await getClientStats();

    return successResponse({
      ...result,
      stats,
    });
  } catch (error) {
    return handleApiError(error);
  }
});

/**
 * POST /api/clients
 * Create a new client
 */
export const POST = requireAdmin(async (req: NextRequest, session) => {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = createClientSchema.parse(body);

    // Create client
    const client = await createClient(validatedData, session.user.id);

    return createdResponse(client);
  } catch (error) {
    return handleApiError(error);
  }
});

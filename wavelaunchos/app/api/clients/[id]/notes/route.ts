import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, successResponse, createdResponse } from "@/lib/api/error-handler";
import { createNoteSchema } from "@/lib/validations/note";
import { createNote, getNotesByClientId } from "@/lib/services/note-service";

/**
 * GET /api/clients/[id]/notes
 * Get all notes for a client
 */
export const GET = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getNotesByClientId(params.id, page, limit);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});

/**
 * POST /api/clients/[id]/notes
 * Create a new note for a client
 */
export const POST = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();

    // Validate and add clientId from params
    const validatedData = createNoteSchema.parse({
      ...body,
      clientId: params.id,
    });

    const note = await createNote(validatedData, session.user.id);

    return createdResponse(note);
  } catch (error) {
    return handleApiError(error);
  }
});

import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, noContentResponse, successResponse } from "@/lib/api/error-handler";
import { deleteNote, updateNote } from "@/lib/services/note-service";
import { updateNoteSchema } from "@/lib/validations/note";

type RouteContext = {
  params: {
    id: string;
    noteId: string;
  };
};

export const PATCH = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: RouteContext
) => {
  try {
    const payload = updateNoteSchema.parse(await req.json());
    const note = await updateNote(params.noteId, payload, session.user.id);

    return successResponse(note);
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
    await deleteNote(params.noteId, session.user.id);
    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});


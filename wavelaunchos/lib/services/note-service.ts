import { prisma } from "../db/client";
import { ApiError } from "../api/error-handler";
import type { CreateNoteInput, UpdateNoteInput } from "../validations/note";

/**
 * Create a new note
 */
export async function createNote(
  data: CreateNoteInput,
  authorId: string
) {
  // Verify client exists
  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });

  if (!client) {
    throw new ApiError("Client not found", 404, "NOT_FOUND");
  }

  const note = await prisma.note.create({
    data: {
      ...data,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return note;
}

/**
 * Get notes for a client
 */
export async function getNotesByClientId(
  clientId: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where: { clientId },
      skip,
      take: limit,
      orderBy: [
        { isImportant: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.note.count({ where: { clientId } }),
  ]);

  return {
    data: notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + notes.length < total,
    },
  };
}

/**
 * Update a note
 */
export async function updateNote(
  id: string,
  data: UpdateNoteInput,
  authorId: string
) {
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    throw new ApiError("Note not found", 404, "NOT_FOUND");
  }

  // Only the author can update their note
  if (note.authorId !== authorId) {
    throw new ApiError("You can only update your own notes", 403, "FORBIDDEN");
  }

  const updated = await prisma.note.update({
    where: { id },
    data,
    include: {
      author: {
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

/**
 * Delete a note
 */
export async function deleteNote(id: string, authorId: string) {
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    throw new ApiError("Note not found", 404, "NOT_FOUND");
  }

  // Only the author can delete their note
  if (note.authorId !== authorId) {
    throw new ApiError("You can only delete your own notes", 403, "FORBIDDEN");
  }

  await prisma.note.delete({
    where: { id },
  });

  return { success: true };
}

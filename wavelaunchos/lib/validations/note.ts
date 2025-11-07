import { z } from "zod";

/**
 * Validation schema for creating a note
 */
export const createNoteSchema = z.object({
  clientId: z.string().cuid("Invalid client ID"),
  content: z.string().min(1, "Note content is required").max(5000, "Note must be less than 5000 characters"),
  isImportant: z.boolean().optional().default(false),
});

/**
 * Validation schema for updating a note
 */
export const updateNoteSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  isImportant: z.boolean().optional(),
});

/**
 * Type exports
 */
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

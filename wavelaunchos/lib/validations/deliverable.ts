import { z } from "zod";

import { DeliverableStatus } from "@prisma/client";

export const createDeliverableSchema = z.object({
  clientId: z.string().cuid("Invalid client ID"),
  title: z.string().min(2, "Title must be at least 2 characters").max(200, "Title must be under 200 characters"),
  sectionType: z.string().min(1, "Section type is required").max(100, "Section type must be under 100 characters"),
  month: z.number().int().min(1).max(12),
  status: z.nativeEnum(DeliverableStatus).default(DeliverableStatus.DRAFT),
  contentHtml: z.string().min(1, "HTML content is required"),
  contentMarkdown: z.string().min(1, "Markdown content is required"),
  target: z.number().int().positive().optional(),
  reviewerId: z.string().cuid().optional(),
  generatedById: z.string().cuid().optional(),
});

export const updateDeliverableSchema = createDeliverableSchema
  .omit({ clientId: true, generatedById: true })
  .partial()
  .extend({ rejectionReason: z.string().max(500).optional() });

export type CreateDeliverableInput = z.infer<typeof createDeliverableSchema>;
export type UpdateDeliverableInput = z.infer<typeof updateDeliverableSchema>;


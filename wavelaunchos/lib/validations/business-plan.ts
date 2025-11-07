import { z } from "zod";

import { PlanStatus } from "@/lib/generated/prisma/enums";

export const createBusinessPlanSchema = z.object({
  clientId: z.string().cuid("Invalid client ID"),
  version: z.number().int().positive().default(1),
  status: z.nativeEnum(PlanStatus).default(PlanStatus.DRAFT),
  contentHtml: z.string().min(1, "HTML content is required"),
  contentMarkdown: z.string().min(1, "Markdown content is required"),
  generatedById: z.string().cuid().optional(),
  approvedAt: z.coerce.date().optional(),
});

export const updateBusinessPlanSchema = createBusinessPlanSchema
  .omit({ clientId: true, version: true, generatedById: true })
  .partial();

export type CreateBusinessPlanInput = z.infer<typeof createBusinessPlanSchema>;
export type UpdateBusinessPlanInput = z.infer<typeof updateBusinessPlanSchema>;


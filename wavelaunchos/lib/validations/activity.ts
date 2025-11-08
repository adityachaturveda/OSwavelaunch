import { z } from "zod";
import { ActivityType } from "@prisma/client";

/**
 * Validation schema for creating an activity log
 */
export const createActivitySchema = z.object({
  clientId: z.string().cuid("Invalid client ID"),
  type: z.nativeEnum(ActivityType),
  description: z.string().min(1).max(500),
  metadata: z.record(z.string(), z.any()).optional(),
});

/**
 * Validation schema for querying activities
 */
export const activityQuerySchema = z.object({
  clientId: z.string().cuid().optional(),
  type: z.nativeEnum(ActivityType).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

/**
 * Type exports
 */
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type ActivityQuery = z.infer<typeof activityQuerySchema>;

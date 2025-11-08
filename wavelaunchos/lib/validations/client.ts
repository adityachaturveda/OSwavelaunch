import { z } from "zod";

import { ClientStatus } from "@prisma/client";

/**
 * Validation schema for creating a new client
 */
export const createClientSchema = z.object({
  creatorName: z.string().min(2, "Creator name must be at least 2 characters").max(100, "Creator name must be less than 100 characters"),
  brandName: z.string().min(2, "Brand name must be at least 2 characters").max(100, "Brand name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  niche: z.string().max(200, "Niche must be less than 200 characters").optional(),
  goals: z.string().max(1000, "Goals must be less than 1000 characters").optional(),
  socialHandles: z.object({
    instagram: z.string().url("Invalid Instagram URL").optional(),
    twitter: z.string().url("Invalid Twitter URL").optional(),
    youtube: z.string().url("Invalid YouTube URL").optional(),
    tiktok: z.string().url("Invalid TikTok URL").optional(),
    linkedin: z.string().url("Invalid LinkedIn URL").optional(),
    website: z.string().url("Invalid website URL").optional(),
  }).optional(),
  status: z.nativeEnum(ClientStatus).default(ClientStatus.ACTIVE),
});

/**
 * Validation schema for updating an existing client
 * All fields are optional
 */
export const updateClientSchema = z.object({
  creatorName: z.string().min(2).max(100).optional(),
  brandName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  niche: z.string().max(200).optional(),
  goals: z.string().max(1000).optional(),
  socialHandles: z.object({
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
    youtube: z.string().url().optional(),
    tiktok: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    website: z.string().url().optional(),
  }).optional(),
  status: z.nativeEnum(ClientStatus).optional(),
});

/**
 * Validation schema for client query parameters
 */
export const clientQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.nativeEnum(ClientStatus).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "creatorName", "brandName"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Type exports for use in API handlers and components
 */
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientQuery = z.infer<typeof clientQuerySchema>;

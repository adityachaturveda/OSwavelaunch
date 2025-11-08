import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Standard API error response
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Handle errors and return consistent JSON responses
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Validation errors (Zod)
  if (error instanceof ZodError) {
    const flattened = error.flatten();
    const fieldErrorEntries = Object.entries(flattened.fieldErrors);
    const details = fieldErrorEntries.reduce<Array<{ field: string; message: string }>>(
      (accumulator, [field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((message) => {
            accumulator.push({ field, message });
          });
        }
        return accumulator;
      },
      []
    );
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details,
      },
      { status: 400 }
    );
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      const field = (error.meta?.target as string[])?.join(", ") || "field";
      return NextResponse.json(
        {
          success: false,
          error: `A record with this ${field} already exists`,
          code: "DUPLICATE_ENTRY",
        },
        { status: 409 }
      );
    }

    // Record not found
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Record not found",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Foreign key constraint
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Related record not found",
          code: "FOREIGN_KEY_ERROR",
        },
        { status: 400 }
      );
    }
  }

  // Generic Prisma error
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid data provided",
        code: "VALIDATION_ERROR",
      },
      { status: 400 }
    );
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 }
  );
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Created response helper (201)
 */
export function createdResponse<T>(data: T): NextResponse {
  return successResponse(data, 201);
}

/**
 * No content response helper (204)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

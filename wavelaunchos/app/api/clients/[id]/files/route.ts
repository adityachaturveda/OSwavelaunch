import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, successResponse, createdResponse } from "@/lib/api/error-handler";
import { FileCategory } from "@/lib/generated/prisma/client";
import { createClientFile, listClientFiles } from "@/lib/services/file-service";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const GET = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const files = await listClientFiles(params.id);
    return successResponse({ data: files });
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: { params: { id: string } }
) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("File is required");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File exceeds 10MB limit");
    }

    const originalName = file.name || "upload";
    const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
    const relativeDir = path.join("uploads", params.id);
    const relativePath = path.join(relativeDir, safeName);
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);
    const absolutePath = path.join(process.cwd(), "public", relativePath);

    await fs.mkdir(absoluteDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(absolutePath, buffer);

    const category = (formData.get("category") as string | null) ?? FileCategory.UPLOAD;

    const record = await createClientFile({
      clientId: params.id,
      filename: originalName,
      filepath: relativePath.replace(/\\/g, "/"),
      filesize: file.size,
      mimetype: file.type,
      uploadedById: session.user.id,
      category,
    });

    return createdResponse(record);
  } catch (error) {
    return handleApiError(error);
  }
});


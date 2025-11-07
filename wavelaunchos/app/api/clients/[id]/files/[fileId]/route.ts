import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import { requireAdmin } from "@/lib/auth/api-middleware";
import { handleApiError, noContentResponse } from "@/lib/api/error-handler";
import { deleteClientFile } from "@/lib/services/file-service";

type RouteContext = {
  params: {
    id: string;
    fileId: string;
  };
};

export const DELETE = requireAdmin(async (
  req: NextRequest,
  session,
  { params }: RouteContext
) => {
  try {
    const record = await deleteClientFile(params.fileId);
    const absolutePath = path.join(process.cwd(), "public", record.filepath);

    try {
      await fs.unlink(absolutePath);
    } catch (fsError) {
      // ignore missing file on disk
      console.warn("Failed to remove file from disk", fsError);
    }

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});


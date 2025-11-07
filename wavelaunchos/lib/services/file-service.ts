import { prisma } from "@/lib/db/client";
import { ApiError } from "@/lib/api/error-handler";

export async function listClientFiles(clientId: string) {
  return prisma.file.findMany({
    where: { clientId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      filepath: true,
      filesize: true,
      mimetype: true,
      category: true,
      createdAt: true,
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function createClientFile(data: {
  clientId: string;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
  uploadedById: string;
  category: string;
}) {
  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
    select: { id: true },
  });

  if (!client) {
    throw new ApiError("Client not found", 404, "NOT_FOUND");
  }

  return prisma.file.create({
    data,
    select: {
      id: true,
      filename: true,
      filepath: true,
      filesize: true,
      mimetype: true,
      category: true,
      createdAt: true,
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function deleteClientFile(id: string) {
  const file = await prisma.file.findUnique({
    where: { id },
    select: {
      id: true,
      filepath: true,
    },
  });

  if (!file) {
    throw new ApiError("File not found", 404, "NOT_FOUND");
  }

  await prisma.file.delete({ where: { id } });
  return file;
}


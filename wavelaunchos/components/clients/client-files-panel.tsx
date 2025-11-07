"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Loader2, Upload, Trash2, Download } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type ClientFileRecord = {
  id: string;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
  category: string;
  createdAt: string;
  uploadedBy?: {
    name: string | null;
    email: string | null;
  } | null;
};

type ClientFilesPanelProps = {
  clientId: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function ClientFilesPanel({ clientId }: ClientFilesPanelProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<ClientFileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, startUploadTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFiles() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/clients/${clientId}/files`, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to load files.");
        }

        setFiles(payload.data.data as ClientFileRecord[]);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load files", error);
        toast({
          title: "Unable to load files",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadFiles();

    return () => controller.abort();
  }, [clientId, toast]);

  const uploadFile = (file: File) => {
    startUploadTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`/api/clients/${clientId}/files`, {
          method: "POST",
          body: formData,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to upload file.");
        }

        setFiles((prev) => [payload.data as ClientFileRecord, ...prev]);
        toast({
          title: "File uploaded",
          description: `${file.name} is now available in the workspace.`,
        });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } catch (error) {
        console.error("Failed to upload file", error);
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const removeFile = async (file: ClientFileRecord) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/files/${file.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to delete file.");
      }

      setFiles((prev) => prev.filter((item) => item.id !== file.id));
      toast({ title: "File deleted" });
    } catch (error) {
      console.error("Failed to delete file", error);
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleUploadClick = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <Card className="border-border/60 bg-card/90 shadow-none">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Files</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Securely store assets shared with the client and your internal team.
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={onFileChange}
            accept="*/*"
          />
          <Button onClick={handleUploadClick} disabled={isUploading} className="gap-2 shadow-none">
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload file
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading files...
          </div>
        ) : files.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-6 text-center text-sm text-muted-foreground">
            No files uploaded yet. Start by adding briefs, assets, or references.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                    File
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                    Size
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                    Uploaded by
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                    Uploaded
                  </TableHead>
                  <TableHead className="w-28 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id} className="border-border/30">
                    <TableCell className="flex flex-col gap-1 text-sm">
                      <span className="font-medium text-foreground">{file.filename}</span>
                      <Badge variant="outline" className="w-fit border-border/50 text-xs text-muted-foreground">
                        {file.mimetype || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatSize(file.filesize)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {file.uploadedBy?.name ?? file.uploadedBy?.email ?? "Team"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(file.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                          <a href={`/${file.filepath}`} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFile(file)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


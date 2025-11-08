"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DeliverableStatus } from "@prisma/client";

type DeliverableRecord = {
  id: string;
  title: string;
  sectionType: string;
  month: number;
  status: DeliverableStatus;
  target: number | null;
  reviewer?: {
    name: string | null;
    email: string | null;
  } | null;
  generatedBy?: {
    name: string | null;
    email: string | null;
  } | null;
  updatedAt: string;
};

type ClientDeliverablesPanelProps = {
  clientId: string;
};

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200, "Title must be under 200 characters"),
  sectionType: z.string().min(1, "Section type is required").max(100, "Section type must be under 100 characters"),
  month: z
    .string()
    .regex(/^(?:[1-9]|1[0-2])$/, { message: "Month must be between 1 and 12" }),
  status: z.nativeEnum(DeliverableStatus),
  contentMarkdown: z.string().min(1, "Content is required"),
  target: z
    .union([z.string().regex(/^[0-9]+$/, { message: "Must be a number" }), z.literal("")])
    .optional(),
});

type DeliverableFormValues = z.infer<typeof formSchema>;

const statusOptions = Object.values(DeliverableStatus);

function formatMonth(month: number) {
  const date = new Date();
  date.setMonth(month - 1);
  return date.toLocaleDateString(undefined, { month: "long" });
}

function markdownToHtml(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

export function ClientDeliverablesPanel({ clientId }: ClientDeliverablesPanelProps) {
  const { toast } = useToast();
  const [deliverables, setDeliverables] = useState<DeliverableRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<DeliverableStatus | "ALL">("ALL");
  const [isSubmitting, startSubmitTransition] = useTransition();

  const form = useForm<DeliverableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      sectionType: "",
      month: "1",
      status: DeliverableStatus.DRAFT,
      contentMarkdown: "",
      target: "",
    },
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadDeliverables() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/clients/${clientId}/deliverables?limit=50`, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to load deliverables.");
        }

        setDeliverables(
          (payload.data.data as any[]).map((deliverable) => ({
            ...deliverable,
            updatedAt: deliverable.updatedAt,
          }))
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load deliverables", error);
        toast({
          title: "Unable to load deliverables",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadDeliverables();

    return () => controller.abort();
  }, [clientId, toast]);

  const filteredDeliverables = useMemo(() => {
    if (statusFilter === "ALL") return deliverables;
    return deliverables.filter((deliverable) => deliverable.status === statusFilter);
  }, [deliverables, statusFilter]);

  const onSubmit = (values: DeliverableFormValues) => {
    startSubmitTransition(async () => {
      try {
        const response = await fetch(`/api/clients/${clientId}/deliverables`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            contentHtml: markdownToHtml(values.contentMarkdown),
            month: Number(values.month),
            target:
              typeof values.target === "string" && values.target.trim().length > 0
                ? Number(values.target)
                : null,
          }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to create deliverable.");
        }

        setDeliverables((prev) => [payload.data as DeliverableRecord, ...prev]);
        toast({
          title: "Deliverable created",
          description: `"${values.title}" was added to this client.`,
        });
        form.reset({
          title: "",
          sectionType: "",
          month: "1",
          status: DeliverableStatus.DRAFT,
          contentMarkdown: "",
          target: "",
        });
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Failed to create deliverable", error);
        toast({
          title: "Creation failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const updateStatus = async (deliverable: DeliverableRecord, status: DeliverableStatus) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/deliverables/${deliverable.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to update deliverable.");
      }

      setDeliverables((prev) => prev.map((item) => (item.id === deliverable.id ? payload.data : item)));
    } catch (error) {
      console.error("Failed to update deliverable", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const deleteDeliverable = async (deliverable: DeliverableRecord) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/deliverables/${deliverable.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to delete deliverable.");
      }

      setDeliverables((prev) => prev.filter((item) => item.id !== deliverable.id));
      toast({ title: "Deliverable deleted" });
    } catch (error) {
      console.error("Failed to delete deliverable", error);
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-border/60 bg-card/90 shadow-none">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Deliverables</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Track each asset, assign reviewers, and monitor status across the engagement.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as DeliverableStatus | "ALL")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-none">
                <Plus className="h-4 w-4" /> Add deliverable
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>New deliverable</DialogTitle>
                <DialogDescription>Provide details to generate a new deliverable record.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Executive Summary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sectionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <FormControl>
                            <Input placeholder="Narrative, Analysis, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Month</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={12} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 45" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentMarkdown"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[160px] resize-y"
                            placeholder="Outline the deliverable contents here..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving
                        </span>
                      ) : (
                        "Create deliverable"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="min-w-[200px] text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Deliverable
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Section
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Month
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Target
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Reviewer
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Updated
                </TableHead>
                <TableHead className="w-20 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Loading deliverables...
                  </TableCell>
                </TableRow>
              ) : filteredDeliverables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
                    No deliverables match the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeliverables.map((deliverable) => (
                  <TableRow key={deliverable.id} className="border-border/30">
                    <TableCell className="font-medium text-foreground">{deliverable.title}</TableCell>
                    <TableCell className="text-muted-foreground">{deliverable.sectionType}</TableCell>
                    <TableCell className="text-muted-foreground">{formatMonth(deliverable.month)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <Select
                        value={deliverable.status}
                        onValueChange={(value) => updateStatus(deliverable, value as DeliverableStatus)}
                      >
                        <SelectTrigger className="h-8 w-[170px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {deliverable.target ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {deliverable.reviewer?.name ?? deliverable.reviewer?.email ?? "Unassigned"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(deliverable.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteDeliverable(deliverable)}
                        title="Delete deliverable"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}


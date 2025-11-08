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
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlanStatus } from "@prisma/client";
import { createBusinessPlanSchema } from "@/lib/validations/business-plan";
import { parseJsonSafe, extractErrorMessage } from "@/lib/api/fetch-utils";

type BusinessPlanRecord = {
  id: string;
  version: number;
  status: PlanStatus;
  contentMarkdown: string;
  contentHtml: string;
  generatedBy?: {
    name: string | null;
    email: string | null;
  } | null;
  updatedAt: string;
  createdAt: string;
};

type ClientPlansPanelProps = {
  clientId: string;
};

const formSchema = createBusinessPlanSchema
  .omit({ clientId: true, generatedById: true, contentHtml: true })
  .extend({
    contentMarkdown: z.string().min(1, "Content is required"),
    version: z
      .string()
      .regex(/^[1-9][0-9]*$/, { message: "Version must be a positive number" })
      .default("1"),
  });

type PlanFormValues = z.input<typeof formSchema>;

const statusOptions = Object.values(PlanStatus);

function markdownToHtml(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

export function ClientPlansPanel({ clientId }: ClientPlansPanelProps) {
  const { toast } = useToast();
  const [plans, setPlans] = useState<BusinessPlanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, startSubmitTransition] = useTransition();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: "1",
      status: PlanStatus.DRAFT,
      contentMarkdown: "",
    },
  });

  const latestVersion = useMemo(() => (plans[0] ? plans[0].version : 0), [plans]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPlans() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/clients/${clientId}/business-plans?limit=20`, {
          signal: controller.signal,
        });
        const payload = await parseJsonSafe<{
          data: BusinessPlanRecord[];
          pagination: unknown;
        }>(response);

        if (!payload) {
          throw new Error(`Empty response received (status ${response.status}).`);
        }

        if (!payload.success) {
          throw new Error(
            extractErrorMessage(payload, "Failed to load plans.")
          );
        }

        if (!response.ok) {
          throw new Error(
            extractErrorMessage(
              payload,
              `Request failed with status ${response.status}.`
            )
          );
        }

        setPlans(payload.data.data as BusinessPlanRecord[]);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load plans", error);
        toast({
          title: "Unable to load plans",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadPlans();

    return () => controller.abort();
  }, [clientId, toast]);

  const onSubmit = (values: PlanFormValues) => {
    startSubmitTransition(async () => {
      try {
        const parsed = formSchema.parse(values);
        const versionNumber = Number(parsed.version);
        const response = await fetch(`/api/clients/${clientId}/business-plans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsed,
            version: versionNumber,
            contentHtml: markdownToHtml(parsed.contentMarkdown),
          }),
        });
        const payload = await parseJsonSafe<BusinessPlanRecord>(response);

        if (!payload) {
          throw new Error(`Empty response received (status ${response.status}).`);
        }

        if (!payload.success) {
          throw new Error(
            extractErrorMessage(payload, "Failed to create plan.")
          );
        }

        if (!response.ok) {
          throw new Error(
            extractErrorMessage(
              payload,
              `Request failed with status ${response.status}.`
            )
          );
        }

        setPlans((prev) => [payload.data as BusinessPlanRecord, ...prev]);
        toast({
          title: "Plan added",
          description: `Version ${versionNumber} recorded successfully.`,
        });
        form.reset({
          version: String(latestVersion + 1 || 1),
          status: PlanStatus.DRAFT,
          contentMarkdown: "",
        });
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Failed to create plan", error);
        toast({
          title: "Creation failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const updateStatus = async (plan: BusinessPlanRecord, status: PlanStatus) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/business-plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await parseJsonSafe<BusinessPlanRecord>(response);

      if (!payload) {
        throw new Error(`Empty response received (status ${response.status}).`);
      }

      if (!payload.success) {
        throw new Error(
          extractErrorMessage(payload, "Failed to update plan.")
        );
      }

      if (!response.ok) {
        throw new Error(
          extractErrorMessage(
            payload,
            `Request failed with status ${response.status}.`
          )
        );
      }

      setPlans((prev) => prev.map((item) => (item.id === plan.id ? payload.data : item)));
    } catch (error) {
      console.error("Failed to update plan", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const deletePlan = async (plan: BusinessPlanRecord) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/business-plans/${plan.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await parseJsonSafe<null>(response);
        throw new Error(
          extractErrorMessage(payload, `Failed to delete plan. (${response.status})`)
        );
      }

      setPlans((prev) => prev.filter((item) => item.id !== plan.id));
      toast({ title: "Plan deleted" });
    } catch (error) {
      console.error("Failed to delete plan", error);
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
          <CardTitle className="text-base font-semibold">Business Plans</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Track plan versions shared with the client and iterate collaboratively.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-none">
              <Plus className="h-4 w-4" />
              Add plan version
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>New plan version</DialogTitle>
              <DialogDescription>Record a new version of the client's business plan.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="contentMarkdown"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[180px] resize-y"
                          placeholder="Summarize the current plan version..."
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
                      "Create plan"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-6 text-center text-sm text-muted-foreground">
            No plans recorded yet. Use the button above to create the first draft.
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="space-y-2 rounded-lg border border-border/50 bg-background/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-border/60">
                      Version {plan.version}
                    </Badge>
                    <Select
                      value={plan.status}
                      onValueChange={(value) => updateStatus(plan, value as PlanStatus)}
                    >
                      <SelectTrigger className="h-8 w-[160px]">
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
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      Updated {new Date(plan.updatedAt).toLocaleDateString()} by {" "}
                      {plan.generatedBy?.name ?? plan.generatedBy?.email ?? "Team"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deletePlan(plan)}
                      title="Delete plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {plan.contentMarkdown.slice(0, 480)}
                  {plan.contentMarkdown.length > 480 ? "…" : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


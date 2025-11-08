"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { createActivitySchema } from "@/lib/validations/activity";
import { ActivityType } from "@prisma/client";

const activityFormSchema = createActivitySchema.omit({ clientId: true, metadata: true });

type ActivityFormValues = z.infer<typeof activityFormSchema>;

type ClientActivity = {
  id: string;
  description: string;
  type: ActivityType;
  createdAt: string;
};

type ClientActivityFeedProps = {
  clientId: string;
};

const activityOptions = Object.values(ActivityType);

function relativeDate(dateIso: string) {
  const date = new Date(dateIso);
  const diff = Date.now() - date.getTime();

  if (diff < 60_000) return "moments ago";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

const typeLabels: Record<ActivityType, string> = {
  CLIENT_CREATED: "Client created",
  PLAN_GENERATED: "Plan generated",
  DELIVERABLE_GENERATED: "Deliverable generated",
  NOTE_ADDED: "Note added",
  FILE_UPLOADED: "File uploaded",
  CLIENT_UPDATED: "Client updated",
  JOB_COMPLETED: "Job completed",
  BACKUP_CREATED: "Backup created",
};

export function ClientActivityFeed({ clientId }: ClientActivityFeedProps) {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<ActivityType | "ALL">("ALL");
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: ActivityType.CLIENT_UPDATED,
      description: "",
    },
  });

  const filteredActivities = useMemo(() => {
    if (filterType === "ALL") return activities;
    return activities.filter((activity) => activity.type === filterType);
  }, [activities, filterType]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({ limit: "25" });
        const response = await fetch(`/api/clients/${clientId}/activities?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to load activities.");
        }

        setActivities(payload.data.data as ClientActivity[]);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load activities", error);
        toast({
          title: "Unable to load activity feed",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadActivities();

    return () => controller.abort();
  }, [clientId, toast]);

  const onSubmit = (values: ActivityFormValues) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/clients/${clientId}/activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to log activity.");
        }

        setActivities((prev) => [payload.data as ClientActivity, ...prev].slice(0, 50));
        form.reset({ type: values.type, description: "" });

        toast({
          title: "Activity logged",
          description: "Your update has been added to the client feed.",
        });
      } catch (error) {
        console.error("Failed to log activity", error);
        toast({
          title: "Unable to log activity",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="border-border/60 bg-card/90 shadow-none">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold">Activity Feed</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Live log of deliverables, updates, and collaboration events.
          </CardDescription>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Select value={filterType} onValueChange={(value) => setFilterType(value as ActivityType | "ALL")}
            >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All activity</SelectItem>
              {activityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {typeLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-border/60 bg-muted/10 p-4">
            <div className="grid gap-4 md:grid-cols-[200px,1fr]">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activityOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {typeLabels[option]}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Summarize the activity..."
                        className="min-h-[100px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging...
                </span>
              ) : (
                "Log activity"
              )}
            </Button>
          </form>
        </Form>

        <Separator />

        {isLoading ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading activity...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            No activity logged yet.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/80 p-4"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-border/60 text-foreground">
                    {typeLabels[activity.type]}
                  </Badge>
                  <span>•</span>
                  <span>{relativeDate(activity.createdAt)}</span>
                </div>
                <p className="text-sm text-foreground/90">{activity.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


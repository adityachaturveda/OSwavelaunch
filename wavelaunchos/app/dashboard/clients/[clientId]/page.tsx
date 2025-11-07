import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  PenSquare,
  Share2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientActivityFeed } from "@/components/clients/client-activity-feed";
import { ClientNotesPanel } from "@/components/clients/client-notes-panel";
import { ClientDeliverablesPanel } from "@/components/clients/client-deliverables-panel";
import { ClientPlansPanel } from "@/components/clients/client-plans-panel";
import { ClientFilesPanel } from "@/components/clients/client-files-panel";
import { getClientDetail, getClientsSummary } from "@/lib/data/clients";

const TIMELINE_STATUS_STYLES: Record<string, string> = {
  done: "border-emerald-400 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100",
  in_progress:
    "border-sky-400 bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-100",
  pending:
    "border-amber-400 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100",
};

const TIMELINE_ICON: Record<string, ReactNode> = {
  done: <CheckCircle2 className="h-3.5 w-3.5" />,
  in_progress: <Clock3 className="h-3.5 w-3.5" />,
  pending: <CalendarClock className="h-3.5 w-3.5" />,
};

export default async function ClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;
  const client = await getClientDetail(clientId);

  if (!client) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border/40 bg-muted/20 text-lg font-semibold uppercase">
            {client.brand.slice(0, 2)}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{client.name}</h1>
              <Badge variant="muted" size="sm" className="border-border/50 bg-muted px-3 text-xs">
                {client.industry}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Started: {client.started}</span>
              <span>
                Stage: {client.stage} · {client.stageSummary}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <PenSquare className="h-4 w-4" />
            Edit Client Info
          </Button>
          <Button size="sm" className="gap-2 shadow-none">
            <Share2 className="h-4 w-4" /> Share Workspace
          </Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex w-full flex-wrap items-center gap-2 bg-muted/30 p-1">
          <TabsTrigger value="overview" className="rounded-full px-4 text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-full px-4 text-xs">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="deliverables" className="rounded-full px-4 text-xs">
            Deliverables
          </TabsTrigger>
          <TabsTrigger value="communication" className="rounded-full px-4 text-xs">
            Communication
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-full px-4 text-xs">
            Documents
          </TabsTrigger>
          <TabsTrigger value="notes" className="rounded-full px-4 text-xs">
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
              <div className="space-y-6">
                <section className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Overall Project Completion</p>
                    <div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="absolute inset-y-0 rounded-full bg-primary"
                          style={{ width: `${client.progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{client.progress}% complete</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="border-border/50 bg-muted/10 shadow-none">
                      <CardHeader className="space-y-1 pb-2">
                        <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground/70">
                          Current Focus
                        </CardDescription>
                        <CardTitle className="text-sm font-semibold text-foreground">{client.currentFocus}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Next milestone: {client.nextMilestone}
                      </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-muted/10 shadow-none">
                      <CardHeader className="space-y-1 pb-2">
                        <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground/70">
                          Summary
                        </CardDescription>
                        <CardTitle className="text-sm font-semibold text-foreground">What we're solving</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        {client.summary}
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Recent activity</h3>
                  <div className="space-y-3">
                    {client.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/10 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          <CalendarClock className="h-4 w-4" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-foreground/90">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-4">
                <Card className="border-border/40 bg-muted/10 shadow-none">
                  <CardHeader className="space-y-1 pb-2">
                    <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground/70">
                      Key metrics
                    </CardDescription>
                    <CardTitle className="text-sm font-semibold text-foreground">Delivery health</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {client.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-lg border border-border/40 bg-background/40 p-3"
                      >
                        <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                          {metric.label}
                        </p>
                        <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                        <p className="text-xs text-muted-foreground">{metric.hint}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Roadmap timeline</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Month-by-month focus areas and deliverables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.timeline.map((entry) => (
                <div
                  key={entry.month}
                  className="rounded-xl border border-border/50 bg-muted/10 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {entry.month} · {entry.focus}
                      </p>
                    </div>
                    <Badge variant="muted" size="sm" className="px-3">
                      {entry.items.filter((item) => item.status === "done").length}/{entry.items.length} complete
                    </Badge>
                  </div>
                  <Separator className="my-3 bg-border/50" />
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {entry.items.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 p-3"
                      >
                        <Badge
                          variant="muted"
                          size="sm"
                          className={`${TIMELINE_STATUS_STYLES[item.status]} gap-1 px-2`}
                        >
                          {TIMELINE_ICON[item.status]}
                          {item.status === "done"
                            ? "Done"
                            : item.status === "in_progress"
                            ? "In Progress"
                            : "Pending"}
                        </Badge>
                        <span className="text-sm text-foreground/90">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliverables" className="space-y-6">
          <ClientDeliverablesPanel clientId={params.clientId} />
          <ClientPlansPanel clientId={params.clientId} />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <ClientActivityFeed clientId={params.clientId} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <ClientFilesPanel clientId={params.clientId} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <ClientNotesPanel clientId={params.clientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export async function generateStaticParams() {
  const clients = await getClientsSummary();
  return clients.map(({ id }) => ({ clientId: id }));
}

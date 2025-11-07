import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileQuestion,
  MessageSquareText,
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
import { getClientDetail, getClientsSummary } from "@/lib/data/clients";

const STATUS_STYLES: Record<string, string> = {
  Complete:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
  "In Review":
    "border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-400/60 dark:bg-sky-500/25 dark:text-sky-100",
  Pending:
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/60 dark:bg-amber-500/25 dark:text-amber-100",
};

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
  const client = await getClientDetail(params.clientId);

  if (!client) {
    console.warn("[ClientDetailPage] Missing client detail for", params.clientId);
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
                        <CardTitle className="text-sm font-semibold text-foreground">What we’re solving</CardTitle>
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
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">Deliverables</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Track every asset across the eight-month engagement.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2 shadow-none">
                <BookOpen className="h-4 w-4" /> Add Deliverable
              </Button>
            </CardHeader>
            <CardContent className="-mx-4 overflow-x-auto px-4">
              <Table className="min-w-full border-separate border-spacing-y-1">
                <TableHeader>
                  <TableRow className="border-border/40">
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Deliverable
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Month
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Uploaded
                    </TableHead>
                    <TableHead className="w-24 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.deliverables.map((deliverable) => (
                    <TableRow key={deliverable.id} className="border-border/30">
                      <TableCell className="font-medium text-foreground">{deliverable.title}</TableCell>
                      <TableCell className="text-muted-foreground">{deliverable.type}</TableCell>
                      <TableCell className="text-muted-foreground">{deliverable.month}</TableCell>
                      <TableCell className="min-w-[140px]">
                        <Badge
                          variant="muted"
                          size="sm"
                          className={
                            STATUS_STYLES[deliverable.status] ??
                            "border-border/40 bg-muted text-muted-foreground"
                          }
                        >
                          {deliverable.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{deliverable.uploadedOn ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold">Communication Hub</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Centralize client chats, approvals, and internal notes.
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
                  <MessageSquareText className="h-4 w-4" />
                  Log update
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {client.communication.pinned.map((item) => (
                  <Badge key={item} variant="muted" size="sm" className="bg-muted px-3 text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
              <ScrollArea className="h-[360px] rounded-lg border border-border/40 bg-muted/10 p-4">
                <div className="space-y-4">
                  {client.communication.feed.map((entry) => (
                    <div key={entry.id} className="space-y-1 rounded-lg border border-border/40 bg-background/60 p-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{entry.author}</span>
                        <span>{entry.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground/70">{entry.role}</p>
                      <p className="text-sm text-foreground/90">{entry.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Card className="border-border/40 bg-muted/10 shadow-none">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-sm font-semibold text-foreground">Internal notes</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Not shared with the client.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.communication.internal.map((note, index) => (
                    <div
                      key={`${note}-${index}`}
                      className="rounded-lg border border-border/40 bg-background/60 p-3 text-sm text-muted-foreground"
                    >
                      {note}
                    </div>
                  ))}
                  <Button size="sm" variant="ghost" className="gap-2 text-xs text-muted-foreground hover:text-foreground">
                    <PenSquare className="h-3.5 w-3.5" />
                    Add internal note
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">Documents</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Secure repository of files, mockups, contracts, and media.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2 shadow-none">
                <FileQuestion className="h-4 w-4" /> Upload file
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40">
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      File name
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Uploaded by
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Month
                    </TableHead>
                    <TableHead className="w-24 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.documents.map((document) => (
                    <TableRow key={document.id} className="border-border/30">
                      <TableCell className="font-medium text-foreground">{document.name}</TableCell>
                      <TableCell className="text-muted-foreground">{document.uploadedBy}</TableCell>
                      <TableCell className="text-muted-foreground">{document.type}</TableCell>
                      <TableCell className="text-muted-foreground">{document.month}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          {document.action}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">Strategic Notes</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Capture decisions, ideas, and next steps.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
                <PenSquare className="h-4 w-4" />
                New note
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
              <div className="space-y-3">
                {client.notes.map((note) => (
                  <div key={note.id} className="space-y-2 rounded-lg border border-border/40 bg-muted/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{note.date}</span>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="muted" size="sm" className="bg-muted px-2 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90">{note.content}</p>
                  </div>
                ))}
              </div>
              <Card className="border-border/40 bg-background/60 shadow-none">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-sm font-semibold text-foreground">Capture a quick note</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Jot down context to revisit with the client.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="h-32 rounded-lg border border-border/50 bg-muted/10 p-3 text-sm text-muted-foreground">
                    Freeform note area
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="muted" size="sm" className="bg-muted px-2 text-xs">
                      Creative
                    </Badge>
                    <Badge variant="muted" size="sm" className="bg-muted px-2 text-xs">
                      Pending Approval
                    </Badge>
                    <Badge variant="muted" size="sm" className="bg-muted px-2 text-xs">
                      Action
                    </Badge>
                  </div>
                  <Button size="sm" className="shadow-none">
                    Save note
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

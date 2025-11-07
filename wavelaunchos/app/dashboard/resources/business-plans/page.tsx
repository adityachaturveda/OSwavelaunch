"use client";

import { useMemo, useState } from "react";
import { Calendar, FileText, Filter, ListTree, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PLANS = [
  {
    id: "acme-launch",
    name: "Acme Studios Launch Roadmap",
    client: "Acme Studios",
    stage: "In Review",
    owner: "Eddie Lake",
    updated: "Yesterday",
    summary: "Phased rollout plan covering audience research, creative production, and GTM activation.",
    milestones: [
      { title: "Discovery", status: "Complete" },
      { title: "Prototype", status: "In Progress" },
      { title: "GTM", status: "Upcoming" },
    ],
  },
  {
    id: "blue-expansion",
    name: "Blue Harbor Expansion",
    client: "Blue Harbor AI",
    stage: "Active",
    owner: "Alicia Barr",
    updated: "3d ago",
    summary: "Scaling analytics product into APAC with tiered enablement and localization tracks.",
    milestones: [
      { title: "Market research", status: "Complete" },
      { title: "Localization", status: "In Progress" },
      { title: "Launch", status: "Upcoming" },
    ],
  },
  {
    id: "lumen-growth",
    name: "Lumen Ventures Growth Thesis",
    client: "Lumen Ventures",
    stage: "Draft",
    owner: "Noah Chen",
    updated: "1w ago",
    summary: "Playbooks for scaling creator monetization with hybrid sponsorship programs.",
    milestones: [
      { title: "Thesis", status: "Complete" },
      { title: "Financial model", status: "In Progress" },
      { title: "Launch plan", status: "Upcoming" },
    ],
  },
];

const STAGE_COLORS: Record<string, string> = {
  Active:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
  "In Review":
    "border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-400/60 dark:bg-sky-500/25 dark:text-sky-100",
  Draft:
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/60 dark:bg-amber-500/25 dark:text-amber-100",
};

const FILTERS = ["All", "Active", "Draft", "In Review"] as const;

export default function BusinessPlansPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [view, setView] = useState<"table" | "timeline">("table");

  const visiblePlans = useMemo(() => {
    if (filter === "All") return PLANS;
    return PLANS.filter((plan) => plan.stage === filter);
  }, [filter]);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Business Plans</h1>
          <p className="text-sm text-muted-foreground">
            Centralize strategic plans, track milestones, and collaborate with stakeholders.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 shadow-none">
            <FileText className="h-4 w-4" />
            New Plan
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item}
              variant={item === filter ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full px-3 text-xs"
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as typeof view)}>
          <ToggleGroupItem value="table" className="gap-2 rounded-full px-3 text-xs">
            <ListTree className="h-4 w-4" /> Table
          </ToggleGroupItem>
          <ToggleGroupItem value="timeline" className="gap-2 rounded-full px-3 text-xs">
            <Calendar className="h-4 w-4" /> Timeline
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "table" ? (
        <Card className="border-border/60 bg-card/90 shadow-none">
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40">
                  <TableHead className="min-w-[220px] text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                    Plan Name
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Client</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Stage</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Owner</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Last Updated</TableHead>
                  <TableHead className="w-24 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePlans.map((plan) => (
                  <TableRow key={plan.id} className="border-border/30 transition-colors hover:bg-muted/10">
                    <TableCell className="font-medium text-foreground">{plan.name}</TableCell>
                    <TableCell className="text-muted-foreground">{plan.client}</TableCell>
                    <TableCell>
                      <Badge
                        variant="muted"
                        size="sm"
                        className={
                          STAGE_COLORS[plan.stage] ??
                          "border-border/40 bg-muted text-muted-foreground dark:bg-muted/40"
                        }
                      >
                        {plan.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{plan.owner}</TableCell>
                    <TableCell className="text-muted-foreground">{plan.updated}</TableCell>
                    <TableCell className="text-right">
                      <PlanSheet plan={plan} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {visiblePlans.length === 0 && (
              <div className="border-t border-border/40 py-12 text-center text-sm text-muted-foreground">
                No plans match this filter yet.
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 bg-card/90 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Milestone timeline</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Upcoming checkpoints grouped by plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visiblePlans.map((plan) => (
              <div key={plan.id} className="space-y-3 rounded-lg border border-border/40 bg-muted/10 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">{plan.client}</p>
                </div>
                <div className="space-y-2">
                  {plan.milestones.map((milestone) => (
                    <div key={milestone.title} className="flex items-center justify-between rounded-md border border-border/40 bg-background/60 px-3 py-2 text-xs">
                      <span className="font-medium text-foreground">{milestone.title}</span>
                      <Badge variant="outline" className="rounded-full px-2 text-[11px]">
                        {milestone.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type Plan = (typeof PLANS)[number];

function PlanSheet({ plan }: { plan: Plan }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground">
          Open
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full space-y-6 border-border bg-card shadow-2xl sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-semibold text-foreground">{plan.name}</SheetTitle>
          <SheetDescription className="text-left text-sm text-muted-foreground">{plan.summary}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-3">
            <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground/80">
              <Users className="h-4 w-4" /> Client
            </span>
            <span className="font-medium text-foreground">{plan.client}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-3">
            <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground/80">
              <FileText className="h-4 w-4" /> Owner
            </span>
            <span className="font-medium text-foreground">{plan.owner}</span>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Milestones</p>
            <div className="space-y-2">
              {plan.milestones.map((milestone) => (
                <div key={milestone.title} className="rounded-md border border-border/50 bg-background/60 px-3 py-2 text-xs">
                  <p className="font-medium text-foreground">{milestone.title}</p>
                  <p className="text-muted-foreground">Status: {milestone.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

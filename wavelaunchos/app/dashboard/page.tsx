import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getDashboardMetrics,
  getRecentDeliverables,
  getVisitorMetrics,
} from "@/lib/data/dashboard";
import { cn } from "@/lib/utils";

const deliverableFilters = ["All", "In Progress", "Done", "Review"] as const;

const statusClasses: Record<string, string> = {
  "In Progress":
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/60 dark:bg-amber-500/25 dark:text-amber-100",
  PENDING_REVIEW:
    "border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-400/60 dark:bg-sky-500/25 dark:text-sky-100",
  APPROVED:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
  DELIVERED:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
  REVISION_REQUESTED:
    "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-400/60 dark:bg-rose-500/25 dark:text-rose-100",
  Review:
    "border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-400/60 dark:bg-sky-500/25 dark:text-sky-100",
  Done:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
};

export default async function DashboardPage() {
  const [metrics, visitorData, deliverables] = await Promise.all([
    getDashboardMetrics(),
    getVisitorMetrics(),
    getRecentDeliverables(),
  ]);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      <SectionCards
        metrics={metrics.map((metric) => ({
          id: metric.id,
          label: metric.label,
          value: metric.value,
          delta: metric.delta,
          isPositive: metric.isPositive,
          subheading: metric.subheading,
          description: metric.description,
        }))}
      />

      <ChartAreaInteractive data={visitorData} />

      <Card className="rounded-none border border-border bg-card/95 p-6 shadow-none">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Active Deliverables</h2>
            <p className="text-sm text-muted-foreground">
              Track proposal documents and project progress in real time.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {deliverableFilters.map((filter, index) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={index === 0 ? "secondary" : "ghost"}
                  className="rounded-full border border-transparent px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground data-[state=open]:bg-muted/60"
                >
                  {filter}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border/60 bg-transparent text-muted-foreground hover:text-foreground"
              >
                Customize
              </Button>
              <Button size="sm" className="shadow-none">
                + Add Document
              </Button>
            </div>
          </div>

          {deliverables.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 py-12 text-center text-sm text-muted-foreground">
              No active deliverables. {" "}
              <Button variant="link" size="sm" className="px-1 text-foreground">
                Add a new one
              </Button>
            </div>
          ) : (
            <div className="-mx-4 overflow-x-auto px-4">
              <Table className="min-w-full border-separate border-spacing-y-1">
                <TableHeader>
                  <TableRow className="border-border/40">
                    <TableHead className="min-w-[180px] text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Deliverable
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Section Type
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliverables.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-border/30 transition-colors hover:bg-muted/10"
                    >
                      <TableCell className="font-medium text-foreground">{row.title}</TableCell>
                      <TableCell className="text-muted-foreground">{row.sectionType}</TableCell>
                      <TableCell className="min-w-[140px]">
                        <Badge
                          variant="muted"
                          size="sm"
                          className={cn(
                            "whitespace-nowrap",
                            statusClasses[row.status] ??
                              "border-border/50 bg-muted text-muted-foreground dark:bg-muted/40"
                          )}
                        >
                          {row.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.target ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{row.reviewer ?? "Unassigned"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { AlertOctagon, Filter, LifeBuoy, MailPlus, MessageSquareText, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const TICKETS = [
  {
    id: "SUP-2391",
    subject: "Unable to connect HubSpot integration",
    status: "Open",
    updated: "12m ago",
    priority: "High",
    assignee: "Sophie Martin",
    requester: "ops@blueharbor.ai",
    timeline: [
      { time: "10:24", actor: "System", text: "Auto-acknowledged ticket and assigned to support queue." },
      { time: "10:31", actor: "Sophie", text: "Requested authentication logs from customer." },
      { time: "10:42", actor: "Customer", text: "Provided screenshot of OAuth consent error." },
    ],
  },
  {
    id: "SUP-2386",
    subject: "Exported CSV has incorrect timezone",
    status: "In Progress",
    updated: "1h ago",
    priority: "Medium",
    assignee: "Ravi Patel",
    requester: "team@lumen.vc",
    timeline: [
      { time: "09:13", actor: "Ravi", text: "Investigating timezone mapping in analytics service." },
    ],
  },
  {
    id: "SUP-2378",
    subject: "Need invoices for Q3",
    status: "Resolved",
    updated: "Yesterday",
    priority: "Low",
    assignee: "WaveLaunch Billing",
    requester: "finance@acmestudios.com",
    timeline: [
      { time: "Yesterday", actor: "Billing", text: "Sent consolidated invoice export via secure link." },
    ],
  },
];

const STATUS_VARIANTS: Record<string, string> = {
  Open:
    "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-400/60 dark:bg-rose-500/25 dark:text-rose-100",
  "In Progress":
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/60 dark:bg-amber-500/25 dark:text-amber-100",
  Resolved:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
};

const FILTERS = ["All", "Open", "In Progress", "Resolved"] as const;

export default function SupportPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    const normalized = query.toLowerCase();
    return TICKETS.filter((ticket) => {
      const matchesFilter = filter === "All" || ticket.status === filter;
      const matchesQuery =
        !normalized || ticket.subject.toLowerCase().includes(normalized) || ticket.id.toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const activeTicket = activeId
    ? filteredTickets.find((ticket) => ticket.id === activeId) ?? TICKETS.find((ticket) => ticket.id === activeId) ?? null
    : null;

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Support</h1>
          <p className="text-sm text-muted-foreground">
            Submit issues, monitor resolution timelines, and collaborate with our support team.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
            Advanced filters
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="gap-2 shadow-none">
                <MailPlus className="h-4 w-4" />
                Submit new ticket
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full space-y-6 border-border bg-secondary/60 backdrop-blur-sm sm:max-w-lg">
              <SheetHeader className="text-left">
                <SheetTitle className="text-lg font-semibold text-foreground">Submit support ticket</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  Provide context so our team can respond quickly.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 text-sm text-muted-foreground">
                <label className="block space-y-1">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground/80">Subject</span>
                  <Input placeholder="Describe the issue" className="bg-muted/30" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground/80">Details</span>
                  <Textarea rows={4} placeholder="Include steps, URLs, and expected behavior" className="resize-none bg-muted/30" />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground/80">Priority</span>
                  <Input placeholder="Low / Medium / High" className="bg-muted/30" />
                </label>
              </div>
              <SheetFooter>
                <Button className="w-full gap-2 shadow-none">
                  <LifeBuoy className="h-4 w-4" />
                  Submit ticket
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
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
        <div className="relative flex w-full max-w-md items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by ticket ID or subject"
            className="pl-9"
          />
        </div>
      </div>

      <Card className="border-border/60 bg-card/90 shadow-none">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Ticket</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Subject</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Priority</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Assignee</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Updated</TableHead>
                <TableHead className="w-32 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-border/30 transition-colors hover:bg-muted/10">
                  <TableCell className="font-medium text-foreground">{ticket.id}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge
                      variant="muted"
                      size="sm"
                      className={
                        STATUS_VARIANTS[ticket.status] ??
                        "border-border/40 bg-muted text-muted-foreground dark:bg-muted/40"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ticket.priority}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.assignee}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.updated}</TableCell>
                  <TableCell className="text-right">
                    <Sheet key={ticket.id}>
                      <SheetTrigger asChild>
                        <Button
                          onClick={() => setActiveId(ticket.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
                        >
                          View
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full space-y-6 border-border bg-secondary/60 backdrop-blur-sm sm:max-w-xl">
                        <SheetHeader className="text-left">
                          <SheetTitle className="text-lg font-semibold text-foreground">{activeTicket?.subject ?? ticket.subject}</SheetTitle>
                          <SheetDescription className="text-sm text-muted-foreground">
                            Ticket {activeTicket?.id ?? ticket.id} · Requester {activeTicket?.requester ?? ticket.requester}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 text-sm text-muted-foreground">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <InfoBlock label="Status" value={activeTicket?.status ?? ticket.status} />
                            <InfoBlock label="Priority" value={activeTicket?.priority ?? ticket.priority} />
                            <InfoBlock label="Assignee" value={activeTicket?.assignee ?? ticket.assignee} />
                            <InfoBlock label="Updated" value={activeTicket?.updated ?? ticket.updated} />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Timeline</p>
                            <div className="space-y-3">
                              {(activeTicket?.timeline ?? ticket.timeline).map((entry, index) => (
                                <div key={`${entry.time}-${entry.actor}-${index}`} className="rounded-lg border border-border/50 bg-muted/10 p-3">
                                  <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                                    {entry.time} · {entry.actor}
                                  </p>
                                  <p className="text-sm text-foreground/90">{entry.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
                            <MessageSquareText className="h-4 w-4" />
                            Add internal note
                          </Button>
                          <Button className="gap-2 shadow-none">
                            <AlertOctagon className="h-4 w-4" />
                            Escalate ticket
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTickets.length === 0 && (
            <div className="border-t border-border/40 py-12 text-center text-sm text-muted-foreground">
              No tickets match this filter yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/10 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground/70">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

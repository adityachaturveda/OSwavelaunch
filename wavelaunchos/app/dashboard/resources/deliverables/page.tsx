"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Filter, PieChart, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type DeliverablePriority = "High" | "Medium" | "Low";

type Deliverable = {
  id: string;
  title: string;
  owner: string;
  due: string;
  client: string;
  priority: DeliverablePriority;
};

type DeliverableColumn = {
  id: string;
  title: string;
  items: Deliverable[];
};

const BOARD: DeliverableColumn[] = [
  {
    id: "todo",
    title: "To Do",
    items: [
      {
        id: "welcome-sequence",
        title: "Welcome sequence copy",
        owner: "Alicia Barr",
        due: "Nov 11",
        client: "Blue Harbor AI",
        priority: "High",
      },
      {
        id: "ad-concepts",
        title: "Ad concepts storyboard",
        owner: "Eddie Lake",
        due: "Nov 14",
        client: "Acme Studios",
        priority: "Medium",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [
      {
        id: "landing-refresh",
        title: "Landing page refresh",
        owner: "Inez Carver",
        due: "Nov 09",
        client: "Lumen Ventures",
        priority: "High",
      },
      {
        id: "funding-update",
        title: "Funding update microsite",
        owner: "Noah Chen",
        due: "Nov 12",
        client: "Acme Studios",
        priority: "Medium",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    items: [
      {
        id: "product-demo",
        title: "Product demo walkthrough",
        owner: "Alicia Barr",
        due: "Nov 07",
        client: "Blue Harbor AI",
        priority: "Low",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [
      {
        id: "investor-brief",
        title: "Investor brief",
        owner: "Inez Carver",
        due: "Nov 04",
        client: "Lumen Ventures",
        priority: "High",
      },
      {
        id: "brand-guidelines",
        title: "Brand guidelines update",
        owner: "Eddie Lake",
        due: "Nov 02",
        client: "Acme Studios",
        priority: "Low",
      },
    ],
  },
];

const PRIORITY_COLORS: Record<string, string> = {
  High:
    "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-400/60 dark:bg-rose-500/25 dark:text-rose-100",
  Medium:
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/60 dark:bg-amber-500/25 dark:text-amber-100",
  Low:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
};

const FILTERS = ["All", "Acme Studios", "Blue Harbor AI", "Lumen Ventures"];

export default function DeliverablesPage() {
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState<string>("All");
  const [columns, setColumns] = useState<DeliverableColumn[]>(BOARD);

  const handleDrop = (targetColumnId: string, index?: number) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("application/json");
    if (!payload) return;

    try {
      const { columnId: sourceColumnId, itemId } = JSON.parse(payload) as { columnId: string; itemId: string };
      if (!sourceColumnId || !itemId) return;

      setColumns((prev) => {
        if (sourceColumnId === targetColumnId) {
          return prev;
        }

        const next = prev.map((column) => ({ ...column, items: [...column.items] }));
        const sourceColumn = next.find((column) => column.id === sourceColumnId);
        const destinationColumn = next.find((column) => column.id === targetColumnId);
        if (!sourceColumn || !destinationColumn) {
          return prev;
        }

        const itemIndex = sourceColumn.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
          return prev;
        }

        const [movedItem] = sourceColumn.items.splice(itemIndex, 1);
        if (!movedItem) {
          return prev;
        }

        const insertIndex = typeof index === "number" ? Math.max(0, Math.min(index, destinationColumn.items.length)) : destinationColumn.items.length;
        destinationColumn.items.splice(insertIndex, 0, movedItem);

        return next;
      });
    } catch (error) {
      console.error("Failed to parse drag data", error);
    }
  };

  const handleDragStart = (columnId: string, itemId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/json", JSON.stringify({ columnId, itemId }));
  };

  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const filteredBoard = useMemo(() => {
    const normalized = search.toLowerCase();
    return columns.map((column) => ({
      ...column,
      items: column.items.filter((item) => {
        const matchesClient = clientFilter === "All" || item.client === clientFilter;
        const matchesSearch =
          !normalized || item.title.toLowerCase().includes(normalized) || item.owner.toLowerCase().includes(normalized);
        return matchesClient && matchesSearch;
      }),
    }));
  }, [clientFilter, columns, search]);

  const totalVisible = filteredBoard.reduce((count, column) => count + column.items.length, 0);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Deliverables</h1>
          <p className="text-sm text-muted-foreground">
            Track production across narrative decks, assets, and launch collateral.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
            Advanced filters
          </Button>
          <Button className="gap-2 shadow-none">
            <PieChart className="h-4 w-4" />
            New deliverable
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((client) => (
            <Button
              key={client}
              variant={client === clientFilter ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full px-3 text-xs"
              onClick={() => setClientFilter(client)}
            >
              {client}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search deliverables by title or owner"
            className="w-72 bg-muted/30"
          />
          <Badge variant="outline" className="rounded-full px-3 text-xs text-muted-foreground">
            {totalVisible} visible
          </Badge>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredBoard.map((column) => (
          <Card
            key={column.id}
            className="flex min-h-[320px] flex-col border-border/60 bg-card/90 shadow-none"
            onDragOver={allowDrop}
            onDrop={handleDrop(column.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold text-foreground">{column.title}</CardTitle>
              <Badge variant="outline" className="rounded-full px-2 text-xs text-muted-foreground">
                {column.items.length}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              {column.items.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/10 p-6 text-center text-xs text-muted-foreground">
                  No deliverables here yet.
                </div>
              ) : (
                column.items.map((item, index) => (
                  <article
                    key={item.id}
                    className="space-y-3 rounded-lg border border-border/50 bg-background/80 p-4 text-sm shadow-sm transition-colors hover:border-border"
                    draggable
                    onDragStart={(event) => handleDragStart(column.id, item.id)(event as React.DragEvent<HTMLDivElement>)}
                    onDragOver={(event) => allowDrop(event as React.DragEvent<HTMLDivElement>)}
                    onDrop={(event) => handleDrop(column.id, index)(event as React.DragEvent<HTMLDivElement>)}
                  >
                    <div className="space-y-1">
                      <p className="text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.client}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {item.owner}
                      </span>
                      <Separator orientation="vertical" className="h-4 bg-border/50" />
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" /> Due {item.due}
                      </span>
                      <Badge variant="outline" className={`${PRIORITY_COLORS[item.priority]} rounded-full px-2`}
                      >
                        {item.priority} priority
                      </Badge>
                    </div>
                  </article>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Filter, FolderOpen, MoreHorizontal, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const FOLDERS = [
  { id: "clients", name: "Clients", count: 128 },
  { id: "branding", name: "Branding", count: 32 },
  { id: "deliverables", name: "Deliverables", count: 58 },
];

const FILES = [
  {
    id: "brand-style",
    name: "WaveLaunch Brand Deck.pdf",
    type: "PDF",
    size: "8.6 MB",
    updatedAt: "3h ago",
    folder: "branding",
    thumbnail: "PDF",
    client: "Acme Studios",
  },
  {
    id: "client-scope",
    name: "Blue Harbor Scope.docx",
    type: "Doc",
    size: "1.2 MB",
    updatedAt: "1d ago",
    folder: "clients",
    thumbnail: "DOC",
    client: "Blue Harbor AI",
  },
  {
    id: "analytics-export",
    name: "Marketing Analytics.csv",
    type: "CSV",
    size: "2.3 MB",
    updatedAt: "6h ago",
    folder: "deliverables",
    thumbnail: "CSV",
    client: "Acme Studios",
  },
  {
    id: "logo-pack",
    name: "Acme Logo Pack.zip",
    type: "ZIP",
    size: "12.5 MB",
    updatedAt: "Yesterday",
    folder: "branding",
    thumbnail: "ZIP",
    client: "Acme Studios",
  },
  {
    id: "launch-plan",
    name: "Lumen Launch Plan.pptx",
    type: "Doc",
    size: "4.1 MB",
    updatedAt: "2d ago",
    folder: "deliverables",
    thumbnail: "PPT",
    client: "Lumen Ventures",
  },
];

const TYPES = ["All", "Image", "PDF", "Doc", "CSV", "ZIP"] as const;
const SORTS = ["Recent", "Name", "Size"] as const;
const CLIENT_FILTERS = ["All", ...Array.from(new Set(FILES.map((file) => file.client)))];

export default function FilesPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<(typeof TYPES)[number]>("All");
  const [activeSort, setActiveSort] = useState<(typeof SORTS)[number]>("Recent");
  const [activeClient, setActiveClient] = useState<string>("All");

  const visibleFiles = useMemo(() => {
    let data = [...FILES];

    if (query) {
      const normalized = query.toLowerCase();
      data = data.filter((file) => file.name.toLowerCase().includes(normalized));
    }

    if (activeType !== "All") {
      data = data.filter((file) => file.type === activeType);
    }

    if (activeClient !== "All") {
      data = data.filter((file) => file.client === activeClient);
    }

    data.sort((a, b) => {
      switch (activeSort) {
        case "Name":
          return a.name.localeCompare(b.name);
        case "Size":
          return a.size.localeCompare(b.size);
        default:
          return 0;
      }
    });

    return data;
  }, [query, activeType, activeClient, activeSort]);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Files</h1>
          <p className="text-sm text-muted-foreground">Organize brand assets, strategy decks, and deliverables.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <FolderOpen className="h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="space-y-6 lg:w-64">
          <section className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filters</div>
            <Input
              placeholder="Search files"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-muted/40"
            />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Client</p>
              <div className="flex flex-wrap gap-2">
                {CLIENT_FILTERS.map((client) => (
                  <Badge
                    key={client}
                    role="button"
                    variant={client === activeClient ? "secondary" : "outline"}
                    className="cursor-pointer rounded-full px-3 py-1 text-xs"
                    onClick={() => setActiveClient(client)}
                  >
                    {client}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Type</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((type) => (
                  <Badge
                    key={type}
                    variant={type === activeType ? "secondary" : "outline"}
                    className="cursor-pointer rounded-full px-3 py-1 text-xs"
                    onClick={() => setActiveType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Sort by</p>
              <div className="flex gap-2">
                {SORTS.map((sort) => (
                  <Button
                    key={sort}
                    variant={sort === activeSort ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-full px-3 text-xs"
                    onClick={() => setActiveSort(sort)}
                  >
                    {sort}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <Separator className="bg-border/60" />

          <section className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Top Folders</div>
            <div className="space-y-2">
              {FOLDERS.map((folder) => (
                <Card key={folder.id} className="border-border/50 bg-card/80 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
                    <div className="text-sm font-semibold text-foreground">{folder.name}</div>
                    <Badge variant="outline" className="rounded-full px-2 text-xs text-muted-foreground">
                      {folder.count}
                    </Badge>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        </aside>

        <section className="flex-1 space-y-6">
          <div className="rounded-xl border border-border/50 bg-card/60 p-4">
            <Breadcrumb />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleFiles.map((file) => (
              <Card key={file.id} className="group border-border/60 bg-card/90 shadow-none transition-colors hover:border-border">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <CardTitle className="text-sm font-semibold text-foreground line-clamp-2">{file.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 border-border/50 bg-card/90 text-sm">
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Move</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex h-32 items-center justify-center rounded-lg border border-border/40 bg-muted/20 text-xs font-semibold tracking-wide text-muted-foreground">
                    {file.thumbnail}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{file.type}</span>
                    <span>{file.size}</span>
                    <span>{file.updatedAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {visibleFiles.length === 0 && (
              <div className="col-span-full rounded-lg border border-dashed border-border/50 bg-muted/10 py-12 text-center text-sm text-muted-foreground">
                No files found for this filter combination.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Clients</span>
      <Separator orientation="vertical" className="h-4 bg-border/60" />
      <span>Blue Harbor AI</span>
      <Separator orientation="vertical" className="h-4 bg-border/60" />
      <span className="text-foreground">Campaign Assets</span>
      <Button variant="ghost" size="sm" className="ml-auto gap-2 text-xs text-muted-foreground hover:text-foreground">
        <Filter className="h-4 w-4" />
        Manage Filters
      </Button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, Plus, RefreshCw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import {
  CLIENT_STATUS,
  CLIENT_STATUS_LABELS,
  type ClientStatusValue,
} from "@/lib/constants/client";
import { parseJsonSafe, extractErrorMessage } from "@/lib/api/fetch-utils";
import { ClientFormDialog } from "./client-form-dialog";

const STATUS_VARIANT: Record<ClientStatusValue, string> = {
  ACTIVE:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
  INACTIVE:
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/60 dark:bg-amber-500/25 dark:text-amber-100",
};

const PAGE_SIZE = 20;
const STATUS_FILTERS = ["ALL", ...CLIENT_STATUS] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number];

type InitialClient = {
  id: string;
  brand: string;
  creatorName: string;
  email: string;
  niche: string | null;
  status: ClientStatusValue;
  projects: number;
  lastContact: string;
  lastContactDate?: string | null;
  socialHandles?: Record<string, unknown> | null;
};

type ClientRow = InitialClient & {
  lastContactDate: string | null;
};

type ClientStats = {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  capacityRemaining: number;
  capacityPercentage: number;
};

type PaginationState = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasMore: boolean;
};

type ClientsApiPayload = {
  data: ApiClient[];
  pagination: PaginationState;
  stats: ClientStats;
};

type ApiClient = {
  id: string;
  brandName: string;
  creatorName: string;
  email: string;
  niche: string | null;
  status: ClientStatusValue;
  socialHandles?: Record<string, unknown> | null;
  _count?: {
    deliverables: number;
    businessPlans: number;
  };
  activities?: Array<{ createdAt: string }>;
};

type ClientsTableProps = {
  clients: InitialClient[];
};

function formatRelative(dateIso: string | null): string {
  if (!dateIso) {
    return "Never";
  }

  const date = new Date(dateIso);
  const diffMs = Date.now() - date.getTime();

  if (diffMs < 60_000) return "Just now";
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString();
}

function mapApiClientToRow(client: ApiClient): ClientRow {
  const lastContactDate = client.activities?.[0]?.createdAt ?? null;

  return {
    id: client.id,
    brand: client.brandName,
    creatorName: client.creatorName,
    email: client.email,
    niche: client.niche,
    status: client.status,
    socialHandles: client.socialHandles ?? null,
    projects:
      (client._count?.deliverables ?? 0) + (client._count?.businessPlans ?? 0),
    lastContactDate,
    lastContact: formatRelative(lastContactDate),
  };
}

export function ClientsTable({ clients: initialClients }: ClientsTableProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [rows, setRows] = useState<ClientRow[]>(() =>
    initialClients.map((client) => ({
      ...client,
      lastContactDate: client.lastContactDate ?? null,
      lastContact:
        client.lastContactDate && !client.lastContact
          ? formatRelative(client.lastContactDate)
          : client.lastContact,
    }))
  );
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    totalPages: 1,
    total: initialClients.length,
    limit: PAGE_SIZE,
    hasMore: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadClients() {
      setIsFetching(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }

      try {
        const response = await fetch(`/api/clients?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = await parseJsonSafe<ClientsApiPayload>(response);

        if (!payload) {
          throw new Error(`Empty response received (status ${response.status}).`);
        }

        if (!payload.success) {
          throw new Error(
            extractErrorMessage(payload, "Failed to load clients.")
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

        const { data: items, pagination: nextPagination, stats: nextStats } = payload.data;
        const nextRows = items.map(mapApiClientToRow);
        setRows(nextRows);
        setStats(nextStats);
        setPagination(nextPagination);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to fetch clients", error);
        toast({
          title: "Unable to load clients",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsFetching(false);
        }
      }
    }

    loadClients();

    return () => controller.abort();
  }, [page, debouncedSearch, statusFilter, refreshFlag, toast]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const isFiltered = statusFilter !== "ALL" || Boolean(debouncedSearch);
  const totalCount = isFiltered
    ? pagination.total
    : stats?.totalClients ?? pagination.total;

  const headerDescription = useMemo(() => {
    const count = totalCount;
    if (!isFiltered) {
      return `${count} client${count === 1 ? "" : "s"} tracked`;
    }

    return `${count} ${statusFilter === "ACTIVE" ? "active" : "inactive"} client${count === 1 ? "" : "s"}`;
  }, [isFiltered, statusFilter, totalCount]);

  const handleRefresh = () => {
    setRefreshFlag((value) => value + 1);
  };

  const handleDialogSuccess = (client: unknown, mode: "create" | "edit") => {
    if (client && typeof client === "object" && client !== null && "id" in client) {
      try {
        const normalized = mapApiClientToRow(client as ApiClient);

        setRows((prev) => {
          if (mode === "create") {
            return [normalized, ...prev];
          }

          return prev.map((item) => (item.id === normalized.id ? normalized : item));
        });
      } catch (error) {
        console.warn("Failed to normalize client after mutation", error);
      }
    }

    setDialogOpen(false);
    setSearch("");
    setStatusFilter("ALL");
    setPage(1);
    setRefreshFlag((value) => value + 1);
  };

  return (
    <>
      <ClientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleDialogSuccess}
      />

      <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">Clients</h1>
            <p className="text-sm text-muted-foreground">{headerDescription}</p>
          </div>
          <div className="flex items-center gap-3">
            {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="gap-2 shadow-none" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/70">Total</p>
            <p className="text-2xl font-semibold text-foreground">{stats?.totalClients ?? totalCount}</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/70">Active</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {stats?.activeClients ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/70">Inactive</p>
            <p className="text-2xl font-semibold text-amber-600">
              {stats?.inactiveClients ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/70">Capacity Remaining</p>
            <p className="text-2xl font-semibold text-foreground">
              {stats?.capacityRemaining ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats ? `${Math.round(stats.capacityPercentage)}% utilized` : "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search clients by name, brand, email, or niche"
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "ALL" ? "All statuses" : CLIENT_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 bg-muted/30">
                <TableHead className="min-w-[200px] text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Client
                </TableHead>
                <TableHead className="min-w-[150px] text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Creator
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Niche
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Projects
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Last Contact
                </TableHead>
                <TableHead className="w-[100px] text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    {debouncedSearch
                      ? isFetching
                        ? "Searching clients..."
                        : "No clients match your filters."
                      : isFetching
                      ? "Loading clients..."
                      : "No clients yet. Add your first client to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((client) => (
                  <TableRow key={client.id} className="border-border/30 transition-colors hover:bg-muted/10">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-foreground">{client.brand}</span>
                        <span className="text-xs text-muted-foreground">{client.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.creatorName}</TableCell>
                    <TableCell className="text-muted-foreground">{client.niche || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="muted"
                        size="sm"
                        className={
                          STATUS_VARIANT[client.status] ??
                          "border-border/40 bg-muted text-muted-foreground dark:bg-muted/40"
                        }
                      >
                        {CLIENT_STATUS_LABELS[client.status] ?? client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.projects}</TableCell>
                    <TableCell className="text-muted-foreground">{client.lastContact}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-xs font-medium">
                        <Link href={`/dashboard/clients/${client.id}`}>
                          View
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing {(pagination.page - 1) * PAGE_SIZE + 1}–
            {Math.min(pagination.page * PAGE_SIZE, pagination.total)} of {pagination.total} clients
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || isFetching}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || isFetching}
              onClick={() =>
                setPage((value) =>
                  value < pagination.totalPages ? value + 1 : pagination.totalPages
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

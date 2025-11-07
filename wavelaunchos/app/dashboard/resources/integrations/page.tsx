"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Link, Plus, Settings, ShieldAlert, Zap } from "lucide-react";

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

type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "Connected" | "Not Connected";
  lastSync?: string;
  logo: string;
  details: {
    scopes: string[];
    webhook?: string;
    owner?: string;
  };
};

const INTEGRATIONS: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Pipe launch alerts, deliverable approvals, and analytics highlights into team channels.",
    category: "Collaboration",
    status: "Connected",
    lastSync: "5m ago",
    logo: "SL",
    details: {
      scopes: ["chat:write", "files:read", "users:read"],
      webhook: "https://hooks.slack.com/services/T123/...",
      owner: "admin@wavelaunchos.com",
    },
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync deliverables and client notes to shared knowledge bases with backlinks.",
    category: "Knowledge",
    status: "Connected",
    lastSync: "18m ago",
    logo: "N",
    details: {
      scopes: ["pages:write", "databases:query"],
      webhook: "https://api.notion.com/v1/...",
      owner: "eddie@wavelaunchos.com",
    },
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Sync lifecycle stages, deals, and meeting notes between CRM and WaveLaunch OS.",
    category: "CRM",
    status: "Connected",
    lastSync: "42m ago",
    logo: "HS",
    details: {
      scopes: ["contacts", "deals", "tickets"],
      webhook: "https://api.hubspot.com/oauth/v1/...",
      owner: "ops@blueharbor.ai",
    },
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows, trigger deliverable creation, and sync analytics to spreadsheets.",
    category: "Automation",
    status: "Not Connected",
    logo: "ZP",
    details: {
      scopes: ["deliverables.write", "analytics.read"],
    },
  },
];

const FILTERS = ["All", "Connected", "Not Connected"] as const;

const STATUS_VARIANTS: Record<Integration["status"], string> = {
  Connected:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
  "Not Connected":
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/60 dark:bg-amber-500/25 dark:text-amber-100",
};

export default function IntegrationsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return INTEGRATIONS;
    return INTEGRATIONS.filter((integration) => integration.status === filter);
  }, [filter]);

  const activeIntegration = activeId
    ? INTEGRATIONS.find((integration) => integration.id === activeId) ?? null
    : null;

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Connect WaveLaunch OS to your tooling ecosystem for seamless workflows.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
            Add integration
          </Button>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
            Manage API keys
          </Button>
        </div>
      </header>

      <div className="rounded-xl border border-border/50 bg-card/80 p-3 sm:p-4">
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
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((integration) => (
          <Card key={integration.id} className="border-border/60 bg-card/90 shadow-none">
            <CardHeader className="flex flex-row items-start gap-3 space-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-muted/20 text-sm font-semibold">
                {integration.logo}
              </div>
              <div className="flex-1 space-y-2">
                <CardTitle className="text-base font-semibold text-foreground">{integration.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {integration.description}
                </CardDescription>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="muted" size="sm" className="px-2">
                    {integration.category}
                  </Badge>
                  <Badge
                    variant="muted"
                    size="sm"
                    className={`${STATUS_VARIANTS[integration.status]} px-2`}
                  >
                    {integration.status}
                  </Badge>
                  {integration.lastSync && <span>Synced {integration.lastSync}</span>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
              <Button
                variant={integration.status === "Connected" ? "outline" : "default"}
                size="sm"
                className="gap-2 border-border/60 text-xs"
              >
                {integration.status === "Connected" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Manage
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
              <Sheet key={integration.id}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setActiveId(integration.id)}
                  >
                    <Link className="h-4 w-4" />
                    View details
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full space-y-6 border-border bg-secondary/60 backdrop-blur-sm sm:max-w-lg">
                  <SheetHeader className="space-y-2 text-left">
                    <SheetTitle className="flex items-center gap-3 text-lg font-semibold">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-muted/20 text-sm font-semibold">
                        {activeIntegration?.logo ?? integration.logo}
                      </span>
                      {activeIntegration?.name ?? integration.name}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">
                      {activeIntegration?.description ?? integration.description}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Status</p>
                        <p className="text-foreground">{activeIntegration?.status ?? integration.status}</p>
                      </div>
                      <Badge
                        variant="muted"
                        size="sm"
                        className={`${STATUS_VARIANTS[activeIntegration?.status ?? integration.status]} px-3`}
                      >
                        {activeIntegration?.status ?? integration.status}
                      </Badge>
                    </div>
                    {activeIntegration?.details.owner && (
                      <div className="rounded-lg border border-border/50 bg-muted/10 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Owner</p>
                        <p className="text-foreground">{activeIntegration.details.owner}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Scopes</p>
                      <div className="flex flex-wrap gap-2">
                        {(activeIntegration?.details.scopes ?? integration.details.scopes).map((scope) => (
                          <Badge key={scope} variant="muted" size="sm" className="px-2">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {activeIntegration?.details.webhook && (
                      <div className="rounded-lg border border-border/50 bg-muted/10 p-3 text-xs">
                        <p className="uppercase tracking-wide text-muted-foreground/70">Webhook URL</p>
                        <p className="mt-1 truncate font-mono text-foreground">{activeIntegration.details.webhook}</p>
                      </div>
                    )}
                    <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
                      <ShieldAlert className="h-4 w-4" />
                      Regenerate credentials
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="col-span-full border-dashed border-border/60 bg-muted/10 py-12 text-center shadow-none">
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">No integrations match this filter yet.</p>
              <p>Browse the marketplace or build a custom integration using our APIs.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

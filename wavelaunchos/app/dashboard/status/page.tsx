"use client";

import { useMemo, useState } from "react";
import { Activity, AlertTriangle, Bell, CheckCircle, Clock, CloudLightning, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_COLORS: Record<string, string> = {
  Operational:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/25 dark:text-emerald-100",
  Degraded:
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-400/60 dark:bg-amber-500/25 dark:text-amber-100",
  Outage:
    "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-400/60 dark:bg-rose-500/25 dark:text-rose-100",
};

const SERVICES = [
  { id: "api", name: "Core API", description: "Authentication, GraphQL, and automations", status: "Operational", icon: Activity },
  { id: "files", name: "File Uploads", description: "Assets, deliverables, and brand kits", status: "Operational", icon: CloudLightning },
  { id: "chat", name: "Chat & Collaboration", description: "Client messaging and notes", status: "Operational", icon: Server },
  { id: "analytics", name: "Analytics Processing", description: "Dashboards, metrics, and exports", status: "Degraded", icon: Activity },
  { id: "billing", name: "Billing", description: "Invoices and subscription management", status: "Operational", icon: CheckCircle },
];

const INCIDENTS = [
  {
    id: "incident-1",
    title: "Analytics processing delay",
    severity: "Moderate",
    status: "Monitoring",
    start: "01:45 UTC",
    resolved: "03:10 UTC",
    summary: "Background analytics workers experienced elevated latency due to increased ingestion volume.",
    updates: [
      { time: "03:10 UTC", text: "Workers have been scaled vertically and queues are draining normally." },
      { time: "02:25 UTC", text: "Provisioned additional compute to clear backlog across regions." },
      { time: "01:45 UTC", text: "Investigating reports of delayed dashboard refreshes for EU tenants." },
    ],
  },
  {
    id: "incident-0",
    title: "Scheduled maintenance",
    severity: "Low",
    status: "Completed",
    start: "Yesterday",
    resolved: "Yesterday",
    summary: "Proactive maintenance performed on file storage replication. No downtime reported.",
    updates: [
      { time: "05:00 UTC", text: "Maintenance completed successfully with no service interruptions." },
      { time: "03:00 UTC", text: "Maintenance window initiated." },
    ],
  },
];

const HISTORY = [
  { date: "Nov 06", status: "Operational" },
  { date: "Nov 05", status: "Operational" },
  { date: "Nov 04", status: "Degraded" },
  { date: "Nov 03", status: "Operational" },
  { date: "Nov 02", status: "Operational" },
  { date: "Nov 01", status: "Operational" },
  { date: "Oct 31", status: "Operational" },
];

export default function StatusPage() {
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(INCIDENTS[0]?.id ?? null);

  const activeIncident = useMemo(() => INCIDENTS.find((incident) => incident.id === activeIncidentId) ?? INCIDENTS[0], [activeIncidentId]);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">System Status</h1>
          <p className="text-sm text-muted-foreground">Monitor real-time uptime across WaveLaunch OS services.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="muted"
            size="sm"
            className={`${STATUS_COLORS.Operational} px-3`}
          >
            Overall: Operational
          </Badge>
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            Subscribe to updates
          </Button>
        </div>
      </header>

      <Card className="border-border/60 bg-card/80 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Service health</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Live indicators for every core subsystem.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.id} className="flex items-start justify-between rounded-lg border border-border/40 bg-muted/10 p-4">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <service.icon className="h-4 w-4 text-muted-foreground" />
                  {service.name}
                </p>
                <p className="text-xs text-muted-foreground">{service.description}</p>
              </div>
              <Badge
                variant="muted"
                size="sm"
                className={`${STATUS_COLORS[service.status]} px-3`}
              >
                {service.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue={activeIncident?.id ?? INCIDENTS[0]?.id} value={activeIncident?.id} className="space-y-4" onValueChange={setActiveIncidentId}>
        <TabsList className="flex w-full flex-wrap items-center gap-2 bg-muted/30 p-1">
          {INCIDENTS.map((incident) => (
            <TabsTrigger key={incident.id} value={incident.id} className="rounded-full px-4 text-xs">
              {incident.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {INCIDENTS.map((incident) => (
          <TabsContent key={incident.id} value={incident.id} className="space-y-4">
            <Card className="border-border/60 bg-card/80 shadow-none">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant="muted"
                    size="sm"
                    className={`${STATUS_COLORS[incident.status === "Monitoring" ? "Degraded" : "Operational"]} px-2`}
                  >
                    {incident.status}
                  </Badge>
                  <span className="flex items-center gap-1 text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5" /> Severity: {incident.severity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {incident.start} → {incident.resolved}
                  </span>
                </div>
                <CardTitle className="text-base font-semibold text-foreground">{incident.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{incident.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {incident.updates.map((update) => (
                    <div key={update.time} className="flex gap-4">
                      <div className="w-24 shrink-0 text-xs text-muted-foreground">{update.time}</div>
                      <p className="flex-1 text-sm text-foreground/90">{update.text}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="border-border/60 text-muted-foreground hover:text-foreground">
                  View full incident timeline
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="border-border/60 bg-card/80 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Uptime history</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Daily status snapshots from the past week.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-7">
          {HISTORY.map((entry) => (
            <div key={entry.date} className="space-y-2 rounded-lg border border-border/40 bg-muted/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">{entry.date}</p>
              <Badge
                variant="muted"
                size="sm"
                className={`${STATUS_COLORS[entry.status]} px-3`}
              >
                {entry.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator className="bg-border/60" />
      <p className="text-center text-xs text-muted-foreground">
        Need a copy for audits? Export system logs or subscribe to our public status feed.
      </p>
    </div>
  );
}

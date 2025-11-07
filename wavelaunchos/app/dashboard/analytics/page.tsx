"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const TIMEFRAMES = ["7D", "30D", "90D"] as const;

const KPI_DATA = [
  { id: "revenue", label: "Revenue", value: "$128,450", delta: "+12.4%", positive: true },
  { id: "leads", label: "Leads", value: "864", delta: "+6.8%", positive: true },
  { id: "engagement", label: "Engagement Rate", value: "48%", delta: "+2.1%", positive: true },
  { id: "response", label: "Avg Response Time", value: "1h 12m", delta: "-18%", positive: true },
];

const PERFORMANCE_TRENDS = {
  "7D": [
    { day: "Mon", value: 4200 },
    { day: "Tue", value: 4800 },
    { day: "Wed", value: 5300 },
    { day: "Thu", value: 5100 },
    { day: "Fri", value: 5900 },
    { day: "Sat", value: 5600 },
    { day: "Sun", value: 6400 },
  ],
  "30D": Array.from({ length: 30 }, (_, index) => ({ day: index + 1, value: 3200 + index * 90 + Math.random() * 600 })),
  "90D": Array.from({ length: 12 }, (_, index) => ({ day: `W${index + 1}`, value: 2800 + index * 220 + Math.random() * 700 })),
};

const TOP_CLIENTS = [
  { name: "Acme Studios", revenue: 42000, projects: 12 },
  { name: "Blue Harbor AI", revenue: 38800, projects: 15 },
  { name: "Lumen Ventures", revenue: 25500, projects: 9 },
  { name: "Northwind Labs", revenue: 21400, projects: 6 },
];

const ENGAGEMENT_BREAKDOWN = [
  { source: "Email", value: 38 },
  { source: "Chat", value: 27 },
  { source: "Portal", value: 20 },
  { source: "Referrals", value: 15 },
];

const DETAIL_ROWS = [
  {
    client: "Acme Studios",
    leads: 142,
    engagement: "52%",
    response: "58m",
    conversion: "4.1%",
  },
  {
    client: "Blue Harbor AI",
    leads: 128,
    engagement: "48%",
    response: "1h 05m",
    conversion: "3.8%",
  },
  {
    client: "Lumen Ventures",
    leads: 94,
    engagement: "43%",
    response: "1h 24m",
    conversion: "3.2%",
  },
  {
    client: "Northwind Labs",
    leads: 88,
    engagement: "39%",
    response: "1h 46m",
    conversion: "2.9%",
  },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<(typeof TIMEFRAMES)[number]>("30D");

  const trendData = useMemo(() => PERFORMANCE_TRENDS[timeframe], [timeframe]);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Visualize campaign performance, client engagement, and team response trends.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            type="single"
            value={timeframe}
            onValueChange={(value) => value && setTimeframe(value as (typeof TIMEFRAMES)[number])}
            className="rounded-full border border-border/60 bg-muted/30 p-1"
          >
            {TIMEFRAMES.map((value) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className="rounded-full px-4 text-xs font-semibold uppercase tracking-wide"
              >
                Last {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KPI_DATA.map((kpi) => (
          <Card key={kpi.id} className="border-border/60 bg-card/80 shadow-none">
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{kpi.label}</CardTitle>
              <div className="text-2xl font-semibold tracking-tight text-foreground">{kpi.value}</div>
            </CardHeader>
            <CardContent className="text-xs">
              <Badge
                variant="outline"
                className={`rounded-full px-2 py-1 text-[11px] ${
                  kpi.positive
                    ? "border-emerald-500/60 bg-emerald-500/25 text-black/70 dark:text-emerald-50"
                    : "border-rose-500/60 bg-rose-500/25 text-black/70 dark:text-rose-50"
                }`}
              >
                {kpi.delta}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border-border/60 bg-card/80 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">Performance Trend</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Rolling campaign activity aggregated for the selected timeframe.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(96 165 250)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="rgb(96 165 250)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="day" stroke="rgba(148, 163, 184, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148, 163, 184, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: "rgba(148, 163, 184, 0.2)" }}
                  contentStyle={{ background: "rgba(15, 23, 42, 0.92)", borderRadius: 12, border: "1px solid rgba(148, 163, 184, 0.25)" }}
                />
                <Area type="monotone" dataKey="value" stroke="rgb(96 165 250)" strokeWidth={2} fill="url(#trend)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">Engagement Breakdown</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Channels driving the highest client touchpoints.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-[320px] flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENGAGEMENT_BREAKDOWN}>
                <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="source" stroke="rgba(148, 163, 184, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148, 163, 184, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(96, 165, 250, 0.08)" }}
                  contentStyle={{ background: "rgba(15, 23, 42, 0.92)", borderRadius: 12, border: "1px solid rgba(148, 163, 184, 0.25)" }}
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {ENGAGEMENT_BREAKDOWN.map((entry) => (
                    <Cell
                      key={entry.source}
                      fill="rgba(96, 165, 250, 0.7)"
                      className="transition-opacity hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/80 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground">Top Performing Clients</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Revenue contribution and pipeline depth by account.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[320px] pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TOP_CLIENTS}>
              <CartesianGrid strokeDasharray="3 6" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="rgba(148, 163, 184, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(148, 163, 184, 0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "rgba(15, 23, 42, 0.92)", borderRadius: 12, border: "1px solid rgba(148, 163, 184, 0.25)" }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="rgb(94 234 212)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="projects" name="Active Projects" stroke="rgb(249 115 22)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground">Client Metrics</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Drill into engagement trends and conversion signals per account.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Client</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Leads</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Engagement Rate
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Response</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DETAIL_ROWS.map((row) => (
                <TableRow key={row.client} className="border-border/30 transition-colors hover:bg-muted/10">
                  <TableCell className="font-medium text-foreground">{row.client}</TableCell>
                  <TableCell className="text-muted-foreground">{row.leads}</TableCell>
                  <TableCell className="text-muted-foreground">{row.engagement}</TableCell>
                  <TableCell className="text-muted-foreground">{row.response}</TableCell>
                  <TableCell className="text-muted-foreground">{row.conversion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

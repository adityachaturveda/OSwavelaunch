"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, Info, MessageCircle, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FILTERS = ["All", "Unread", "System", "Client Activity"] as const;

const NOTIFICATIONS = [
  {
    id: "1",
    title: "New deliverable feedback",
    body: "Alicia Barr left review notes on the " + "Executive Summary" + " section.",
    timestamp: "12m ago",
    type: "Client Activity" as const,
    unread: true,
    icon: MessageCircle,
  },
  {
    id: "2",
    title: "Analytics digest ready",
    body: "Week-over-week performance report compiled and ready for export.",
    timestamp: "1h ago",
    type: "System" as const,
    unread: false,
    icon: Info,
  },
  {
    id: "3",
    title: "Plan milestone reached",
    body: "Acme Studios reached 80% completion on their launch roadmap.",
    timestamp: "Yesterday",
    type: "Client Activity" as const,
    unread: false,
    icon: Star,
  },
  {
    id: "4",
    title: "Invoice paid",
    body: "Blue Harbor AI completed payment for Invoice #2189.",
    timestamp: "2d ago",
    type: "System" as const,
    unread: false,
    icon: CheckCircle2,
  },
  {
    id: "5",
    title: "System reminder",
    body: "Weekly backup job completed successfully with 0 warnings.",
    timestamp: "3d ago",
    type: "System" as const,
    unread: false,
    icon: Bell,
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filteredNotifications = useMemo(() => {
    if (filter === "All") return NOTIFICATIONS;
    if (filter === "Unread") return NOTIFICATIONS.filter((notification) => notification.unread);
    return NOTIFICATIONS.filter((notification) => notification.type === filter);
  }, [filter]);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Review system alerts, client activity, and task reminders in one place.
          </p>
        </div>
        <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
          <CheckCircle2 className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/70 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item}
              variant={item === filter ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full px-3 text-xs font-semibold"
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`border-border/50 bg-card/80 shadow-none transition-colors hover:border-border ${
              notification.unread ? "border-primary/40" : ""
            }`}
          >
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-muted/10">
                <notification.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-sm font-semibold text-foreground">{notification.title}</CardTitle>
                  {notification.unread && (
                    <Badge variant="outline" className="rounded-full px-2 text-[11px] text-emerald-300">
                      New
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm text-muted-foreground">{notification.body}</CardDescription>
              </div>
              <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full px-2 text-[11px]">
                  {notification.type}
                </Badge>
                <span className="flex items-center gap-1 text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Priority: Medium
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground">
                View details
              </Button>
            </CardContent>
          </Card>
        ))}

        {filteredNotifications.length === 0 && (
          <Card className="border-dashed border-border/60 bg-muted/10 py-12 text-center shadow-none">
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">No notifications here yet.</p>
              <p>Once activity matches this filter, we’ll surface alerts instantly.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Separator className="bg-border/60" />
      <p className="text-center text-xs text-muted-foreground">
        Notifications are retained for 30 days. Export activity from the Analytics page for longer history.
      </p>
    </div>
  );
}

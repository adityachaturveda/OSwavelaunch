"use client";

import { useMemo, useState } from "react";
import { HelpCircle, MessageCircleQuestion, Search, Send, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const TOPICS = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Set up your first workspace, onboard teammates, and import clients in minutes.",
    articles: 8,
  },
  {
    id: "billing",
    title: "Billing & Plans",
    description: "Manage subscriptions, invoices, and payment methods for your organization.",
    articles: 5,
  },
  {
    id: "automation",
    title: "Automation",
    description: "Trigger workflows, connect integrations, and streamline recurring tasks.",
    articles: 11,
  },
  {
    id: "deliverables",
    title: "Deliverables",
    description: "Create, review, and ship proposals with annotated feedback loops.",
    articles: 9,
  },
];

const FAQS = [
  {
    question: "How do I invite clients to a live project?",
    answer: "Navigate to Clients → Invite, choose the client, and grant reviewer access with a single click.",
  },
  {
    question: "Where can I find past invoices?",
    answer: "Open Settings → Billing to download historical invoices and export CSV summaries.",
  },
  {
    question: "Can I export analytics dashboards?",
    answer: "Yes — visit Analytics and click Export CSV to generate a shareable download instantly.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const visibleTopics = useMemo(() => {
    if (!query.trim()) return TOPICS;
    const normalized = query.toLowerCase();
    return TOPICS.filter((topic) => topic.title.toLowerCase().includes(normalized) || topic.description.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Help Center</h1>
          <p className="text-sm text-muted-foreground">Find guides, best practices, and support resources for WaveLaunch OS.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <MessageCircleQuestion className="h-4 w-4" />
            Start chat
          </Button>
          <Button className="gap-2 shadow-none">
            <Send className="h-4 w-4" />
            Contact support
          </Button>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="How can we help? Try 'billing', 'templates', or 'automation'."
          className="h-14 rounded-2xl border-border/60 bg-muted/30 pl-12 text-base shadow-none"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Topics</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleTopics.map((topic) => (
              <Card key={topic.id} className="border-border/60 bg-card/90 shadow-none transition-colors hover:border-border">
                <CardHeader className="space-y-3">
                  <Badge variant="outline" className="w-fit rounded-full px-3 text-xs text-muted-foreground">
                    {topic.articles} articles
                  </Badge>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <Button variant="ghost" className="h-8 px-0 text-xs text-foreground">
                    Browse articles ↗
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {visibleTopics.length === 0 && (
            <Card className="border-dashed border-border/60 bg-muted/10 py-12 text-center shadow-none">
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">No topics matched "{query}" yet.</p>
                <p>Try another keyword or reach out to our support specialists.</p>
              </CardContent>
            </Card>
          )}
        </section>

        <aside className="flex flex-col gap-4">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-base font-semibold">System updates</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Review recent releases and maintenance windows impacting your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/10 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-400" />
                <div>
                  <p className="font-medium text-foreground">No active incidents</p>
                  <p className="text-xs text-muted-foreground">WaveLaunch OS is operating at optimal performance.</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="px-0 text-xs text-muted-foreground hover:text-foreground">
                View status page ↗
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-base font-semibold">Popular questions</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Quick answers to frequently asked questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {FAQS.map((faq) => (
                <div key={faq.question} className="space-y-1">
                  <p className="font-medium text-foreground">{faq.question}</p>
                  <p className="text-xs text-muted-foreground/80">{faq.answer}</p>
                </div>
              ))}
              <Separator className="bg-border/60" />
              <Button variant="outline" size="sm" className="w-full border-border/60 text-muted-foreground hover:text-foreground">
                Browse full knowledge base
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

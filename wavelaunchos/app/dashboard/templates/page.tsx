"use client";

import { useMemo, useState } from "react";
import { Plus, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["All", "Pitch Deck", "Email", "Proposal", "Workflow"] as const;

const TEMPLATES = [
  {
    id: "growth-pitch",
    title: "Growth Pitch Deck",
    description: "Narrative-driven deck for fundraising updates.",
    category: "Pitch Deck",
    usage: 42,
    updated: "2d ago",
  },
  {
    id: "client-onboarding",
    title: "Client Onboarding Flow",
    description: "Step-by-step kickoff workflow for new accounts.",
    category: "Workflow",
    usage: 25,
    updated: "5d ago",
  },
  {
    id: "retainer-proposal",
    title: "Retainer Proposal",
    description: "Proposal template tailored for creative retainers.",
    category: "Proposal",
    usage: 31,
    updated: "1w ago",
  },
  {
    id: "post-launch",
    title: "Post-launch Email Series",
    description: "3-part nurture sequence for new feature announcements.",
    category: "Email",
    usage: 18,
    updated: "3d ago",
  },
];

export default function TemplatesPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return TEMPLATES.filter((template) => {
      const matchesCategory = category === "All" || template.category === category;
      const matchesQuery =
        !normalized || template.title.toLowerCase().includes(normalized) || template.description.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Curate reusable pitch decks, outreach flows, and onboarding docs for your team.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="gap-2 shadow-none">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search</p>
            <Input
              placeholder="Search templates"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-muted/40"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</p>
            <Select value={category} onValueChange={(value) => setCategory(value as (typeof CATEGORIES)[number])}>
              <SelectTrigger className="border-border/60 bg-muted/30">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="border-border/60 bg-card/90">
                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item} className="text-sm">
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group border-border/60 bg-card/90 shadow-none transition-colors hover:border-border">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className="rounded-full px-3 text-xs text-muted-foreground">
                    {template.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{template.updated}</span>
                </div>
                <CardTitle className="text-base font-semibold text-foreground line-clamp-2">{template.title}</CardTitle>
                <CardDescription className="line-clamp-3 text-sm text-muted-foreground">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{template.usage} uses</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredTemplates.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-border/60 bg-muted/10 py-12 text-center text-sm text-muted-foreground">
              No templates match that filter combo yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

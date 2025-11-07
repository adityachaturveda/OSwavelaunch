import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type SectionCardMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
  subheading: string;
  description: string;
};

export function SectionCards({ metrics }: { metrics: SectionCardMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          className="rounded-xl border border-border bg-card/95 p-6 shadow-none"
        >
          <CardHeader className="space-y-2 p-0">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums text-foreground">
              {metric.value}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-0 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{metric.subheading}</span>
              {metric.isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-400" />
              )}
              <span className="font-medium text-foreground">{metric.delta}</span>
            </div>
            <p>{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

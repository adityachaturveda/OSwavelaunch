"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  total: {
    label: "Total Visitors",
    color: "#ffffff",
  },
} satisfies ChartConfig

type ChartAreaInteractiveProps = {
  data: Array<{ date: string; desktop: number; mobile: number }>;
};

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const processedData = filteredData.map((item) => ({
    date: item.date,
    total: item.desktop + item.mobile,
  }))

  return (
    <Card className="@container/card rounded-xl border border-border bg-card/90 p-6 shadow-none">
      <CardHeader className="relative space-y-1 p-0 pb-6">
        <CardTitle className="text-lg font-semibold text-foreground">Total Visitors</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Traffic trend across desktop and mobile sessions
        </CardDescription>
        <div className="absolute right-0 top-0 flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            className="@[640px]/card:flex hidden"
          >
            <ToggleGroupItem
              value="90d"
              className="h-8 rounded-full border border-transparent px-3 text-xs uppercase tracking-wide text-muted-foreground transition-colors data-[state=on]:border-border data-[state=on]:bg-muted/60 data-[state=on]:text-foreground"
            >
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem
              value="30d"
              className="h-8 rounded-full border border-transparent px-3 text-xs uppercase tracking-wide text-muted-foreground transition-colors data-[state=on]:border-border data-[state=on]:bg-muted/60 data-[state=on]:text-foreground"
            >
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem
              value="7d"
              className="h-8 rounded-full border border-transparent px-3 text-xs uppercase tracking-wide text-muted-foreground transition-colors data-[state=on]:border-border data-[state=on]:bg-muted/60 data-[state=on]:text-foreground"
            >
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[640px]/card:hidden flex w-36 border-border/60 bg-transparent text-xs uppercase tracking-wide"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border bg-background/95">
              <SelectItem value="90d" className="rounded-lg text-sm">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg text-sm">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg text-sm">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4 pb-6">
        <ChartContainer
          config={chartConfig}
          className="w-full h-[200px] sm:h-[240px] lg:h-[300px]"
        >
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(59, 130, 246, 0.35)" />
                <stop offset="95%" stopColor="rgba(59, 130, 246, 0.05)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#1f1f1f" strokeDasharray="3 6" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              stroke="#4b5563"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={{ stroke: "#303030", strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                  className="border border-border bg-background/90"
                />
              }
            />
            <Area
              dataKey="total"
              type="monotone"
              fill="url(#fillTotal)"
              stroke="#3b82f6"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

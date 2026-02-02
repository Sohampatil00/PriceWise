"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  optimized: {
    label: "Optimized",
    color: "hsl(var(--primary))",
  },
  baseline: {
    label: "Baseline",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(value) => `$${value / 1000}k`}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Legend />
        <Bar dataKey="baseline" fill="var(--color-baseline)" radius={4} />
        <Bar dataKey="optimized" fill="var(--color-optimized)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

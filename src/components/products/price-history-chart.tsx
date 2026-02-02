"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function PriceHistoryChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig}>
        <AreaChart
            accessibilityLayer
            data={data}
            margin={{
            left: 12,
            right: 12,
            }}
        >
            <CartesianGrid vertical={false} />
            <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(5)} // Show month-day
            />
            <YAxis 
                domain={['dataMin - 10', 'dataMax + 10']}
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
            />
            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <defs>
            <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                offset="5%"
                stopColor="var(--color-price)"
                stopOpacity={0.8}
                />
                <stop
                offset="95%"
                stopColor="var(--color-price)"
                stopOpacity={0.1}
                />
            </linearGradient>
            </defs>
            <Area
            dataKey="price"
            type="natural"
            fill="url(#fillPrice)"
            fillOpacity={0.4}
            stroke="var(--color-price)"
            stackId="a"
            />
        </AreaChart>
        </ChartContainer>
    </div>
  )
}

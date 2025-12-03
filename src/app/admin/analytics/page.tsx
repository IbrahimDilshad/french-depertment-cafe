"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart, Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { dailyRevenue, popularItems, classSales } from "@/lib/placeholder-data";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  count: {
    label: "Count",
    color: "hsl(var(--accent))",
  }
};

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">Sales Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
            <CardDescription>Revenue over the last 5 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={dailyRevenue} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis strokeDasharray="3 3" />
                <Tooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke={chartConfig.revenue.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Items</CardTitle>
            <CardDescription>Top-selling items.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={popularItems} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid horizontal={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={100} />
                    <XAxis type="number" dataKey="count" />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill={chartConfig.count.color} radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Class</CardTitle>
          <CardDescription>Breakdown of sales across different student grades and staff.</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={{}} className="h-[350px] w-full">
            <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="sales" />} />
                <Pie
                    data={classSales}
                    dataKey="sales"
                    nameKey="class"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    labelLine={false}
                    label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index,
                    }) => {
                        const RADIAN = Math.PI / 180
                        const radius = 25 + innerRadius + (outerRadius - innerRadius)
                        const x = cx + radius * Math.cos(-midAngle * RADIAN)
                        const y = cy + radius * Math.sin(-midAngle * RADIAN)

                        return (
                        <text
                            x={x}
                            y={y}
                            fill="hsl(var(--foreground))"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            className="text-xs"
                        >
                            {classSales[index].class} ({value})
                        </text>
                        )
                    }}
                >
                {classSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
           </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui";
import type { ApplicationTrendPoint } from "@/types/analytics.types";

type ApplicationTrendsChartProps = {
  data: ApplicationTrendPoint[];
};

const chartTooltipProps = {
  contentStyle: {
    backgroundColor: "var(--chart-tooltip-background)",
    borderColor: "var(--border)",
    color: "var(--chart-tooltip-foreground)",
  },
  labelStyle: { color: "var(--chart-tooltip-foreground)" },
  itemStyle: { color: "var(--chart-tooltip-foreground)" },
};

export default function ApplicationTrendsChart({
  data,
}: ApplicationTrendsChartProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Application Trends
          </h2>
          <p className="mt-1 text-sm text-muted">
            Compare applications received against job views.
          </p>
        </div>
      }
      contentClassName="p-4 sm:p-5"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted)" }} />
            <Tooltip {...chartTooltipProps} />
            <Legend wrapperStyle={{ color: "var(--foreground)" }} />
            <Bar
              dataKey="views"
              name="Job views"
              fill="#93c5fd"
              radius={[6, 6, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="applications"
              name="Applications"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

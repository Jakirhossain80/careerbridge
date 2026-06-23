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
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
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

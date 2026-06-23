"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui";
import type { CategoryAnalytics } from "@/types/analytics.types";

type JobsByCategoryChartProps = {
  data: CategoryAnalytics[];
};

export default function JobsByCategoryChart({
  data,
}: JobsByCategoryChartProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Jobs by Category
          </h2>
          <p className="mt-1 text-sm text-muted">
            Application share across your active job categories.
          </p>
        </div>
      }
      contentClassName="p-4 sm:p-5"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="category"
              width={92}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Bar
              dataKey="percentage"
              name="Share"
              fill="#10b981"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

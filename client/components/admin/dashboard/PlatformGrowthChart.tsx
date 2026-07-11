"use client";

import {
  Bar,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardSection from "@/components/dashboard/DashboardSection";
import type { PlatformGrowthPoint } from "@/types/admin-dashboard.types";

type PlatformGrowthChartProps = {
  data: PlatformGrowthPoint[];
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

export default function PlatformGrowthChart({ data }: PlatformGrowthChartProps) {
  const hasData = data.some(
    (point) => point.newUsers > 0 || point.jobPostings > 0,
  );

  return (
    <DashboardSection
      title="Platform Growth"
      description="User registrations compared with job postings."
      className="min-w-0"
    >
      <div className="relative h-80">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 12, left: -24, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)" }} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: "var(--muted)" }} />
              <Tooltip {...chartTooltipProps} />
              <Bar
                dataKey="jobPostings"
                name="Job postings"
                fill="#93c5fd"
                radius={[6, 6, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                name="New users"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : null}

        {!hasData ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-lg border border-slate-200 bg-surface/90 px-4 py-3 text-center shadow-sm dark:border-slate-700">
              <p className="text-sm font-semibold text-foreground">
                No growth data yet
              </p>
              <p className="mt-1 text-xs text-muted">
                Trends will update as users and jobs are created.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardSection>
  );
}

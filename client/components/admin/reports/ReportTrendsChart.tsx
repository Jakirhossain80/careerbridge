"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardSection from "@/components/dashboard/DashboardSection";
import type { AdminReportAnalytics } from "@/types/admin-report";

type ReportTrendsChartProps = {
  trends?: AdminReportAnalytics["trends"];
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

function formatLabel(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

export default function ReportTrendsChart({ trends = [] }: ReportTrendsChartProps) {
  const data = trends.map((item) => ({
    ...item,
    label: formatLabel(item.date),
  }));

  return (
    <DashboardSection
      title="Reporting Trends Last 7 Days"
      description="Daily report volume across moderation queues."
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)" }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted)" }} />
            <Tooltip {...chartTooltipProps} />
            <Area type="monotone" dataKey="count" name="Reports" stroke="#2563eb" fill="#dbeafe" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardSection>
  );
}

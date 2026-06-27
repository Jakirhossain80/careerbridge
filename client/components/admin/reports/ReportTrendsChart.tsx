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
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="count" name="Reports" stroke="#2563eb" fill="#dbeafe" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardSection>
  );
}

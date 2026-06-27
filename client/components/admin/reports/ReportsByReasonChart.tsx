"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import DashboardSection from "@/components/dashboard/DashboardSection";
import type { AdminReportAnalytics } from "@/types/admin-report";
import { formatReportLabel } from "./report-formatters";

type ReportsByReasonChartProps = {
  reasons?: AdminReportAnalytics["reasonDistribution"];
};

const colors = ["#2563eb", "#10b981", "#6366f1", "#f59e0b", "#ef4444", "#14b8a6", "#64748b"];

export default function ReportsByReasonChart({
  reasons = [],
}: ReportsByReasonChartProps) {
  return (
    <DashboardSection
      title="Reports by Reason"
      description="Distribution of complaints by moderation reason."
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Pie data={reasons} dataKey="count" nameKey="reason" innerRadius={54} outerRadius={96} paddingAngle={2}>
              {reasons.map((item, index) => (
                <Cell key={item.reason} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {reasons.slice(0, 6).map((item, index) => (
          <div key={item.reason} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 capitalize text-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              {formatReportLabel(item.reason)}
            </span>
            <span className="text-muted">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}

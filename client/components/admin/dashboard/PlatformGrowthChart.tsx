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

export default function PlatformGrowthChart({ data }: PlatformGrowthChartProps) {
  return (
    <DashboardSection
      title="Platform Growth"
      description="User registrations compared with job postings."
      className="min-w-0"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 12, left: -24, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
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
      </div>
    </DashboardSection>
  );
}

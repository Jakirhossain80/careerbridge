import type { AdminDashboardData } from "@/types/admin-dashboard.types";

export const mockAdminDashboardData: AdminDashboardData = {
  metrics: [
    {
      key: "total-users",
      label: "Total Users",
      value: 0,
      trend: "neutral",
      tone: "primary",
    },
    {
      key: "employers",
      label: "Employers",
      value: 0,
      trend: "neutral",
      tone: "secondary",
    },
    {
      key: "active-jobs",
      label: "Active Jobs",
      value: 0,
      trend: "neutral",
      tone: "tertiary",
    },
    {
      key: "pending-reports",
      label: "Pending Reports",
      value: 0,
      trend: "neutral",
      tone: "danger",
    },
  ],
  platformGrowth: [
    { label: "Jan", newUsers: 18, jobPostings: 9 },
    { label: "Feb", newUsers: 24, jobPostings: 13 },
    { label: "Mar", newUsers: 31, jobPostings: 16 },
    { label: "Apr", newUsers: 39, jobPostings: 22 },
    { label: "May", newUsers: 46, jobPostings: 27 },
    { label: "Jun", newUsers: 52, jobPostings: 31 },
  ],
  pendingApprovals: [],
  recentActivity: [],
  systemHealth: {
    status: "operational",
    activeUsers: 0,
    recentEvents: 0,
  },
};

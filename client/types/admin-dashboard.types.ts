export type AdminDashboardMetric = {
  key: string;
  label: string;
  value: number | string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  tone?: "primary" | "secondary" | "tertiary" | "danger" | "neutral";
};

export type PlatformGrowthPoint = {
  label: string;
  newUsers: number;
  jobPostings: number;
};

export type PendingApprovalItem = {
  _id: string;
  type: "employer" | "job";
  title: string;
  subtitle?: string;
  logo?: string;
  createdAt?: string;
};

export type AdminActivityItem = {
  _id: string;
  action: string;
  entity: string;
  timestamp: string;
  status: "pending" | "flagged" | "approved" | "blocked" | "resolved" | "info";
  detailsLabel?: string;
  detailsHref?: string;
};

export type AdminDashboardData = {
  metrics: AdminDashboardMetric[];
  platformGrowth: PlatformGrowthPoint[];
  pendingApprovals: PendingApprovalItem[];
  recentActivity: AdminActivityItem[];
  systemHealth?: {
    status: "operational" | "degraded" | "maintenance" | "down";
    activeUsers?: number;
    recentEvents?: number;
  };
};

export type AnalyticsDateRange =
  | "last_30_days"
  | "six_months"
  | "one_year"
  | "custom";

export type AnalyticsTrend = "up" | "down" | "neutral";

export interface AnalyticsMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: AnalyticsTrend;
}

export interface ApplicationTrendPoint {
  label: string;
  applications: number;
  views: number;
}

export interface CategoryAnalytics {
  category: string;
  percentage: number;
  count: number;
}

export interface TopPerformingJob {
  jobId: string;
  title: string;
  category: string;
  workMode?: string;
  status: "active" | "closed" | "draft" | "archived";
  totalViews: number;
  applications: number;
  conversionRate: number;
}

export interface RecruitmentFunnelStage {
  label: string;
  count: number;
  percentage: number;
}

export interface EmployerAnalyticsFilters {
  dateRange: AnalyticsDateRange;
  jobId?: string;
  status?: string;
  search?: string;
}

export interface EmployerAnalyticsOverview {
  metrics: AnalyticsMetric[];
  applicationTrends: ApplicationTrendPoint[];
  jobsByCategory: CategoryAnalytics[];
  topPerformingJobs: TopPerformingJob[];
  recruitmentFunnel?: RecruitmentFunnelStage[];
}

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

export type AdminAnalyticsDateRange =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "last_12_months"
  | "custom";

export type AdminAnalyticsFilters = {
  dateRange: AdminAnalyticsDateRange;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  company?: string;
  employer?: string;
  location?: string;
};

export type AdminAnalyticsKpiKey =
  | "totalUsers"
  | "totalJobSeekers"
  | "totalEmployers"
  | "totalCompanies"
  | "totalJobs"
  | "activeJobs"
  | "totalApplications"
  | "totalInterviews"
  | "totalBlogs"
  | "totalCategories";

export type AdminAnalyticsKpi = {
  key: AdminAnalyticsKpiKey;
  label: string;
  value: number;
  growthPercentage: number;
  trend: AnalyticsTrend;
  comparisonLabel: string;
};

export type AdminAnalyticsTrendPoint = {
  label: string;
  users: number;
  employers: number;
  companies: number;
  jobs: number;
  applications: number;
  interviews: number;
  blogs: number;
};

export type AdminAnalyticsDistributionPoint = {
  label: string;
  count: number;
  percentage: number;
};

export type AdminAnalyticsFunnelStage = {
  label: string;
  count: number;
  percentage: number;
};

export type AdminAnalyticsCategoryRow = {
  category: string;
  jobs: number;
  activeJobs: number;
  applications: number;
  companies: number;
};

export type AdminAnalyticsCompanyRow = {
  companyId?: string;
  company: string;
  location?: string;
  jobs: number;
  activeJobs: number;
  applications: number;
};

export type AdminAnalyticsEmployerRow = {
  employerId?: string;
  employer: string;
  jobs: number;
  applications: number;
};

export type AdminAnalyticsJobRow = {
  jobId: string;
  title: string;
  company?: string;
  category?: string;
  location?: string;
  applications: number;
  status: string;
};

export type AdminAnalyticsBlogRow = {
  blogId: string;
  title: string;
  status: string;
  views: number;
  publishedAt?: string;
};

export type AdminAnalyticsJobSeekerRow = {
  jobSeekerId?: string;
  name: string;
  applications: number;
  profileCompleted?: boolean;
};

export type AdminAnalyticsOverview = {
  kpis: AdminAnalyticsKpi[];
  growthMetrics: AdminAnalyticsKpi[];
  trends: AdminAnalyticsTrendPoint[];
  categoryDistribution: AdminAnalyticsDistributionPoint[];
  locationDistribution: AdminAnalyticsDistributionPoint[];
  hiringFunnel: AdminAnalyticsFunnelStage[];
  topCategories: AdminAnalyticsCategoryRow[];
  topCompanies: AdminAnalyticsCompanyRow[];
  topEmployers: AdminAnalyticsEmployerRow[];
  topJobs: AdminAnalyticsJobRow[];
  topJobSeekers: AdminAnalyticsJobSeekerRow[];
  topBlogs: AdminAnalyticsBlogRow[];
  exports: {
    csv: boolean;
    excel: boolean;
    pdf: boolean;
  };
};

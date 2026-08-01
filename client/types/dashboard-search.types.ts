export type DashboardSearchCategory =
  | "jobs"
  | "companies"
  | "applicants"
  | "interviews"
  | "users"
  | "reports";

export type DashboardSearchResult = {
  id: string;
  category: DashboardSearchCategory;
  title: string;
  subtitle?: string;
  href: string;
};

export type DashboardSearchGroup = {
  category: DashboardSearchCategory;
  label: string;
  results: DashboardSearchResult[];
};

export type DashboardSearchResponse = {
  query: string;
  groups: DashboardSearchGroup[];
  total: number;
};

export type DashboardSearchParams = {
  q: string;
  limitPerCategory?: number;
};

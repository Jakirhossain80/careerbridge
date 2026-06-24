import type { JobType, WorkMode } from "@/types/job.types";

export type RecommendedJobsSortBy =
  | "relevance"
  | "newest"
  | "salary_high"
  | "salary_low";

export type RecommendedJobsQueryParams = {
  search?: string;
  category?: string;
  location?: string;
  employmentType?: string;
  workMode?: WorkMode | "";
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  sortBy?: RecommendedJobsSortBy;
  page?: number;
  limit?: number;
};

export interface RecommendedJob {
  _id: string;
  slug?: string;
  title: string;
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  location?: string;
  workMode?: WorkMode;
  employmentType?: string;
  jobType?: JobType | string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  experienceLevel?: string;
  category?: string;
  skills?: string[];
  description?: string;
  postedAt?: string;
  createdAt?: string;
  applicationDeadline?: string;
  matchScore?: number;
  matchReasons?: string[];
  isSaved?: boolean;
  savedJobId?: string;
  hasApplied?: boolean;
}

export type RecommendedJobsResponse = {
  jobs: RecommendedJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

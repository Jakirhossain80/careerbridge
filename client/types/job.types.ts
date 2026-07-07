export type JobStatus =
  | "draft"
  | "pending"
  | "published"
  | "active"
  | "closed"
  | "archived"
  | "rejected";

export type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "temporary"
  | "freelance";

export type WorkMode = "remote" | "onsite" | "hybrid";

export type JobVisibility = "public" | "private";

export type Job = {
  id: string;
  _id?: string;
  slug?: string;
  title: string;
  category: string;
  jobType: JobType;
  workMode?: WorkMode;
  workplaceType?: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  experienceLevel?: string;
  educationLevel?: string;
  vacancies?: number;
  openings?: number;
  deadline?: string;
  applicationDeadline?: string;
  skills: string[];
  description: string;
  responsibilities: string[] | string;
  requirements: string[] | string;
  benefits?: string[] | string;
  status: JobStatus;
  visibility?: JobVisibility;
  featured?: boolean;
  isPublished?: boolean;
  applicationsCount?: number;
  companyName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PublicJobsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PublicJobsParams = {
  page?: number;
  limit?: number;
  search?: string;
  keyword?: string;
  title?: string;
  company?: string;
  skill?: string;
  location?: string;
  category?: string;
  jobType?: JobType;
  workMode?: WorkMode;
  sort?: string;
};

export type UpdateJobPayload = {
  title: string;
  category: string;
  jobType: JobType;
  workplaceType: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  experienceLevel?: string;
  educationLevel?: string;
  vacancies: number;
  deadline: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  status: JobStatus;
  featured: boolean;
};

export type CreateJobPayload = {
  title: string;
  category?: string;
  industry?: string;
  jobType: JobType;
  workplaceType: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  experienceLevel?: string;
  vacancies: number;
  deadline: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: "draft" | "published" | "active";
  featured?: boolean;
};

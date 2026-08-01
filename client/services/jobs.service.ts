"use client";

import { api } from "@/lib/api";
import type { Job as BrowseJob } from "@/lib/jobs-data";
import type { FeaturedJob } from "@/lib/featured-jobs-data";
import type { LatestJob } from "@/lib/latest-jobs-data";
import type { JobCardProps } from "@/components/cards";
import type { JobDetails } from "@/lib/job-details-data";
import type {
  CreateJobPayload,
  Job,
  PublicJobsMeta,
  PublicJobsParams,
  UpdateJobPayload,
} from "@/types/job.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type EmployerJobsResponse = {
  jobs: Job[];
};

type PublicJobsResponse = {
  jobs: Job[];
  meta: PublicJobsMeta;
};

export type EmployerJobsParams = {
  page?: number;
  limit?: number;
  status?: Job["status"];
  search?: string;
  sort?: string;
};

export const employerJobQueryKeys = {
  lists: ["employer-jobs"] as const,
  list: (params: EmployerJobsParams = {}) => ["employer-jobs", params] as const,
  details: ["job"] as const,
  detail: (jobId: string) => ["job", jobId] as const,
  dashboard: ["employer-dashboard"] as const,
};

export const publicJobQueryKeys = {
  all: ["public-jobs"] as const,
  lists: ["public-jobs", "list"] as const,
  list: (params: PublicJobsParams = {}) => ["public-jobs", "list", params] as const,
  featured: (params: PublicJobsParams = {}) =>
    ["public-jobs", "featured", params] as const,
  details: ["public-jobs", "detail"] as const,
  detail: (idOrSlug: string) => ["public-jobs", "detail", idOrSlug] as const,
};

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  const payload = response.data;

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
}

export function normalizeJob(job: Job): Job {
  const salaryMin = job.salaryMin ?? job.salary?.min;
  const salaryMax = job.salaryMax ?? job.salary?.max;
  const currency = job.currency ?? job.salary?.currency;
  return {
    ...job,
    id: job.id ?? job._id ?? "",
    salaryMin,
    salaryMax,
    currency,
    workMode: job.workMode ?? job.workplaceType,
    applicationDeadline: job.applicationDeadline ?? job.deadline,
    openings: job.openings ?? job.vacancies,
  };
}

const jobTypeLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  temporary: "Temporary",
  freelance: "Freelance",
};

const workModeLabels: Record<string, string> = {
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

const companyTones = [
  "bg-blue-50 text-primary ring-blue-100",
  "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "bg-cyan-50 text-cyan-700 ring-cyan-100",
  "bg-violet-50 text-violet-700 ring-violet-100",
  "bg-amber-50 text-amber-700 ring-amber-100",
  "bg-lime-50 text-lime-700 ring-lime-100",
];

const getJobId = (job: Job) => job.id ?? job._id ?? "";

const getJobHref = (job: Job) => `/jobs/${job.slug ?? getJobId(job)}`;

const getCompanyName = (job: Job) => job.companyName ?? "Company not set";

const getCompanyInitials = (companyName: string) =>
  companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CB";

const getCompanyTone = (id: string) => {
  const charTotal = id
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return companyTones[charTotal % companyTones.length];
};

export const formatSalary = (job: Job) => {
  const currency = job.currency;
  if (!currency) return job.salary?.negotiable ? "Salary negotiable" : "Salary not specified";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (typeof job.salaryMin === "number" && typeof job.salaryMax === "number") {
    return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
  }

  if (typeof job.salaryMin === "number") {
    return `From ${formatter.format(job.salaryMin)}`;
  }

  if (typeof job.salaryMax === "number") {
    return `Up to ${formatter.format(job.salaryMax)}`;
  }

  return job.salary?.negotiable ? "Salary negotiable" : "Salary not specified";
};

const formatDate = (date?: string) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const formatPostedAt = (date?: string) => {
  if (!date) return "Recently posted";

  const createdAt = new Date(date).getTime();
  const diffMs = Date.now() - createdAt;
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  return formatDate(date);
};

const getPostedDate = (date?: string) => {
  if (!date) return "Date not specified";

  const diffMs = Date.now() - new Date(date).getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  if (diffHours < 24) return "Today";
  if (diffHours < 48) return "Last 24 hours";
  if (diffHours < 72) return "Last 3 days";

  return "Last 7 days";
};

const getExperienceLevel = (job: Job) =>
  job.experienceLevel ?? "Experience not specified";

const toBrowseJob = (job: Job): BrowseJob => {
  const id = getJobId(job);
  const company = getCompanyName(job);

  return {
    id,
    title: job.title,
    company,
    companyInitials: getCompanyInitials(company),
    companyTone: getCompanyTone(id),
    category: job.category ?? "General",
    industry: job.category ?? "General",
    location: job.location ?? "Location not specified",
    workMode: workModeLabels[job.workMode ?? job.workplaceType ?? ""] as BrowseJob["workMode"],
    jobType: jobTypeLabels[job.jobType] as BrowseJob["jobType"],
    salary: formatSalary(job),
    salaryMin: job.salaryMin ?? 0,
    salaryMax: job.salaryMax ?? 0,
    experienceLevel: getExperienceLevel(job),
    postedAt: formatPostedAt(job.createdAt),
    postedDate: getPostedDate(job.createdAt),
    applicants: job.applicationsCount ?? 0,
    skills: job.skills ?? [],
    description: job.description,
    featured: job.featured,
    href: getJobHref(job),
  };
};

const toFeaturedJob = (job: Job): FeaturedJob => {
  const browseJob = toBrowseJob(job);

  return {
    ...browseJob,
    featuredStatus: job.featured ? "Featured" : "Top company",
    featured: Boolean(job.featured),
    jobType: browseJob.jobType as FeaturedJob["jobType"],
    experienceLevel: browseJob.experienceLevel as FeaturedJob["experienceLevel"],
  };
};

const toLatestJob = (job: Job): LatestJob => {
  const browseJob = toBrowseJob(job);

  return {
    ...browseJob,
    featured: Boolean(job.featured),
    jobType: browseJob.jobType as LatestJob["jobType"],
    experienceLevel: browseJob.experienceLevel as LatestJob["experienceLevel"],
    postedDate: getPostedDate(job.createdAt) as LatestJob["postedDate"],
  };
};

const toHomeJobCard = (job: Job): JobCardProps => {
  const id = getJobId(job);

  return {
    id,
    title: job.title,
    companyName: getCompanyName(job),
    location: job.location ?? "Location not specified",
    jobType: jobTypeLabels[job.jobType] ?? job.jobType,
    workMode: workModeLabels[job.workMode ?? job.workplaceType ?? ""] ?? "Flexible",
    salary: formatSalary(job),
    skills: job.skills ?? [],
    description: job.description,
    postedAt: formatPostedAt(job.createdAt),
    deadline: formatDate(job.deadline),
    featured: Boolean(job.featured),
    href: getJobHref(job),
  };
};

const toJobDetails = (job: Job): JobDetails => {
  const id = getJobId(job);
  const company = getCompanyName(job);
  const salaryRange = formatSalary(job);
  const applicants = job.applicationsCount ?? 0;
  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : [job.requirements].filter(Boolean);

  return {
    id,
    title: job.title,
    company,
    companyInitials: getCompanyInitials(company),
    companyTone: getCompanyTone(id),
    companyTagline: `${company} is hiring for ${job.category ?? "this role"}.`,
    companyLocation: job.location ?? "Location not specified",
    companySize: "Company size not specified",
    companyIndustry: job.category ?? "General",
    companyDescription:
      "Review the role details and apply through CareerBridge when your profile matches the requirements.",
    companyProfileHref: "/companies",
    statusBadges: [
      ...(job.featured ? [{ label: "Featured", variant: "primary" as const }] : []),
      { label: "Actively hiring", variant: "success" as const },
      {
        label: workModeLabels[job.workMode ?? job.workplaceType ?? ""] ?? "Flexible",
        variant: "neutral" as const,
      },
    ],
    location: job.location ?? "Remote",
    postedDate: formatDate(job.createdAt),
    jobType: jobTypeLabels[job.jobType] ?? job.jobType,
    experienceLevel: getExperienceLevel(job),
    salaryRange,
    deadline: formatDate(job.deadline),
    applicants,
    applicationRate: applicants > 25 ? "High candidate interest" : "Early applications open",
    overview: job.description,
    responsibilities: Array.isArray(job.responsibilities)
      ? job.responsibilities
      : [job.responsibilities].filter(Boolean),
    skills: job.skills ?? [],
    requiredExperience: requirements.length > 0 ? requirements : ["Review the job description for role requirements."],
    summaryCards: [
      {
        label: "Applicants",
        value: applicants.toLocaleString(),
        supportingText: "Applications received",
      },
      {
        label: "Vacancies",
        value: (job.vacancies ?? job.openings ?? 1).toLocaleString(),
        supportingText: "Open positions",
      },
      {
        label: "Deadline",
        value: formatDate(job.deadline),
        supportingText: "Apply before this date",
      },
    ],
    similarJobs: [],
  };
};

export async function getJobById(id: string) {
  const response = await api.get<ApiEnvelope<Job> | Job>(`/jobs/${id}`);
  return normalizeJob(unwrap<Job>(response));
}

export async function getPublicJobs(params: PublicJobsParams = {}) {
  const response = await api.get<ApiEnvelope<PublicJobsResponse>>("/jobs", {
    params,
  });
  const payload = unwrap<PublicJobsResponse>(response);
  const jobs = payload.jobs.map(normalizeJob);

  return {
    ...payload,
    jobs,
    browseJobs: jobs.map(toBrowseJob),
    latestJobs: jobs.map(toLatestJob),
    featuredJobs: jobs.map(toFeaturedJob),
    homeJobs: jobs.map(toHomeJobCard),
  };
}

export async function getPublicFeaturedJobs(params: PublicJobsParams = {}) {
  const response = await api.get<ApiEnvelope<PublicJobsResponse>>(
    "/jobs/featured",
    { params },
  );
  const payload = unwrap<PublicJobsResponse>(response);
  const jobs = payload.jobs.map(normalizeJob);

  return {
    ...payload,
    jobs,
    browseJobs: jobs.map(toBrowseJob),
    latestJobs: jobs.map(toLatestJob),
    featuredJobs: jobs.map(toFeaturedJob),
    homeJobs: jobs.map(toHomeJobCard),
  };
}

export async function getPublicJobDetails(idOrSlug: string) {
  const response = await api.get<ApiEnvelope<Job> | Job>(`/jobs/${idOrSlug}`);

  return toJobDetails(normalizeJob(unwrap<Job>(response)));
}

export async function getEmployerJobs(params: EmployerJobsParams = {}) {
  const response = await api.get<ApiEnvelope<EmployerJobsResponse>>(
    "/employer/jobs",
    { params },
  );
  const payload = unwrap<EmployerJobsResponse>(response);

  return {
    ...payload,
    jobs: payload.jobs.map(normalizeJob),
  };
}

export async function createJob(payload: CreateJobPayload) {
  const response = await api.post<ApiEnvelope<Job> | Job>("/employer/jobs", payload);

  return normalizeJob(unwrap<Job>(response));
}

export async function updateJob(id: string, payload: UpdateJobPayload) {
  try {
    const response = await api.patch<ApiEnvelope<Job> | Job>(`/jobs/${id}`, payload);
    return normalizeJob(unwrap<Job>(response));
  } catch {
    const response = await api.patch<ApiEnvelope<Job> | Job>(
      `/employer/jobs/${id}`,
      payload,
    );
    return normalizeJob(unwrap<Job>(response));
  }
}

"use client";

import {
  adminJobQueryKeys,
  getAdminJobList,
  updateAdminJobDetails,
} from "@/services/admin-jobs.service";
import type { AdminJob } from "@/types/admin-job.types";
import type {
  AdminFeaturedJob,
  AdminFeaturedJobListParams,
  AdminFeaturedJobsResponse,
  AdminFeaturedJobStats,
  FeatureJobPayload,
  UpdateFeaturedJobPayload,
} from "@/types/admin-featured-job";

export const adminFeaturedJobQueryKeys = {
  lists: ["admin-featured-jobs"] as const,
  list: (filters: AdminFeaturedJobListParams) =>
    ["admin-featured-jobs", filters] as const,
  stats: ["admin-featured-job-stats"] as const,
  availableJobs: (filters: AdminFeaturedJobListParams) =>
    ["jobs", "feature-candidates", filters] as const,
};

function getCompany(job: AdminJob) {
  return typeof job.companyId === "object" && job.companyId
    ? job.companyId
    : undefined;
}

function getCompanyId(job: AdminJob) {
  if (typeof job.companyId === "string") return job.companyId;
  return job.companyId?._id;
}

function getCompanyName(job: AdminJob) {
  const company = getCompany(job);
  return job.companyName ?? company?.companyName ?? company?.name ?? "Company not set";
}

function getDaysRemaining(job: AdminJob) {
  const rawDate = job.applicationDeadline ?? job.deadline;
  if (!rawDate) return undefined;

  const diff = new Date(rawDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function toFeaturedJob(job: AdminJob): AdminFeaturedJob {
  const daysRemaining = getDaysRemaining(job);

  return {
    _id: job._id,
    promotionId: job._id,
    jobId: job._id,
    slug: job.slug,
    title: job.title,
    companyName: getCompanyName(job),
    company: getCompany(job),
    companyId: getCompanyId(job),
    priority: "standard",
    impressions: 0,
    clicks: 0,
    durationDays: undefined,
    endsAt: job.applicationDeadline ?? job.deadline,
    daysRemaining,
    status: job.status === "active" || job.status === "published" ? "active" : "pending",
    job,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

function getPaginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminFeaturedJobs(
  params: AdminFeaturedJobListParams = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const response = await getAdminJobList({
    search: params.search,
    page: 1,
    limit: 100,
    sortBy: "-updatedAt",
  });
  const featuredJobs = response.jobs
    .filter((job) => job.featured ?? job.isFeatured)
    .map(toFeaturedJob)
    .filter((promotion) =>
      params.status && params.status !== "all"
        ? promotion.status === params.status
        : true,
    )
    .filter((promotion) =>
      params.priority && params.priority !== "all"
        ? promotion.priority === params.priority
        : true,
    );
  const start = (page - 1) * limit;

  return {
    featuredJobs: featuredJobs.slice(start, start + limit),
    meta: getPaginationMeta(page, limit, featuredJobs.length),
  } satisfies AdminFeaturedJobsResponse;
}

export async function getAdminFeaturedJobStats() {
  const response = await getAdminFeaturedJobs({ page: 1, limit: 100 });
  const totalImpressions = response.featuredJobs.reduce(
    (total, promotion) => total + promotion.impressions,
    0,
  );
  const totalClicks = response.featuredJobs.reduce(
    (total, promotion) => total + promotion.clicks,
    0,
  );

  return {
    activeFeatured: response.featuredJobs.filter(
      (promotion) => promotion.status === "active",
    ).length,
    totalImpressions,
    averageCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    revenueMtd: 0,
  } satisfies AdminFeaturedJobStats;
}

export async function getFeatureCandidateJobs(
  params: AdminFeaturedJobListParams = {},
) {
  const response = await getAdminJobList({
    search: params.search,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    sortBy: "-createdAt",
  });

  return {
    jobs: response.jobs.filter((job) => !(job.featured ?? job.isFeatured)),
    meta: response.meta,
  };
}

export async function featureAdminJob(payload: FeatureJobPayload) {
  return updateAdminJobDetails(payload.jobId, { featured: true });
}

export async function updateFeaturedAdminJob(
  promotionId: string,
  payload: UpdateFeaturedJobPayload,
) {
  if (payload.status === "paused" || payload.status === "expired") {
    return updateAdminJobDetails(promotionId, { featured: false });
  }

  if (payload.status === "active" || payload.status === "pending") {
    return updateAdminJobDetails(promotionId, { featured: true });
  }

  return updateAdminJobDetails(promotionId, { featured: true });
}

export async function removeFeaturedAdminJob(promotionId: string) {
  return updateAdminJobDetails(promotionId, { featured: false });
}

export const relatedAdminFeaturedJobInvalidations = [
  adminFeaturedJobQueryKeys.lists,
  adminFeaturedJobQueryKeys.stats,
  adminJobQueryKeys.lists,
  ["admin-dashboard"] as const,
];

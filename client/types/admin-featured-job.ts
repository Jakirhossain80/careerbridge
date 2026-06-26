import type { AdminJob, AdminJobCompany } from "@/types/admin-job.types";
import type { AdminMeta } from "@/types/admin.types";

export type FeaturedPromotionStatus = "active" | "pending" | "paused" | "expired";
export type FeaturedPromotionPriority = "standard" | "medium" | "high" | "ultra";

export type AdminFeaturedJobFilters = {
  search?: string;
  status?: FeaturedPromotionStatus | "all";
  priority?: FeaturedPromotionPriority | "all";
  page?: number;
  limit?: number;
};

export type AdminFeaturedJobListParams = {
  search?: string;
  status?: FeaturedPromotionStatus | "all";
  priority?: FeaturedPromotionPriority | "all";
  page?: number;
  limit?: number;
};

export type AdminFeaturedJob = {
  _id: string;
  promotionId: string;
  jobId: string;
  slug?: string;
  title: string;
  companyName?: string;
  company?: AdminJobCompany;
  companyId?: string;
  priority: FeaturedPromotionPriority;
  impressions: number;
  clicks: number;
  durationDays?: number;
  startsAt?: string;
  endsAt?: string;
  daysRemaining?: number;
  status: FeaturedPromotionStatus;
  job: AdminJob;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminFeaturedJobsResponse = {
  featuredJobs: AdminFeaturedJob[];
  meta: AdminMeta;
};

export type AdminFeaturedJobStats = {
  activeFeatured: number;
  totalImpressions: number;
  averageCtr: number;
  revenueMtd: number;
};

export type FeatureJobPayload = {
  jobId: string;
  durationDays: number;
  priority: FeaturedPromotionPriority;
  estimatedImpressions?: number;
  promotionCost?: number;
};

export type UpdateFeaturedJobPayload = Partial<{
  priority: FeaturedPromotionPriority;
  status: FeaturedPromotionStatus;
}>;

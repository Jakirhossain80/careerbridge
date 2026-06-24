"use client";

import { getMockRecommendedJobs } from "@/data/mock-recommended-jobs";
import { api } from "@/lib/api";
import type {
  RecommendedJob,
  RecommendedJobsQueryParams,
  RecommendedJobsResponse,
} from "@/types/recommended-job.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type RecommendedJobsApiPayload =
  | RecommendedJobsResponse
  | RecommendedJob[]
  | {
      recommendedJobs?: RecommendedJob[];
      jobs?: RecommendedJob[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      meta?: {
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
      };
    };

type RecommendedJobsObjectPayload = Exclude<
  RecommendedJobsApiPayload,
  RecommendedJob[]
>;

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

function normalizeRecommendedJobsResponse(
  payload: RecommendedJobsApiPayload,
  params: RecommendedJobsQueryParams = {},
): RecommendedJobsResponse {
  if (Array.isArray(payload)) {
    const limit = params.limit ?? (payload.length || 1);
    return {
      jobs: payload,
      total: payload.length,
      page: params.page ?? 1,
      limit,
      totalPages: Math.max(Math.ceil(payload.length / limit), 1),
    };
  }

  const objectPayload = payload as RecommendedJobsObjectPayload;
  const jobs =
    objectPayload.jobs ??
    ("recommendedJobs" in objectPayload ? objectPayload.recommendedJobs : undefined) ??
    [];
  const meta = "meta" in objectPayload ? objectPayload.meta : undefined;
  const total = objectPayload.total ?? meta?.total ?? jobs.length;
  const limit = objectPayload.limit ?? meta?.limit ?? params.limit ?? 6;

  return {
    jobs,
    total,
    page: objectPayload.page ?? meta?.page ?? params.page ?? 1,
    limit,
    totalPages:
      objectPayload.totalPages ??
      meta?.totalPages ??
      Math.max(Math.ceil(total / limit), 1),
  };
}

export async function getRecommendedJobs(
  params: RecommendedJobsQueryParams = {},
) {
  try {
    const response = await api.get<
      ApiEnvelope<RecommendedJobsApiPayload> | RecommendedJobsApiPayload
    >("/jobs/recommended", { params });

    return normalizeRecommendedJobsResponse(unwrap(response), params);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return getMockRecommendedJobs(params);
  }
}

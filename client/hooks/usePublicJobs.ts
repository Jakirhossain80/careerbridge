"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getPublicFeaturedJobs,
  getPublicJobs,
  publicJobQueryKeys,
} from "@/services/jobs.service";
import type { PublicJobsParams } from "@/types/job.types";

export function usePublicJobs(params: PublicJobsParams, featured = false) {
  return useQuery({
    queryKey: featured
      ? publicJobQueryKeys.featured(params)
      : publicJobQueryKeys.list(params),
    queryFn: () => featured
      ? getPublicFeaturedJobs(params)
      : getPublicJobs(params),
  });
}

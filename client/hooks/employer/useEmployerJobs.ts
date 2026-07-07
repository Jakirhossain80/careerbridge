"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createJob,
  employerJobQueryKeys,
  getEmployerJobs,
  type EmployerJobsParams,
} from "@/services/jobs.service";
import type { CreateJobPayload } from "@/types/job.types";

export function useEmployerJobs(params: EmployerJobsParams = {}) {
  return useQuery({
    queryKey: employerJobQueryKeys.list(params),
    queryFn: () => getEmployerJobs(params),
  });
}

export function useEmployerJobMutations() {
  const queryClient = useQueryClient();

  const invalidateEmployerJobs = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: employerJobQueryKeys.lists }),
      queryClient.invalidateQueries({ queryKey: employerJobQueryKeys.dashboard }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateJobPayload) => createJob(payload),
    onSuccess: invalidateEmployerJobs,
  });

  return {
    createMutation,
    invalidateEmployerJobs,
  };
}

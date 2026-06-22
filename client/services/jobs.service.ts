"use client";

import { api } from "@/lib/api";
import type { Job, UpdateJobPayload } from "@/types/job.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type EmployerJobsResponse = {
  jobs: Job[];
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

function normalizeJob(job: Job): Job {
  return {
    ...job,
    id: job.id ?? job._id ?? "",
    workMode: job.workMode ?? job.workplaceType,
    applicationDeadline: job.applicationDeadline ?? job.deadline,
    openings: job.openings ?? job.vacancies,
  };
}

export async function getJobById(id: string) {
  try {
    const response = await api.get<ApiEnvelope<Job> | Job>(`/jobs/${id}`);
    return normalizeJob(unwrap<Job>(response));
  } catch (error) {
    const response = await api.get<ApiEnvelope<EmployerJobsResponse>>(
      "/employer/jobs",
      {
        params: {
          limit: 100,
        },
      },
    );
    const jobs = unwrap<EmployerJobsResponse>(response).jobs.map(normalizeJob);
    const job = jobs.find((item) => item.id === id || item._id === id);

    if (!job) {
      throw error;
    }

    return job;
  }
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

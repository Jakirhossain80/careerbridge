"use client";

import { api } from "@/lib/api";
import type { JobAlert, JobAlertInput } from "@/types/job-alert.types";

type ApiEnvelope<T> = { data: T };
type JobAlertsResponse = {
  jobAlerts: JobAlert[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  return response.data && typeof response.data === "object" && "data" in response.data
    ? (response.data.data as T)
    : (response.data as T);
}

export async function createJobAlert(payload: JobAlertInput) {
  const response = await api.post<ApiEnvelope<JobAlert> | JobAlert>(
    "/job-alerts",
    payload
  );
  return unwrap<JobAlert>(response);
}

export async function getJobAlerts() {
  const response = await api.get<ApiEnvelope<JobAlertsResponse> | JobAlertsResponse>(
    "/job-alerts/me"
  );
  return unwrap<JobAlertsResponse>(response);
}

export async function updateJobAlert(alertId: string, payload: Partial<JobAlertInput>) {
  const response = await api.patch<ApiEnvelope<JobAlert> | JobAlert>(
    `/job-alerts/${alertId}`,
    payload
  );
  return unwrap<JobAlert>(response);
}

export async function deleteJobAlert(alertId: string) {
  const response = await api.delete<ApiEnvelope<JobAlert> | JobAlert>(
    `/job-alerts/${alertId}`
  );
  return unwrap<JobAlert>(response);
}

export async function toggleJobAlert(alertId: string, isActive: boolean) {
  return updateJobAlert(alertId, { isActive });
}

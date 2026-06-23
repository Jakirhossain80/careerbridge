"use client";

import { api } from "@/lib/api";
import type { Resume } from "@/types/job-seeker.types";

type ApiEnvelope<T> = { data: T };

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  return response.data && typeof response.data === "object" && "data" in response.data
    ? (response.data.data as T)
    : (response.data as T);
}

export async function uploadResume(formData: FormData) {
  const response = await api.post<ApiEnvelope<Resume> | Resume>(
    "/job-seekers/resumes",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return unwrap<Resume>(response);
}

export async function getResumes() {
  const response = await api.get<ApiEnvelope<Resume[]> | Resume[]>(
    "/job-seekers/resumes"
  );
  return unwrap<Resume[]>(response);
}

export async function setDefaultResume(resumeId: string) {
  const response = await api.patch<ApiEnvelope<Resume> | Resume>(
    `/job-seekers/resumes/${resumeId}/default`
  );
  return unwrap<Resume>(response);
}

export async function deleteResume(resumeId: string) {
  const response = await api.delete<ApiEnvelope<Resume> | Resume>(
    `/job-seekers/resumes/${resumeId}`
  );
  return unwrap<Resume>(response);
}

"use client";

import { api } from "@/lib/api";
import { mockResumeManagerData } from "@/data/mock-resumes";
import type { ResumeFile, ResumeManagerData } from "@/types/resume.types";

type ApiEnvelope<T> = { data: T };

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  return response.data && typeof response.data === "object" && "data" in response.data
    ? (response.data.data as T)
    : (response.data as T);
}

function getFileType(fileType?: string): ResumeFile["fileType"] {
  const normalized = fileType?.toLowerCase() ?? "";

  if (normalized.includes("wordprocessingml") || normalized.endsWith("docx")) {
    return "docx";
  }

  if (normalized.includes("msword") || normalized.endsWith("doc")) {
    return "doc";
  }

  return "pdf";
}

function normalizeResume(resume: Partial<ResumeFile> & { _id: string }): ResumeFile {
  const status = resume.status ?? (resume.isDefault ? "active" : "uploaded");

  return {
    _id: resume._id,
    jobSeekerId: resume.jobSeekerId ?? "",
    fileName: resume.fileName ?? "Resume",
    fileUrl: resume.fileUrl,
    fileType: getFileType(resume.fileType ?? resume.mimeType),
    mimeType: resume.mimeType,
    fileSize: resume.fileSize ?? 0,
    status,
    isDefault: resume.isDefault ?? status === "active",
    uploadedAt: resume.uploadedAt ?? new Date().toISOString(),
    updatedAt: resume.updatedAt,
    version: resume.version,
  };
}

function normalizeResumeManagerData(
  payload: ResumeManagerData | ResumeFile[],
): ResumeManagerData {
  if (Array.isArray(payload)) {
    const resumes = payload.map((resume) => normalizeResume(resume));
    const activeResume =
      resumes.find((resume) => resume.isDefault) ?? resumes[0] ?? undefined;

    return {
      resumes,
      activeResume,
      versionHistory: resumes,
      performance: {
        score: activeResume ? 74 : 0,
        label: activeResume ? "Ready" : "Missing",
        summary: activeResume
          ? "Your active resume is available for applications."
          : "Upload a resume to unlock faster job applications.",
      },
      insights: mockResumeManagerData.insights,
      lastResumeUpdate: activeResume?.updatedAt ?? activeResume?.uploadedAt,
      resumeCompletionStatus: activeResume ? "Resume uploaded" : "No resume uploaded",
    };
  }

  const resumes = (payload.resumes ?? []).map((resume) => normalizeResume(resume));
  const activeResume =
    payload.activeResume ??
    resumes.find((resume) => resume.isDefault) ??
    resumes[0] ??
    undefined;

  return {
    ...payload,
    resumes,
    activeResume: activeResume ? normalizeResume(activeResume) : undefined,
    versionHistory: (payload.versionHistory ?? resumes).map((resume) =>
      normalizeResume(resume),
    ),
    performance: payload.performance ?? mockResumeManagerData.performance,
    insights: payload.insights ?? mockResumeManagerData.insights,
    lastResumeUpdate:
      payload.lastResumeUpdate ?? activeResume?.updatedAt ?? activeResume?.uploadedAt,
  };
}

async function withDevelopmentFallback<T>(
  request: () => Promise<T>,
  fallback: T,
) {
  try {
    return await request();
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return fallback;
  }
}

export const resumeQueryKeys = {
  manager: ["job-seeker-resumes"] as const,
  profile: ["job-seeker-profile"] as const,
  dashboard: ["job-seeker-dashboard"] as const,
};

export async function getMyResumes() {
  return withDevelopmentFallback(async () => {
    try {
      const response = await api.get<
        ApiEnvelope<ResumeManagerData | ResumeFile[]> | ResumeManagerData | ResumeFile[]
      >("/resumes/me");
      return normalizeResumeManagerData(unwrap<ResumeManagerData | ResumeFile[]>(response));
    } catch {
      const response = await api.get<ApiEnvelope<ResumeFile[]> | ResumeFile[]>(
        "/job-seekers/resumes",
      );
      return normalizeResumeManagerData(unwrap<ResumeFile[]>(response));
    }
  }, mockResumeManagerData);
}

export async function getResumes() {
  return withDevelopmentFallback(async () => {
    const response = await api.get<ApiEnvelope<ResumeFile[]> | ResumeFile[]>(
      "/job-seekers/resumes",
    );
    return unwrap<ResumeFile[]>(response).map((resume) => normalizeResume(resume));
  }, mockResumeManagerData.resumes);
}

export async function uploadResume(formData: FormData) {
  const response = await api.post<ApiEnvelope<ResumeFile> | ResumeFile>(
    "/job-seekers/resumes",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return normalizeResume(unwrap<ResumeFile>(response));
}

export async function replaceResume(resumeId: string, formData: FormData) {
  const response = await api.patch<ApiEnvelope<ResumeFile> | ResumeFile>(
    `/resumes/${resumeId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return normalizeResume(unwrap<ResumeFile>(response));
}

export async function setDefaultResume(resumeId: string) {
  const response = await api.patch<ApiEnvelope<ResumeFile> | ResumeFile>(
    `/job-seekers/resumes/${resumeId}/default`,
  );
  return normalizeResume(unwrap<ResumeFile>(response));
}

export async function deleteResume(resumeId: string) {
  const response = await api.delete<ApiEnvelope<ResumeFile> | ResumeFile>(
    `/job-seekers/resumes/${resumeId}`,
  );
  return normalizeResume(unwrap<ResumeFile>(response));
}

export async function downloadResume(resumeId: string) {
  const response = await api.get<ApiEnvelope<{ downloadUrl: string }> | { downloadUrl: string }>(
    `/resumes/${resumeId}/download`,
  );
  return unwrap<{ downloadUrl: string }>(response);
}

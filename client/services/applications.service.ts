"use client";

import { z } from "zod";
import { api } from "@/lib/api";
import type {
  AppliedJobsResponse,
  ApplyJobPayload,
  ApplicantDetails,
  ApplicationNote,
  ApplicationStatus,
  EmployerApplication,
  EmployerApplicationsQueryParams,
  EmployerApplicationsResponse,
  JobSeekerApplication,
} from "@/types/application.types";
import { applicationStatusLabels } from "@/types/application.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type RawEntity = string | Record<string, unknown> | null | undefined;

type RawEmployerApplication = {
  _id: string;
  jobId?: RawEntity;
  companyId?: RawEntity;
  applicantId?: RawEntity;
  applicantEmail?: string;
  applicantName?: string;
  resume?: string;
  resumeUrl?: string;
  coverLetter?: string;
  expectedSalary?: number;
  status: ApplicationStatus;
  timeline?: Array<{
    status: ApplicationStatus;
    note?: string;
    createdAt?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

const applicationStatusSchema = z.enum([
  "applied",
  "submitted",
  "under_review",
  "in_review",
  "reviewing",
  "shortlisted",
  "interview",
  "offered",
  "hired",
  "rejected",
  "withdrawn",
]);

const rawEntitySchema = z
  .union([z.string(), z.record(z.string(), z.unknown()), z.null()])
  .optional();

const rawEmployerApplicationSchema: z.ZodType<RawEmployerApplication> = z.object({
  _id: z.string(),
  jobId: rawEntitySchema,
  companyId: rawEntitySchema,
  applicantId: rawEntitySchema,
  applicantEmail: z.string().optional(),
  applicantName: z.string().optional(),
  resume: z.string().optional(),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
  expectedSalary: z.number().optional(),
  status: applicationStatusSchema,
  timeline: z
    .array(
      z.object({
        status: applicationStatusSchema,
        note: z.string().optional(),
        createdAt: z.string().optional(),
      }),
    )
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const employerApplicationsApiResponseSchema = z.object({
  applications: z.array(rawEmployerApplicationSchema),
  meta: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(1),
  }),
});

type EmployerApplicationsApiResponse = z.infer<
  typeof employerApplicationsApiResponseSchema
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

export function normalizeApplicationsResponse(
  payload: unknown,
): EmployerApplicationsResponse {
  const parsed = employerApplicationsApiResponseSchema.parse(payload);
  const applications = parsed.applications.map(mapEmployerApplication);

  return {
    applications,
    total: parsed.meta.total,
    page: parsed.meta.page,
    limit: parsed.meta.limit,
    totalPages: parsed.meta.totalPages,
    meta: buildApplicationsMeta(applications),
  };
}

function getEntityString(entity: RawEntity, key: string) {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  const value = entity[key];
  return typeof value === "string" ? value : "";
}

function getEntityNumber(entity: RawEntity, key: string) {
  if (!entity || typeof entity !== "object") {
    return undefined;
  }

  const value = entity[key];
  return typeof value === "number" ? value : undefined;
}

function getEntityStringArray(entity: RawEntity, key: string) {
  if (!entity || typeof entity !== "object") {
    return [];
  }

  const value = entity[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function getEntityId(entity: RawEntity) {
  if (typeof entity === "string") {
    return entity;
  }

  return getEntityString(entity, "_id");
}

function mapEmployerApplication(
  application: RawEmployerApplication,
): EmployerApplication {
  const job = application.jobId;
  const applicant = application.applicantId;
  const company = application.companyId;
  const applicantName =
    application.applicantName || getEntityString(applicant, "name") || "Applicant";
  const applicantEmail =
    application.applicantEmail || getEntityString(applicant, "email");

  return {
    _id: application._id,
    jobId: getEntityId(job),
    jobTitle: getEntityString(job, "title") || "Job",
    companyName:
      getEntityString(company, "companyName") ||
      getEntityString(company, "name") ||
      getEntityString(job, "companyName"),
    applicantId: getEntityId(applicant),
    applicantName,
    applicantEmail,
    applicantPhone: getEntityString(applicant, "phone"),
    applicantAvatar: getEntityString(applicant, "photoURL"),
    location:
      getEntityString(applicant, "location") || getEntityString(job, "location"),
    resumeUrl: application.resumeUrl,
    coverLetter: application.coverLetter,
    skills: [
      ...getEntityStringArray(applicant, "skills"),
      ...getEntityStringArray(job, "skills"),
    ].slice(0, 8),
    summary: getEntityString(applicant, "professionalHeadline"),
    expectedSalaryMin: getEntityNumber(application, "expectedSalary"),
    status: application.status,
    appliedAt: application.createdAt ?? application.updatedAt ?? new Date().toISOString(),
  };
}

function mapApplicantDetails(application: RawEmployerApplication): ApplicantDetails {
  const mapped = mapEmployerApplication(application);

  return {
    ...mapped,
    careerSummary: mapped.summary,
    resumeFileName: application.resume ?? application.resumeUrl?.split("/").pop(),
    statusHistory: (application.timeline ?? []).map((item) => ({
      status: item.status,
      label: applicationStatusLabels[item.status] ?? item.status,
      createdAt: item.createdAt ?? application.updatedAt ?? mapped.appliedAt,
      note: item.note,
    })),
  };
}

function buildApplicationsMeta(applications: EmployerApplication[]) {
  const shortlisted = applications.filter(
    (application) => application.status === "shortlisted",
  );
  const experienceValues = shortlisted
    .map((application) => application.experienceYears)
    .filter((value): value is number => typeof value === "number");

  return {
    totalShortlisted: shortlisted.length,
    interviewsSet: shortlisted.filter((application) => application.interviewScheduledAt)
      .length,
    averageExperience:
      experienceValues.length > 0
        ? experienceValues.reduce((sum, value) => sum + value, 0) /
          experienceValues.length
        : 0,
  };
}

export async function getEmployerApplications(
  params: EmployerApplicationsQueryParams = {},
) {
  const response = await api.get<
    ApiEnvelope<EmployerApplicationsApiResponse>
  >("/employer/applications", {
    params: {
      ...params,
      status: params.status === "all" ? undefined : params.status,
    },
  });

  return normalizeApplicationsResponse(response.data.data);
}

export async function getApplicationById(id: string) {
  const response = await api.get<
      ApiEnvelope<RawEmployerApplication> | RawEmployerApplication
    >(
      `/employer/applications/${id}`,
    );
  return mapApplicantDetails(unwrap<RawEmployerApplication>(response));
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
) {
  const response = await api.patch<
    ApiEnvelope<RawEmployerApplication> | RawEmployerApplication
  >(
    `/employer/applications/${id}/status`,
    { status },
  );
  return mapApplicantDetails(unwrap<RawEmployerApplication>(response));
}

export async function addApplicationNote(id: string, note: string) {
  const response = await api.post<ApiEnvelope<ApplicationNote> | ApplicationNote>(
      `/applications/${id}/notes`,
      { note },
    );
  return unwrap<ApplicationNote>(response);
}

export async function applyJob(payload: ApplyJobPayload) {
  const response = await api.post<ApiEnvelope<JobSeekerApplication> | JobSeekerApplication>(
    "/applications",
    payload,
  );
  return unwrap<JobSeekerApplication>(response);
}

export async function getAppliedJobs(params: Record<string, unknown> = {}) {
  const response = await api.get<ApiEnvelope<AppliedJobsResponse> | AppliedJobsResponse>(
    "/applications/me",
    { params },
  );
  return unwrap<AppliedJobsResponse>(response);
}

export async function getApplicationDetails(applicationId: string) {
  const response = await api.get<ApiEnvelope<JobSeekerApplication> | JobSeekerApplication>(
    `/applications/${applicationId}`,
  );
  return unwrap<JobSeekerApplication>(response);
}

export async function withdrawApplication(applicationId: string) {
  const response = await api.patch<ApiEnvelope<JobSeekerApplication> | JobSeekerApplication>(
    `/applications/${applicationId}/withdraw`,
  );
  return unwrap<JobSeekerApplication>(response);
}

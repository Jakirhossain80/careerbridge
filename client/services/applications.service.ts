"use client";

import { api } from "@/lib/api";
import { mockApplicantDetails } from "@/data/mock-applicant-details";
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

let mockDetails = [...mockApplicantDetails];

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

function normalizeApplicationsResponse(
  payload:
    | EmployerApplicationsResponse
    | EmployerApplication[]
    | {
        applications?: RawEmployerApplication[];
        meta?: AppliedJobsResponse["meta"];
      },
  params: EmployerApplicationsQueryParams = {},
): EmployerApplicationsResponse {
  if (Array.isArray(payload)) {
    return normalizeApplicationsResponse(
      { applications: payload as unknown as RawEmployerApplication[] },
      params,
    );
  }

  const rawApplications =
    (payload as { applications?: RawEmployerApplication[] }).applications ?? [];
  const applications = rawApplications.map(mapEmployerApplication);
  const meta = (payload as { meta?: AppliedJobsResponse["meta"] }).meta;

  return {
    applications,
    total: payload.total ?? meta?.total ?? applications.length,
    page: payload.page ?? meta?.page ?? params.page ?? 1,
    limit: payload.limit ?? meta?.limit ?? params.limit ?? 10,
    totalPages: payload.totalPages ?? meta?.totalPages ?? 1,
    meta: {
      ...buildApplicationsMeta(applications),
      ...(payload.meta && !("page" in payload.meta) ? payload.meta : undefined),
    },
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
    ApiEnvelope<
      EmployerApplicationsResponse | EmployerApplication[] | {
        applications?: RawEmployerApplication[];
        meta?: AppliedJobsResponse["meta"];
      }
    > | EmployerApplicationsResponse
  >("/employer/applications", {
    params: {
      ...params,
      status: params.status === "all" ? undefined : params.status,
    },
  });

  return normalizeApplicationsResponse(unwrap(response), params);
}

export async function getApplicationById(id: string) {
  try {
    const response = await api.get<
      ApiEnvelope<RawEmployerApplication> | RawEmployerApplication
    >(
      `/employer/applications/${id}`,
    );
    return mapApplicantDetails(unwrap<RawEmployerApplication>(response));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const details = mockDetails.find((item) => item._id === id);

    if (details) {
      return details;
    }

    throw error;
  }
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
  try {
    const response = await api.post<ApiEnvelope<ApplicationNote> | ApplicationNote>(
      `/applications/${id}/notes`,
      { note },
    );
    return unwrap<ApplicationNote>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const details = mockDetails.find((item) => item._id === id);

    if (!details) {
      throw error;
    }

    const nextNote: ApplicationNote = {
      _id: `note-${Date.now()}`,
      authorName: "You",
      message: note,
      createdAt: new Date().toISOString(),
    };

    mockDetails = mockDetails.map((item) =>
      item._id === id
        ? {
            ...item,
            notes: [nextNote, ...(item.notes ?? [])],
          }
        : item,
    );

    return nextNote;
  }
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

"use client";

import { api } from "@/lib/api";
import { mockApplicantDetails } from "@/data/mock-applicant-details";
import { mockEmployerApplications } from "@/data/mock-applicants";
import type {
  ApplicantDetails,
  ApplicationNote,
  ApplicationStatus,
  EmployerApplication,
  EmployerApplicationsQueryParams,
  EmployerApplicationsResponse,
} from "@/types/application.types";
import { applicationStatusLabels } from "@/types/application.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

let mockApplications = [...mockEmployerApplications];
let mockDetails = [...mockApplicantDetails];

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
  payload: EmployerApplicationsResponse | EmployerApplication[],
  params: EmployerApplicationsQueryParams = {},
): EmployerApplicationsResponse {
  if (Array.isArray(payload)) {
    return filterMockApplications(payload, params);
  }

  return {
    applications: payload.applications ?? [],
    total: payload.total ?? payload.applications?.length ?? 0,
    page: payload.page ?? params.page ?? 1,
    limit: payload.limit ?? params.limit ?? 10,
    totalPages:
      payload.totalPages ??
      Math.max(Math.ceil((payload.total ?? 0) / (payload.limit ?? 10)), 1),
  };
}

function filterMockApplications(
  applications: EmployerApplication[],
  params: EmployerApplicationsQueryParams,
): EmployerApplicationsResponse {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = params.search?.trim().toLowerCase();

  let filtered = [...applications];

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((application) => application.status === params.status);
  }

  if (search) {
    filtered = filtered.filter((application) =>
      [
        application.applicantName,
        application.applicantEmail,
        application.jobTitle,
        ...(application.skills ?? []),
      ].some((value) => value.toLowerCase().includes(search)),
    );
  }

  filtered.sort((a, b) => {
    if (params.sortBy === "name") {
      return a.applicantName.localeCompare(b.applicantName);
    }

    if (params.sortBy === "dateApplied") {
      return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
    }

    return (b.matchScore ?? 0) - (a.matchScore ?? 0);
  });

  const total = filtered.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    applications: filtered.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages,
  };
}

export async function getEmployerApplications(
  params: EmployerApplicationsQueryParams = {},
) {
  try {
    const response = await api.get<
      ApiEnvelope<EmployerApplicationsResponse | EmployerApplication[]> | EmployerApplicationsResponse
    >("/applications/employer", {
      params: {
        ...params,
        status: params.status === "all" ? undefined : params.status,
      },
    });

    return normalizeApplicationsResponse(unwrap(response), params);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return filterMockApplications(mockApplications, params);
  }
}

function mergeMockApplicationDetails(application: EmployerApplication): ApplicantDetails {
  return {
    ...application,
    applicantPhone: "+1 (555) 013-4477",
    location: "Remote",
    education: "Candidate education details pending",
    careerSummary:
      "This applicant profile is using development fallback data until the application details endpoint returns a full profile.",
    resumeFileName: application.resumeUrl?.split("/").pop(),
    notes: [],
    statusHistory: [
      {
        status: "applied",
        label: "Applied",
        createdAt: application.appliedAt,
      },
      {
        status: application.status,
        label: applicationStatusLabels[application.status],
        createdAt: application.appliedAt,
      },
    ],
  };
}

export async function getApplicationById(id: string) {
  try {
    const response = await api.get<ApiEnvelope<ApplicantDetails> | ApplicantDetails>(
      `/applications/${id}`,
    );
    return unwrap<ApplicantDetails>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const details = mockDetails.find((item) => item._id === id);

    if (details) {
      return details;
    }

    const application = mockApplications.find((item) => item._id === id);

    if (!application) {
      throw error;
    }

    return mergeMockApplicationDetails(application);
  }
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
) {
  try {
    const response = await api.patch<ApiEnvelope<ApplicantDetails> | ApplicantDetails>(
      `/applications/${id}/status`,
      { status },
    );
    return unwrap<ApplicantDetails>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const application = mockApplications.find((item) => item._id === id);

    if (!application) {
      throw error;
    }

    mockApplications = mockApplications.map((item) =>
      item._id === id ? { ...item, status } : item,
    );
    const updatedDetails = mockDetails.find((item) => item._id === id);
    const nextDetails = updatedDetails
      ? {
          ...updatedDetails,
          status,
          statusHistory: [
            ...(updatedDetails.statusHistory ?? []),
            {
              status,
              label: applicationStatusLabels[status],
              createdAt: new Date().toISOString(),
            },
          ],
        }
      : mergeMockApplicationDetails({ ...application, status });

    mockDetails = updatedDetails
      ? mockDetails.map((item) => (item._id === id ? nextDetails : item))
      : [...mockDetails, nextDetails];

    return nextDetails;
  }
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

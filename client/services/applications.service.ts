"use client";

import { api } from "@/lib/api";
import { mockEmployerApplications } from "@/data/mock-applicants";
import type {
  ApplicationStatus,
  EmployerApplication,
  EmployerApplicationsQueryParams,
  EmployerApplicationsResponse,
} from "@/types/application.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

let mockApplications = [...mockEmployerApplications];

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

export async function getApplicationById(id: string) {
  try {
    const response = await api.get<ApiEnvelope<EmployerApplication> | EmployerApplication>(
      `/applications/${id}`,
    );
    return unwrap<EmployerApplication>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const application = mockApplications.find((item) => item._id === id);

    if (!application) {
      throw error;
    }

    return application;
  }
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
) {
  try {
    const response = await api.patch<ApiEnvelope<EmployerApplication> | EmployerApplication>(
      `/applications/${id}/status`,
      { status },
    );
    return unwrap<EmployerApplication>(response);
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

    return { ...application, status };
  }
}

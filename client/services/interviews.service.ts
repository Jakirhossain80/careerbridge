"use client";

import { api } from "@/lib/api";
import { mockInterviews } from "@/data/mock-interviews";
import type {
  EmployerInterviewsResponse,
  Interview,
  InterviewFiltersParams,
  InterviewPayload,
} from "@/types/interview.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

let localMockInterviews = [...mockInterviews];

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

function getInterviewDateTime(interview: Interview) {
  return new Date(`${interview.interviewDate}T${interview.interviewTime}`).getTime();
}

function buildMeta(interviews: Interview[]) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const todayKey = now.toISOString().slice(0, 10);
  const thisMonth = interviews.filter((interview) => {
    const date = new Date(interview.interviewDate);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  return {
    totalThisMonth: thisMonth.length,
    completedThisMonth: thisMonth.filter(
      (interview) => interview.status === "completed",
    ).length,
    upcomingToday: interviews.filter(
      (interview) =>
        interview.interviewDate === todayKey &&
        !["cancelled", "completed", "no_show"].includes(interview.status),
    ).length,
    cancelledThisMonth: thisMonth.filter(
      (interview) => interview.status === "cancelled",
    ).length,
    jobTitles: Array.from(
      new Set(interviews.map((interview) => interview.jobTitle).filter(Boolean)),
    ) as string[],
  };
}

function filterMockInterviews(
  interviews: Interview[],
  params: InterviewFiltersParams = {},
): EmployerInterviewsResponse {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = params.search?.trim().toLowerCase();

  let filtered = [...interviews];

  if (search) {
    filtered = filtered.filter((interview) =>
      [
        interview.candidateName ?? "",
        interview.candidateEmail ?? "",
        interview.jobTitle ?? "",
        interview.interviewerName,
      ].some((value) => value.toLowerCase().includes(search)),
    );
  }

  if (params.dateFrom) {
    filtered = filtered.filter(
      (interview) =>
        new Date(interview.interviewDate).getTime() >=
        new Date(params.dateFrom as string).getTime(),
    );
  }

  if (params.dateTo) {
    const dateTo = new Date(params.dateTo);
    dateTo.setHours(23, 59, 59, 999);
    filtered = filtered.filter(
      (interview) => new Date(interview.interviewDate).getTime() <= dateTo.getTime(),
    );
  }

  if (params.jobTitle && params.jobTitle !== "all") {
    filtered = filtered.filter((interview) => interview.jobTitle === params.jobTitle);
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((interview) => interview.status === params.status);
  }

  if (params.interviewType && params.interviewType !== "all") {
    filtered = filtered.filter(
      (interview) => interview.interviewType === params.interviewType,
    );
  }

  filtered.sort((a, b) => {
    if (params.sortBy === "dateDesc") {
      return getInterviewDateTime(b) - getInterviewDateTime(a);
    }

    if (params.sortBy === "candidate") {
      return (a.candidateName ?? "").localeCompare(b.candidateName ?? "");
    }

    if (params.sortBy === "jobTitle") {
      return (a.jobTitle ?? "").localeCompare(b.jobTitle ?? "");
    }

    return getInterviewDateTime(a) - getInterviewDateTime(b);
  });

  const total = filtered.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    interviews: filtered.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages,
    meta: buildMeta(interviews),
  };
}

function normalizeInterviewsResponse(
  payload: EmployerInterviewsResponse | Interview[],
  params: InterviewFiltersParams = {},
): EmployerInterviewsResponse {
  if (Array.isArray(payload)) {
    return filterMockInterviews(payload, params);
  }

  return {
    interviews: payload.interviews ?? [],
    total: payload.total ?? payload.interviews?.length ?? 0,
    page: payload.page ?? params.page ?? 1,
    limit: payload.limit ?? params.limit ?? 10,
    totalPages:
      payload.totalPages ??
      Math.max(Math.ceil((payload.total ?? 0) / (payload.limit ?? 10)), 1),
    meta: payload.meta ?? buildMeta(payload.interviews ?? []),
  };
}

export async function getEmployerInterviews(
  params: InterviewFiltersParams = {},
) {
  try {
    const response = await api.get<
      ApiEnvelope<EmployerInterviewsResponse | Interview[]> | EmployerInterviewsResponse
    >("/interviews/employer", {
      params: {
        ...params,
        status: params.status === "all" ? undefined : params.status,
        interviewType:
          params.interviewType === "all" ? undefined : params.interviewType,
        jobTitle: params.jobTitle === "all" ? undefined : params.jobTitle,
      },
    });

    return normalizeInterviewsResponse(unwrap(response), params);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return filterMockInterviews(localMockInterviews, params);
  }
}

export async function getInterviewById(id: string) {
  try {
    const response = await api.get<ApiEnvelope<Interview> | Interview>(
      `/interviews/${id}`,
    );
    return unwrap<Interview>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const interview = localMockInterviews.find((item) => item._id === id);

    if (!interview) {
      throw error;
    }

    return interview;
  }
}

export async function createInterview(payload: InterviewPayload) {
  try {
    const response = await api.post<ApiEnvelope<Interview> | Interview>(
      "/interviews",
      payload,
    );
    return unwrap<Interview>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const now = new Date().toISOString();
    const interview: Interview = {
      ...payload,
      _id: `int-${Date.now()}`,
      employerId: "employer-careerbridge",
      createdAt: now,
      updatedAt: now,
    };

    localMockInterviews = [interview, ...localMockInterviews];
    return interview;
  }
}

export async function updateInterview(id: string, payload: Partial<InterviewPayload>) {
  try {
    const response = await api.patch<ApiEnvelope<Interview> | Interview>(
      `/interviews/${id}`,
      payload,
    );
    return unwrap<Interview>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const current = localMockInterviews.find((item) => item._id === id);

    if (!current) {
      throw error;
    }

    const updated = {
      ...current,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    localMockInterviews = localMockInterviews.map((item) =>
      item._id === id ? updated : item,
    );
    return updated;
  }
}

export async function deleteInterview(id: string) {
  try {
    const response = await api.delete<ApiEnvelope<Interview> | Interview>(
      `/interviews/${id}`,
    );
    return unwrap<Interview>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    const current = localMockInterviews.find((item) => item._id === id);

    if (!current) {
      throw error;
    }

    const cancelled = {
      ...current,
      status: "cancelled" as const,
      updatedAt: new Date().toISOString(),
    };

    localMockInterviews = localMockInterviews.map((item) =>
      item._id === id ? cancelled : item,
    );
    return cancelled;
  }
}

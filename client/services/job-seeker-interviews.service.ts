"use client";

import { mockJobSeekerInterviews } from "@/data/mock-job-seeker-interviews";
import { api } from "@/lib/api";
import type {
  InterviewConfirmationPayload,
  InterviewReschedulePayload,
  JobSeekerInterview,
  JobSeekerInterviewFiltersParams,
  JobSeekerInterviewsMeta,
  JobSeekerInterviewsResponse,
} from "@/types/interview.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

let localMockInterviews = [...mockJobSeekerInterviews];

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

function getInterviewDateTime(interview: JobSeekerInterview) {
  return new Date(`${interview.interviewDate}T${interview.interviewTime}`).getTime();
}

function isPastInterview(interview: JobSeekerInterview) {
  if (["completed", "cancelled", "no_show"].includes(interview.status)) {
    return true;
  }

  return getInterviewDateTime(interview) < Date.now();
}

function buildMeta(interviews: JobSeekerInterview[]): JobSeekerInterviewsMeta {
  const completed = interviews.filter((interview) => interview.status === "completed");
  const closed = interviews.filter((interview) =>
    ["completed", "cancelled", "no_show"].includes(interview.status),
  );

  return {
    upcoming: interviews.filter((interview) => !isPastInterview(interview)).length,
    completed: completed.length,
    successRate:
      closed.length > 0 ? Math.round((completed.length / closed.length) * 100) : 0,
    rescheduleRequests: interviews.filter(
      (interview) => interview.status === "rescheduled",
    ).length,
  };
}

function filterInterviews(
  interviews: JobSeekerInterview[],
  params: JobSeekerInterviewFiltersParams = {},
): JobSeekerInterviewsResponse {
  const page = params.page ?? 1;
  const limit = params.limit ?? 8;
  const search = params.search?.trim().toLowerCase();

  let filtered = [...interviews];

  if (search) {
    filtered = filtered.filter((interview) =>
      [interview.jobTitle, interview.companyName].some((value) =>
        value.toLowerCase().includes(search),
      ),
    );
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((interview) => interview.status === params.status);
  }

  if (params.interviewType && params.interviewType !== "all") {
    filtered = filtered.filter(
      (interview) => interview.interviewType === params.interviewType,
    );
  }

  if (params.period === "upcoming") {
    filtered = filtered.filter((interview) => !isPastInterview(interview));
  }

  if (params.period === "past") {
    filtered = filtered.filter((interview) => isPastInterview(interview));
  }

  filtered.sort((a, b) => {
    if (params.sortBy === "newest_invitation") {
      return (
        new Date(b.invitedAt ?? b.createdAt).getTime() -
        new Date(a.invitedAt ?? a.createdAt).getTime()
      );
    }

    if (params.sortBy === "oldest_invitation") {
      return (
        new Date(a.invitedAt ?? a.createdAt).getTime() -
        new Date(b.invitedAt ?? b.createdAt).getTime()
      );
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

function normalizeResponse(
  payload: JobSeekerInterviewsResponse | JobSeekerInterview[],
  params: JobSeekerInterviewFiltersParams = {},
) {
  if (Array.isArray(payload)) {
    return filterInterviews(payload, params);
  }

  return {
    interviews: payload.interviews ?? [],
    total: payload.total ?? payload.interviews?.length ?? 0,
    page: payload.page ?? params.page ?? 1,
    limit: payload.limit ?? params.limit ?? 8,
    totalPages:
      payload.totalPages ??
      Math.max(Math.ceil((payload.total ?? 0) / (payload.limit ?? 8)), 1),
    meta: payload.meta ?? buildMeta(payload.interviews ?? []),
  };
}

export async function getMyInterviews(
  params: JobSeekerInterviewFiltersParams = {},
) {
  try {
    const response = await api.get<
      | ApiEnvelope<JobSeekerInterviewsResponse | JobSeekerInterview[]>
      | JobSeekerInterviewsResponse
    >("/interviews/me", {
      params: {
        ...params,
        status: params.status === "all" ? undefined : params.status,
        interviewType:
          params.interviewType === "all" ? undefined : params.interviewType,
        period: params.period === "all" ? undefined : params.period,
      },
    });

    return normalizeResponse(unwrap(response), params);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return filterInterviews(localMockInterviews, params);
  }
}

export async function getInterviewById(interviewId: string) {
  try {
    const response = await api.get<ApiEnvelope<JobSeekerInterview> | JobSeekerInterview>(
      `/interviews/${interviewId}`,
    );
    return unwrap<JobSeekerInterview>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return localMockInterviews.find((interview) => interview._id === interviewId);
  }
}

export async function confirmInterviewAttendance(
  interviewId: string,
  payload: InterviewConfirmationPayload,
) {
  try {
    const response = await api.patch<ApiEnvelope<JobSeekerInterview> | JobSeekerInterview>(
      `/interviews/${interviewId}/confirmation`,
      payload,
    );
    return unwrap<JobSeekerInterview>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    localMockInterviews = localMockInterviews.map((interview) =>
      interview._id === interviewId
        ? {
            ...interview,
            status: payload.confirmed ? "confirmed" : interview.status,
            updatedAt: new Date().toISOString(),
          }
        : interview,
    );

    const updated = localMockInterviews.find(
      (interview) => interview._id === interviewId,
    );

    if (!updated) {
      throw error;
    }

    return updated;
  }
}

export async function requestInterviewReschedule(
  interviewId: string,
  payload: InterviewReschedulePayload,
) {
  try {
    const response = await api.post<ApiEnvelope<JobSeekerInterview> | JobSeekerInterview>(
      `/interviews/${interviewId}/reschedule-request`,
      payload,
    );
    return unwrap<JobSeekerInterview>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    localMockInterviews = localMockInterviews.map((interview) =>
      interview._id === interviewId
        ? {
            ...interview,
            status: "rescheduled",
            notes: payload.note ?? interview.notes,
            updatedAt: new Date().toISOString(),
          }
        : interview,
    );

    const updated = localMockInterviews.find(
      (interview) => interview._id === interviewId,
    );

    if (!updated) {
      throw error;
    }

    return updated;
  }
}

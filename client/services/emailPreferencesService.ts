"use client";

import { api } from "@/lib/api";
import type { EmailPreferences } from "@/types/email-preferences";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

const defaultEmailPreferences: EmailPreferences = {
  applicationSubmittedEmail: true,
  applicationStatusChangedEmail: true,
  interviewScheduledEmail: true,
  employerApprovedEmail: true,
  jobApprovedRejectedEmail: true,
  newJobAlertEmail: true,
};

let localEmailPreferences = defaultEmailPreferences;

export const emailPreferencesQueryKeys = {
  all: ["email-preferences"] as const,
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

function normalizeEmailPreferences(
  preferences: Partial<EmailPreferences>,
): EmailPreferences {
  return {
    ...defaultEmailPreferences,
    ...preferences,
  };
}

export async function getEmailPreferences() {
  try {
    const response = await api.get<ApiEnvelope<EmailPreferences> | EmailPreferences>(
      "/settings/email-preferences",
    );

    return normalizeEmailPreferences(unwrap<EmailPreferences>(response));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return localEmailPreferences;
  }
}

export async function updateEmailPreferences(payload: EmailPreferences) {
  try {
    const response = await api.patch<ApiEnvelope<EmailPreferences> | EmailPreferences>(
      "/settings/email-preferences",
      payload,
    );

    return normalizeEmailPreferences(unwrap<EmailPreferences>(response));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    localEmailPreferences = normalizeEmailPreferences(payload);
    return localEmailPreferences;
  }
}

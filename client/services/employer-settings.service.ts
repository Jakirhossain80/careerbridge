"use client";

import { api } from "@/lib/api";
import type {
  EmployerCompanySettings,
  EmployerSettings,
  EmployerSettingsPayload,
} from "@/types/employer-settings.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

export const employerSettingsQueryKeys = {
  all: ["employer-settings"] as const,
  detail: ["employer-settings", "me"] as const,
  company: ["employer-company-profile"] as const,
  authUser: ["auth", "current-user"] as const,
};

export const defaultEmployerSettings: EmployerSettings = {
  account: {
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    designation: "",
  },
  company: {
    companyId: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    website: "",
    location: "",
    industry: "",
    companySize: "",
  },
  notifications: {
    newApplicant: true,
    interviewReminder: true,
    jobExpiry: true,
    emailNotifications: true,
    dailyDigest: false,
  },
  privacy: {
    companyProfileVisible: true,
    jobPostingVisible: true,
    contactInfoVisible: true,
    showCompanySize: true,
    showSalaryRange: true,
  },
  team: [],
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

function normalizeEmployerSettings(settings: EmployerSettings): EmployerSettings {
  return {
    ...defaultEmployerSettings,
    ...settings,
    account: {
      ...defaultEmployerSettings.account,
      ...settings.account,
    },
    company: {
      ...defaultEmployerSettings.company,
      ...settings.company,
    },
    notifications: {
      ...defaultEmployerSettings.notifications,
      ...settings.notifications,
    },
    privacy: {
      ...defaultEmployerSettings.privacy,
      ...settings.privacy,
    },
    team: settings.team ?? [],
  };
}

export async function getEmployerSettings() {
  const response = await api.get<ApiEnvelope<EmployerSettings> | EmployerSettings>(
    "/employer/settings",
  );

  return normalizeEmployerSettings(unwrap<EmployerSettings>(response));
}

export async function updateEmployerSettings(payload: EmployerSettingsPayload) {
  const response = await api.patch<ApiEnvelope<EmployerSettings> | EmployerSettings>(
    "/employer/settings",
    payload,
  );

  return normalizeEmployerSettings(unwrap<EmployerSettings>(response));
}

export async function updateCompanySettings(
  companyId: string,
  payload: Partial<EmployerCompanySettings>,
) {
  try {
    const response = await api.patch<
      ApiEnvelope<EmployerCompanySettings> | EmployerCompanySettings
    >(`/companies/${companyId}/settings`, payload);

    return unwrap<EmployerCompanySettings>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return {
      ...defaultEmployerSettings.company,
      companyId,
      ...payload,
    };
  }
}

export async function updateUserSettings(
  payload: Partial<EmployerSettingsPayload["account"]>,
) {
  try {
    const response = await api.patch<
      ApiEnvelope<EmployerSettingsPayload["account"]> | EmployerSettingsPayload["account"]
    >("/users/me/settings", payload);

    return unwrap<EmployerSettingsPayload["account"]>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return {
      ...defaultEmployerSettings.account,
      ...payload,
    };
  }
}

export async function deactivateEmployerAccount() {
  const response = await api.patch<
      ApiEnvelope<{ deactivated: boolean }> | { deactivated: boolean }
    >("/employers/deactivate");

  return unwrap<{ deactivated: boolean }>(response);
}

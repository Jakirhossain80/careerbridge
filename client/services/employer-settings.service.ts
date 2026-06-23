"use client";

import { api } from "@/lib/api";
import { mockEmployerSettings } from "@/data/mock-employer-settings";
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

export async function getEmployerSettings() {
  try {
    const response = await api.get<ApiEnvelope<EmployerSettings> | EmployerSettings>(
      "/employers/settings",
    );
    return unwrap<EmployerSettings>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return mockEmployerSettings;
  }
}

export async function updateEmployerSettings(payload: EmployerSettingsPayload) {
  try {
    const response = await api.patch<ApiEnvelope<EmployerSettings> | EmployerSettings>(
      "/employers/settings",
      payload,
    );

    return unwrap<EmployerSettings>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return payload;
  }
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
      ...mockEmployerSettings.company,
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
      ...mockEmployerSettings.account,
      ...payload,
    };
  }
}

export async function deactivateEmployerAccount() {
  try {
    const response = await api.patch<
      ApiEnvelope<{ deactivated: boolean }> | { deactivated: boolean }
    >("/employers/deactivate");

    return unwrap<{ deactivated: boolean }>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return { deactivated: true };
  }
}

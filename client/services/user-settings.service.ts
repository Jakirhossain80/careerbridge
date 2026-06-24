"use client";

import { mockUserSettings } from "@/data/mock-user-settings";
import { api } from "@/lib/api";
import type { UserSettings, UserSettingsPayload } from "@/types/user-settings.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

let localMockSettings: UserSettings = mockUserSettings;

export const userSettingsQueryKeys = {
  all: ["user-settings"] as const,
  profile: ["job-seeker-profile"] as const,
  dashboard: ["job-seeker-dashboard"] as const,
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

function normalizeSettings(settings: Partial<UserSettings>): UserSettings {
  return {
    ...mockUserSettings,
    ...settings,
    accountPreferences: {
      ...mockUserSettings.accountPreferences,
      ...settings.accountPreferences,
    },
    notificationPreferences: {
      ...mockUserSettings.notificationPreferences,
      ...settings.notificationPreferences,
    },
    privacySettings: {
      ...mockUserSettings.privacySettings,
      ...settings.privacySettings,
    },
    jobPreferences: {
      ...mockUserSettings.jobPreferences,
      ...settings.jobPreferences,
    },
  };
}

export async function getUserSettings() {
  try {
    const response = await api.get<ApiEnvelope<UserSettings> | UserSettings>(
      "/users/me/settings",
    );

    return normalizeSettings(unwrap<UserSettings>(response));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return localMockSettings;
  }
}

export async function updateUserSettings(payload: UserSettingsPayload) {
  try {
    const response = await api.patch<ApiEnvelope<UserSettings> | UserSettings>(
      "/users/me/settings",
      payload,
    );

    return normalizeSettings(unwrap<UserSettings>(response));
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    localMockSettings = normalizeSettings({
      ...payload,
      updatedAt: new Date().toISOString(),
    });

    return localMockSettings;
  }
}

export async function updateNotificationSettings(
  payload: UserSettingsPayload["notificationPreferences"],
) {
  return updateUserSettings({
    ...localMockSettings,
    notificationPreferences: payload,
  });
}

export async function updatePrivacySettings(
  payload: UserSettingsPayload["privacySettings"],
) {
  return updateUserSettings({
    ...localMockSettings,
    privacySettings: payload,
  });
}

export async function deactivateAccount() {
  try {
    const response = await api.patch<
      ApiEnvelope<{ deactivated: boolean }> | { deactivated: boolean }
    >("/users/me/deactivate");

    return unwrap<{ deactivated: boolean }>(response);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    return { deactivated: true };
  }
}

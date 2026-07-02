"use client";

import { api } from "@/lib/api";
import type { UserSettings, UserSettingsPayload } from "@/types/user-settings.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

export const userSettingsQueryKeys = {
  all: ["user-settings"] as const,
  profile: ["job-seeker-profile"] as const,
  dashboard: ["job-seeker-dashboard"] as const,
};

export const defaultUserSettings: UserSettings = {
  accountPreferences: {
    currentEmail: "",
    newEmail: "",
    phone: "",
    linkedProfiles: [],
    language: "en",
    timeZone: "Asia/Dhaka",
  },
  notificationPreferences: {
    enableNotifications: true,
    emailNotifications: true,
    applicationUpdates: true,
    interviewNotifications: true,
    interviewReminders: true,
    jobAlerts: true,
    recommendedJobs: true,
  },
  privacySettings: {
    profileVisibility: "recruiters_only",
    resumeVisibility: "recruiters_only",
    contactInfoVisible: true,
    publicSearchVisible: true,
  },
  jobPreferences: {
    preferredCategories: [],
    preferredLocations: [],
    preferredEmploymentTypes: [],
    preferredWorkModes: [],
  },
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
    ...defaultUserSettings,
    ...settings,
    accountPreferences: {
      ...defaultUserSettings.accountPreferences,
      ...settings.accountPreferences,
    },
    notificationPreferences: {
      ...defaultUserSettings.notificationPreferences,
      ...settings.notificationPreferences,
    },
    privacySettings: {
      ...defaultUserSettings.privacySettings,
      ...settings.privacySettings,
    },
    jobPreferences: {
      ...defaultUserSettings.jobPreferences,
      ...settings.jobPreferences,
    },
  };
}

function emptyToUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toProfileSettingsPayload(payload: UserSettingsPayload) {
  const account = payload.accountPreferences;
  const preferences = payload.jobPreferences;

  return {
    email: emptyToUndefined(account.newEmail) ?? emptyToUndefined(account.currentEmail),
    phone: emptyToUndefined(account.phone),
    language: emptyToUndefined(account.language),
    timeZone: emptyToUndefined(account.timeZone),
    linkedProfiles: account.linkedProfiles ?? [],
    notificationPreferences: payload.notificationPreferences,
    privacySettings: payload.privacySettings,
    preferredCategories: preferences?.preferredCategories ?? [],
    preferredLocations: preferences?.preferredLocations ?? [],
    preferredJobTypes: preferences?.preferredEmploymentTypes ?? [],
    preferredWorkModes: preferences?.preferredWorkModes ?? [],
    expectedSalaryMin: preferences?.expectedSalaryMin,
    expectedSalaryMax: preferences?.expectedSalaryMax,
  };
}

export async function getUserSettings() {
  const response = await api.get<ApiEnvelope<UserSettings> | UserSettings>(
    "/job-seekers/me/settings",
  );

  return normalizeSettings(unwrap<UserSettings>(response));
}

export async function updateUserSettings(payload: UserSettingsPayload) {
  const response = await api.patch<ApiEnvelope<UserSettings> | UserSettings>(
    "/job-seekers/me/settings",
    toProfileSettingsPayload(payload),
  );

  return normalizeSettings(unwrap<UserSettings>(response));
}

export async function updateNotificationSettings(
  payload: UserSettingsPayload["notificationPreferences"],
) {
  return updateUserSettings({
    ...defaultUserSettings,
    notificationPreferences: payload,
  });
}

export async function updatePrivacySettings(
  payload: UserSettingsPayload["privacySettings"],
) {
  return updateUserSettings({
    ...defaultUserSettings,
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

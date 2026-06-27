"use client";

import { api } from "@/lib/api";
import type {
  AdminSystemSettings,
  AdminSystemSettingsPayload,
} from "@/types/admin-settings";

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

export const adminSettingsQueryKeys = {
  settings: ["admin-settings"] as const,
  categories: ["admin-settings-categories"] as const,
  auditLog: ["admin-settings-audit-log"] as const,
};

export async function getAdminSettings() {
  const response = await api.get<ApiEnvelope<AdminSystemSettings> | AdminSystemSettings>(
    "/admin/settings",
  );

  return unwrap<AdminSystemSettings>(response);
}

export async function updateAdminSettings(payload: AdminSystemSettingsPayload) {
  const response = await api.patch<ApiEnvelope<AdminSystemSettings> | AdminSystemSettings>(
    "/admin/settings",
    payload,
  );

  return unwrap<AdminSystemSettings>(response);
}

export async function resetAdminSettings() {
  const response = await api.post<ApiEnvelope<AdminSystemSettings> | AdminSystemSettings>(
    "/admin/settings/reset",
  );

  return unwrap<AdminSystemSettings>(response);
}

export async function getAdminSettingsCategories() {
  const response = await api.get<ApiEnvelope<string[]> | string[]>(
    "/admin/settings/categories",
  );

  return unwrap<string[]>(response);
}

import { api } from "@/lib/api";

export type AuthUserRole = "job_seeker" | "employer" | "admin" | "super_admin";
export type AuthUserStatus = "active" | "pending" | "suspended" | "blocked";
export type AuthProvider = "google" | "password";
export type NewAuthUserRole = Extract<AuthUserRole, "job_seeker" | "employer">;

export type SyncedAuthUser = {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: AuthUserRole;
  status: AuthUserStatus;
  authProvider: AuthProvider;
  emailVerified: boolean;
  lastLoginAt: string | null;
  isDeleted: boolean;
  profileCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const authQueryKeys = {
  currentUser: ["auth", "current-user"] as const,
};

const pendingAuthSyncRoleKey = "careerbridge.pendingAuthSyncRole";

const isNewAuthUserRole = (role: unknown): role is NewAuthUserRole => {
  return role === "job_seeker" || role === "employer";
};

export const setPendingAuthSyncRole = (role: NewAuthUserRole) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(pendingAuthSyncRoleKey, role);
};

export const clearPendingAuthSyncRole = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(pendingAuthSyncRoleKey);
};

export const consumePendingAuthSyncInput = ():
  | SyncAuthenticatedUserInput
  | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const role = window.sessionStorage.getItem(pendingAuthSyncRoleKey);
  window.sessionStorage.removeItem(pendingAuthSyncRoleKey);

  return isNewAuthUserRole(role) ? { role } : undefined;
};

type ApiResponse<TData> = {
  success: boolean;
  message: string;
  data: TData;
  error: unknown;
};

export type SyncAuthenticatedUserInput = {
  role?: NewAuthUserRole;
};

export async function syncAuthenticatedUser(input?: SyncAuthenticatedUserInput) {
  const response = await api.post<ApiResponse<SyncedAuthUser>>(
    "/users/sync",
    input ?? {}
  );

  return response.data.data;
}

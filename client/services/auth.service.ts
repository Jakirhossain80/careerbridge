import { api } from "@/lib/api";

export type AuthUserRole = "job_seeker" | "employer" | "admin" | "super_admin";
export type AuthUserStatus = "active" | "pending" | "suspended" | "blocked";
export type AuthProvider = "google" | "password";

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

type ApiResponse<TData> = {
  success: boolean;
  message: string;
  data: TData;
  error: unknown;
};

export async function syncAuthenticatedUser() {
  const response = await api.post<ApiResponse<SyncedAuthUser>>("/users/sync");

  return response.data.data;
}

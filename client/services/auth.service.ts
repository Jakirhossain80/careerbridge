import { api } from "@/lib/api";

export type AuthUserRole = "job_seeker" | "employer" | "admin" | "super_admin";
export type AuthUserStatus = "active" | "pending" | "suspended" | "blocked";

export type SyncedAuthUser = {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: AuthUserRole;
  status: AuthUserStatus;
  profileCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
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

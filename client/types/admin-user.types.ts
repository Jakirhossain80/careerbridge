import type {
  AdminListParams,
  AdminMeta,
  AdminRole,
  AdminUser,
  AdminUserStatus,
} from "@/types/admin.types";

export type UserRole = AdminRole;
export type UserStatus = AdminUserStatus;

export type AdminUsersSortBy = "newest" | "oldest" | "name_asc" | "name_desc";

export type AdminUsersTab = "all" | "job_seekers" | "employers" | "admins";

export type AdminUsersFilters = Omit<AdminListParams, "sortBy" | "role" | "status"> & {
  role?: UserRole | "all";
  status?: UserStatus | "all";
  sortBy?: AdminUsersSortBy;
};

export type { AdminMeta, AdminUser };

export interface AdminUsersResponse {
  users: AdminUser[];
  meta: AdminMeta;
}

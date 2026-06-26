"use client";

import { api } from "@/lib/api";
import type {
  AdminApplication,
  AdminBlog,
  AdminCategory,
  AdminEmployer,
  AdminJob,
  AdminListParams,
  AdminMeta,
  AdminReport,
  AdminStats,
  AdminUser,
} from "@/types/admin.types";

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

export const adminQueryKeys = {
  stats: ["admin-stats"] as const,
  users: (filters: AdminListParams) => ["admin-users", filters] as const,
  user: (userId: string) => ["admin-user", userId] as const,
  employers: (filters: AdminListParams) => ["admin-employers", filters] as const,
  employer: (employerId: string) => ["admin-employer", employerId] as const,
  jobs: (filters: AdminListParams) => ["admin-jobs", filters] as const,
  job: (jobId: string) => ["admin-job", jobId] as const,
  applications: (filters: AdminListParams) =>
    ["admin-applications", filters] as const,
  application: (applicationId: string) =>
    ["admin-application", applicationId] as const,
  categories: (filters: AdminListParams = {}) =>
    ["admin-categories", filters] as const,
  blogs: (filters: AdminListParams) => ["admin-blogs", filters] as const,
  blog: (blogId: string) => ["admin-blog", blogId] as const,
  reports: (filters: AdminListParams) => ["admin-reports", filters] as const,
  report: (reportId: string) => ["admin-report", reportId] as const,
};

export async function getAdminStats() {
  const response = await api.get<ApiEnvelope<AdminStats> | AdminStats>("/admin/stats");
  return unwrap<AdminStats>(response);
}

export async function getAdminUsers(params: AdminListParams = {}) {
  const response = await api.get<
    ApiEnvelope<{ users: AdminUser[]; meta: AdminMeta }> | {
      users: AdminUser[];
      meta: AdminMeta;
    }
  >("/admin/users", { params });
  return unwrap<{ users: AdminUser[]; meta: AdminMeta }>(response);
}

export async function getAdminUser(userId: string) {
  const response = await api.get<ApiEnvelope<AdminUser> | AdminUser>(
    `/admin/users/${userId}`,
  );
  return unwrap<AdminUser>(response);
}

export async function updateAdminUser(userId: string, payload: Partial<AdminUser>) {
  const response = await api.patch<ApiEnvelope<AdminUser> | AdminUser>(
    `/admin/users/${userId}`,
    payload,
  );
  return unwrap<AdminUser>(response);
}

export async function changeAdminUserRole(userId: string, role: AdminUser["role"]) {
  const response = await api.patch<ApiEnvelope<AdminUser> | AdminUser>(
    `/admin/users/${userId}/role`,
    { role },
  );
  return unwrap<AdminUser>(response);
}

export async function updateAdminUserStatus(
  userId: string,
  status: AdminUser["status"],
) {
  return updateAdminUser(userId, { status });
}

export async function blockAdminUser(userId: string) {
  const response = await api.patch<ApiEnvelope<AdminUser> | AdminUser>(
    `/admin/users/${userId}/block`,
  );
  return unwrap<AdminUser>(response);
}

export async function unblockAdminUser(userId: string) {
  const response = await api.patch<ApiEnvelope<AdminUser> | AdminUser>(
    `/admin/users/${userId}/unblock`,
  );
  return unwrap<AdminUser>(response);
}

export const getAdminUserById = getAdminUser;
export const updateUserRole = changeAdminUserRole;
export const updateUserStatus = updateAdminUserStatus;
export const blockUser = blockAdminUser;
export const unblockUser = unblockAdminUser;

export async function getAdminEmployers(params: AdminListParams = {}) {
  const response = await api.get("/admin/employers", { params });
  return unwrap<{ employers: AdminEmployer[]; meta: AdminMeta }>(response);
}

export async function getAdminEmployer(employerId: string) {
  const response = await api.get(`/admin/employers/${employerId}`);
  return unwrap<AdminEmployer>(response);
}

export async function updateAdminEmployer(
  employerId: string,
  payload: Record<string, unknown>,
) {
  const response = await api.patch(`/admin/employers/${employerId}`, payload);
  return unwrap<AdminEmployer>(response);
}

export async function approveAdminEmployer(employerId: string, reason?: string) {
  const response = await api.patch(`/admin/employers/${employerId}/approve`, { reason });
  return unwrap<AdminEmployer>(response);
}

export async function rejectAdminEmployer(employerId: string, reason?: string) {
  const response = await api.patch(`/admin/employers/${employerId}/reject`, { reason });
  return unwrap<AdminEmployer>(response);
}

export async function getAdminJobs(params: AdminListParams = {}) {
  const response = await api.get("/admin/jobs", { params });
  return unwrap<{ jobs: AdminJob[]; meta: AdminMeta }>(response);
}

export async function getAdminJob(jobId: string) {
  const response = await api.get(`/admin/jobs/${jobId}`);
  return unwrap<AdminJob>(response);
}

export async function approveAdminJob(jobId: string, reason?: string) {
  const response = await api.patch(`/admin/jobs/${jobId}/approve`, { reason });
  return unwrap<AdminJob>(response);
}

export async function rejectAdminJob(jobId: string, reason?: string) {
  const response = await api.patch(`/admin/jobs/${jobId}/reject`, { reason });
  return unwrap<AdminJob>(response);
}

export async function archiveAdminJob(jobId: string) {
  const response = await api.delete(`/admin/jobs/${jobId}`);
  return unwrap<AdminJob>(response);
}

export async function getAdminApplications(params: AdminListParams = {}) {
  const response = await api.get("/admin/applications", { params });
  return unwrap<{ applications: AdminApplication[]; meta: AdminMeta }>(response);
}

export async function getAdminApplication(applicationId: string) {
  const response = await api.get(`/admin/applications/${applicationId}`);
  return unwrap<AdminApplication>(response);
}

export async function updateAdminApplicationStatus(applicationId: string, status: string) {
  const response = await api.patch(`/admin/applications/${applicationId}`, { status });
  return unwrap<AdminApplication>(response);
}

export async function getAdminCategories(params: AdminListParams = {}) {
  const response = await api.get("/admin/categories", { params });
  return unwrap<{ categories: AdminCategory[]; meta: AdminMeta }>(response);
}

export async function createAdminCategory(payload: Partial<AdminCategory>) {
  const response = await api.post("/admin/categories", payload);
  return unwrap<AdminCategory>(response);
}

export async function updateAdminCategory(
  categoryId: string,
  payload: Partial<AdminCategory>,
) {
  const response = await api.patch(`/admin/categories/${categoryId}`, payload);
  return unwrap<AdminCategory>(response);
}

export async function deleteAdminCategory(categoryId: string) {
  const response = await api.delete(`/admin/categories/${categoryId}`);
  return unwrap<AdminCategory>(response);
}

export async function getAdminBlogs(params: AdminListParams = {}) {
  const response = await api.get("/admin/blogs", { params });
  return unwrap<{ blogs: AdminBlog[]; meta: AdminMeta }>(response);
}

export async function getAdminBlog(blogId: string) {
  const response = await api.get(`/admin/blogs/${blogId}`);
  return unwrap<AdminBlog>(response);
}

export async function createAdminBlog(payload: Partial<AdminBlog>) {
  const response = await api.post("/admin/blogs", payload);
  return unwrap<AdminBlog>(response);
}

export async function updateAdminBlog(blogId: string, payload: Partial<AdminBlog>) {
  const response = await api.patch(`/admin/blogs/${blogId}`, payload);
  return unwrap<AdminBlog>(response);
}

export async function deleteAdminBlog(blogId: string) {
  const response = await api.delete(`/admin/blogs/${blogId}`);
  return unwrap<AdminBlog>(response);
}

export async function publishAdminBlog(blogId: string) {
  const response = await api.patch(`/admin/blogs/${blogId}/publish`);
  return unwrap<AdminBlog>(response);
}

export async function unpublishAdminBlog(blogId: string) {
  const response = await api.patch(`/admin/blogs/${blogId}/unpublish`);
  return unwrap<AdminBlog>(response);
}

export async function getAdminReports(params: AdminListParams = {}) {
  const response = await api.get("/admin/reports", { params });
  return unwrap<{ reports: AdminReport[]; meta: AdminMeta }>(response);
}

export async function getAdminReport(reportId: string) {
  const response = await api.get(`/admin/reports/${reportId}`);
  return unwrap<AdminReport>(response);
}

export async function updateAdminReportStatus(reportId: string, status: string) {
  const response = await api.patch(`/admin/reports/${reportId}/status`, { status });
  return unwrap<AdminReport>(response);
}

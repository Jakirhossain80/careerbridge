"use client";

import { mockAdminDashboardData } from "@/data/mock-admin-dashboard";
import {
  adminQueryKeys,
  getAdminEmployers,
  getAdminJobs,
  getAdminReports as listAdminReports,
  getAdminStats,
} from "@/services/admin.service";
import type {
  AdminDashboardData,
  AdminActivityItem,
  PendingApprovalItem,
  PlatformGrowthPoint,
} from "@/types/admin-dashboard.types";
import type {
  AdminEmployer,
  AdminJob,
  AdminListParams,
} from "@/types/admin.types";

export const adminDashboardQueryKeys = {
  dashboard: ["admin-dashboard"] as const,
  stats: adminQueryKeys.stats,
  activity: ["admin-activity"] as const,
  pendingEmployers: ["admin-pending-employers"] as const,
  pendingJobs: ["admin-pending-jobs"] as const,
  reports: ["admin-reports"] as const,
};

function toStatus(status?: string): AdminActivityItem["status"] {
  if (status === "pending") return "pending";
  if (status === "approved" || status === "active" || status === "published") {
    return "approved";
  }
  if (status === "blocked" || status === "rejected") return "blocked";
  if (status === "resolved" || status === "reviewed") return "resolved";
  if (status === "flagged") return "flagged";
  return "info";
}

function getDetailsHref(type: string, id: string) {
  if (type === "user") return `/admin/users/${id}`;
  if (type === "job") return `/admin/jobs/${id}`;
  if (type === "application") return `/admin/applications/${id}`;
  if (type === "report") return `/admin/reports/${id}`;
  if (type === "employer") return `/admin/employers/${id}`;
  return undefined;
}

function mapRecentActivity(
  activity: Awaited<ReturnType<typeof getAdminStats>>["recentActivity"],
): AdminActivityItem[] {
  return activity.map((item) => ({
    _id: item.id,
    action:
      item.type === "user"
        ? "New user registration"
        : item.type === "job"
          ? "New job posting"
          : item.type === "application"
            ? "New application"
            : "System event",
    entity: item.label,
    timestamp: item.createdAt ?? new Date().toISOString(),
    status: toStatus(item.status),
    detailsLabel: "View",
    detailsHref: getDetailsHref(item.type, item.id),
  }));
}

function mapPendingEmployer(item: AdminEmployer): PendingApprovalItem {
  return {
    _id: item._id,
    type: "employer",
    title: item.companyName ?? item.name,
    subtitle: item.ownerEmail ?? item.ownerId?.email ?? item.industry,
    createdAt: item.createdAt,
  };
}

function mapPendingJob(item: AdminJob): PendingApprovalItem {
  return {
    _id: item._id,
    type: "job",
    title: item.title,
    subtitle: item.companyName ?? item.category,
    createdAt: item.createdAt,
  };
}

function buildPlatformGrowth(
  activity: Awaited<ReturnType<typeof getAdminStats>>["recentActivity"],
): PlatformGrowthPoint[] {
  if (!activity.length) {
    return mockAdminDashboardData.platformGrowth;
  }

  const labels = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  });

  const points = labels.map((label) => ({
    label,
    newUsers: 0,
    jobPostings: 0,
  }));

  activity.forEach((item) => {
    if (!item.createdAt) return;

    const label = new Intl.DateTimeFormat("en", { month: "short" }).format(
      new Date(item.createdAt),
    );
    const point = points.find((entry) => entry.label === label);

    if (!point) return;
    if (item.type === "user") point.newUsers += 1;
    if (item.type === "job") point.jobPostings += 1;
  });

  return points.some((point) => point.newUsers > 0 || point.jobPostings > 0)
    ? points
    : mockAdminDashboardData.platformGrowth;
}

export async function getPendingEmployers() {
  const response = await getAdminEmployers({
    status: "pending",
    page: 1,
    limit: 5,
    sortBy: "-createdAt",
  });

  return response.employers;
}

export async function getPendingJobs() {
  const response = await getAdminJobs({
    status: "pending",
    page: 1,
    limit: 5,
    sortBy: "-createdAt",
  });

  return response.jobs;
}

export async function getAdminActivity() {
  const stats = await getAdminStats();
  return mapRecentActivity(stats.recentActivity);
}

export async function getAdminReports(params: AdminListParams = {}) {
  return listAdminReports(params);
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const [stats, activeJobs, pendingEmployers, pendingJobs] = await Promise.all([
    getAdminStats(),
    getAdminJobs({ status: "active", page: 1, limit: 1, sortBy: "-createdAt" }),
    getPendingEmployers(),
    getPendingJobs(),
  ]);

  const recentActivity = mapRecentActivity(stats.recentActivity);

  return {
    metrics: [
      {
        key: "total-users",
        label: "Total Users",
        value: stats.totalUsers,
        change: `${stats.totalJobSeekers.toLocaleString()} job seekers`,
        trend: "neutral",
        tone: "primary",
      },
      {
        key: "employers",
        label: "Employers",
        value: stats.totalEmployers,
        change: `${stats.pendingEmployers.toLocaleString()} pending`,
        trend: stats.pendingEmployers > 0 ? "up" : "neutral",
        tone: "secondary",
      },
      {
        key: "active-jobs",
        label: "Active Jobs",
        value: activeJobs.meta.total || stats.totalJobs,
        change: `${stats.pendingJobs.toLocaleString()} awaiting approval`,
        trend: stats.pendingJobs > 0 ? "up" : "neutral",
        tone: "tertiary",
      },
      {
        key: "pending-reports",
        label: "Pending Reports",
        value: stats.reports,
        change: `${stats.blockedUsers.toLocaleString()} blocked users`,
        trend: stats.reports > 0 ? "up" : "neutral",
        tone: "danger",
      },
    ],
    platformGrowth: buildPlatformGrowth(stats.recentActivity),
    pendingApprovals: [
      ...pendingEmployers.map(mapPendingEmployer),
      ...pendingJobs.map(mapPendingJob),
    ].slice(0, 8),
    recentActivity,
    systemHealth: {
      status: "operational",
      activeUsers: stats.totalUsers - stats.blockedUsers,
      recentEvents: recentActivity.length,
    },
  };
}

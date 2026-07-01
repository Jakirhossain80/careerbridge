"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  Flag,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import AdminDashboardFooter from "@/components/admin/dashboard/AdminDashboardFooter";
import AdminStatsGrid from "@/components/admin/dashboard/AdminStatsGrid";
import PendingApprovalsPanel from "@/components/admin/dashboard/PendingApprovalsPanel";
import PlatformGrowthChart from "@/components/admin/dashboard/PlatformGrowthChart";
import RecentSystemActivityTable from "@/components/admin/dashboard/RecentSystemActivityTable";
import DashboardSection from "@/components/dashboard/DashboardSection";
import { DashboardEmptyState } from "@/components/empty-states";
import { DashboardSkeleton } from "@/components/skeletons";
import Badge from "@/components/ui/Badge";
import ErrorState from "@/components/ui/ErrorState";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel } from "@/lib/role-labels";
import {
  adminDashboardQueryKeys,
  getAdminDashboard,
} from "@/services/admin-dashboard.service";
import {
  adminQueryKeys,
  approveAdminEmployer,
  approveAdminJob,
  rejectAdminEmployer,
  rejectAdminJob,
} from "@/services/admin.service";
import type { PendingApprovalItem } from "@/types/admin-dashboard.types";

type ApprovalAction = {
  item: PendingApprovalItem;
  action: "approve" | "reject";
};

function getDisplayName(
  profileName?: string,
  firebaseName?: string | null,
  email?: string | null,
) {
  const name = profileName?.trim() || firebaseName?.trim();

  if (name) return name;
  if (email) return email.split("@")[0];
  return "Admin";
}

function DashboardLoadingState() {
  return <DashboardSkeleton />;
}

function exportActivityLogs(activity: Array<Record<string, string | undefined>>) {
  const headers = ["Action", "Entity", "Description", "Status", "Timestamp"];
  const rows = activity.map((item) => [
    item.action,
    item.entity,
    item.description,
    item.status,
    item.timestamp,
  ]);
  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "careerbridge-admin-activity.csv";
  link.click();
  URL.revokeObjectURL(url);
}

const superAdminQuickActions = [
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Review Pending Employers",
    href: "/admin/employers/pending",
    icon: ShieldCheck,
  },
  {
    label: "Review Pending Jobs",
    href: "/admin/jobs/pending",
    icon: BriefcaseBusiness,
  },
  {
    label: "View Reports",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    label: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminDashboardContent() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const dashboardQuery = useQuery({
    queryKey: adminDashboardQueryKeys.dashboard,
    queryFn: getAdminDashboard,
  });

  const approvalMutation = useMutation({
    mutationFn: async ({ item, action }: ApprovalAction) => {
      if (item.type === "employer") {
        return action === "approve"
          ? approveAdminEmployer(item._id)
          : rejectAdminEmployer(item._id);
      }

      return action === "approve"
        ? approveAdminJob(item._id)
        : rejectAdminJob(item._id);
    },
    onSuccess: async (_, variables) => {
      setSuccessMessage(
        `${variables.item.title} ${
          variables.action === "approve" ? "approved" : "rejected"
        }.`,
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminDashboardQueryKeys.dashboard,
        }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats }),
        queryClient.invalidateQueries({ queryKey: ["admin-employers"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }),
      ]);
    },
  });

  if (dashboardQuery.isLoading) {
    return <DashboardLoadingState />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <ErrorState
            title="Unable to load admin dashboard"
            message="Unable to load admin dashboard. Please try again."
            onRetry={() => void dashboardQuery.refetch()}
          />
        </div>
      </main>
    );
  }

  const data = dashboardQuery.data;
  const displayName = getDisplayName(
    profile?.name,
    user?.displayName,
    profile?.email ?? user?.email,
  );
  const roleLabel = getRoleLabel(profile?.role);
  const isSuperAdmin = profile?.role === "super_admin";
  const dashboardLabel = isSuperAdmin
    ? "Super Admin Dashboard"
    : "Admin Dashboard";
  const isEmpty =
    data.metrics.length === 0 &&
    data.platformGrowth.length === 0 &&
    data.pendingApprovals.length === 0 &&
    data.recentActivity.length === 0;
  const actionId = approvalMutation.variables
    ? `${approvalMutation.variables.action}-${approvalMutation.variables.item.type}-${approvalMutation.variables.item._id}`
    : undefined;

  if (isEmpty) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <DashboardEmptyState
            title="No admin dashboard data available yet"
            description="Platform activity will appear here once users, employers, jobs, and reports are created."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-primary">{dashboardLabel}</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            System Overview
          </h1>
          <div className="flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-center">
            <p className="text-sm text-muted">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">{displayName}</span>.
              Here&apos;s what&apos;s happening on CareerBridge today.
            </p>
            <Badge variant="primary" className="w-fit">
              {roleLabel}
            </Badge>
          </div>
        </section>

        {successMessage ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        <AdminStatsGrid metrics={data.metrics} />

        {isSuperAdmin ? (
          <DashboardSection
            title="Super Admin Quick Actions"
            description="Platform-wide moderation and operations shortcuts."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {superAdminQuickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex min-h-20 items-center gap-3 rounded-md border border-slate-200 bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-blue-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span>{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </DashboardSection>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <PlatformGrowthChart data={data.platformGrowth} />
          <PendingApprovalsPanel
            approvals={data.pendingApprovals}
            actionId={approvalMutation.isPending ? actionId : undefined}
            onApprove={(item) => {
              setSuccessMessage("");
              approvalMutation.mutate({ item, action: "approve" });
            }}
            onReject={(item) => {
              setSuccessMessage("");
              approvalMutation.mutate({ item, action: "reject" });
            }}
          />
        </section>

        <RecentSystemActivityTable
          activity={data.recentActivity}
          onExport={() =>
            exportActivityLogs(
              data.recentActivity.map((item) => ({
                action: item.action,
                entity: item.entity,
                description: item.description,
                status: item.status,
                timestamp: item.timestamp,
              })),
            )
          }
        />

        <AdminDashboardFooter systemHealth={data.systemHealth} />
      </div>
    </main>
  );
}

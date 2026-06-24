"use client";

import { useQuery } from "@tanstack/react-query";

import AdminActivityFeed from "@/components/admin/AdminActivityFeed";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { adminQueryKeys, getAdminStats } from "@/services/admin.service";

export default function AdminDashboardContent() {
  const statsQuery = useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: getAdminStats,
  });

  if (statsQuery.isLoading) {
    return (
      <main className="space-y-6 p-4 sm:p-6">
        <LoadingSkeleton variant="card" rows={2} />
      </main>
    );
  }

  if (statsQuery.isError || !statsQuery.data) {
    return (
      <main className="p-4 sm:p-6">
        <ErrorState
          title="Admin dashboard unavailable"
          message="The platform summary could not be loaded."
        />
      </main>
    );
  }

  const stats = statsQuery.data;

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <AdminStatsCards stats={stats} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminActivityFeed activity={stats.recentActivity} />
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Platform Health Summary
          </h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-sm text-muted">Pending Approvals</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {(stats.pendingJobs + stats.pendingEmployers).toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-sm text-muted">Moderation Queue</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {stats.reports.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-sm text-muted">Blocked Accounts</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {stats.blockedUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

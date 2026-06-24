import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import type { AdminDashboardData } from "@/types/admin-dashboard.types";

type AdminDashboardFooterProps = {
  systemHealth?: AdminDashboardData["systemHealth"];
};

export default function AdminDashboardFooter({
  systemHealth,
}: AdminDashboardFooterProps) {
  const status = systemHealth?.status ?? "operational";

  return (
    <footer className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-surface px-5 py-4 text-sm text-muted shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p>CareerBridge Admin Console - System overview</p>
      <div className="flex flex-wrap items-center gap-3">
        <span>
          Active users: {(systemHealth?.activeUsers ?? 0).toLocaleString()}
        </span>
        <span>
          Events: {(systemHealth?.recentEvents ?? 0).toLocaleString()}
        </span>
        <AdminStatusBadge status={status} />
      </div>
    </footer>
  );
}

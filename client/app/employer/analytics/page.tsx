import ProtectedRoute from "@/components/auth/ProtectedRoute";
import EmployerAnalyticsContent from "@/components/employer/analytics/EmployerAnalyticsContent";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EmployerAnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Analytics"
        searchPlaceholder="Search analytics, jobs, applicants"
        workspaceLabel="Employer Workspace"
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <EmployerAnalyticsContent />
        </main>
      </DashboardShell>
    </ProtectedRoute>
  );
}

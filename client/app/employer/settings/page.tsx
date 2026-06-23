import ProtectedRoute from "@/components/auth/ProtectedRoute";
import EmployerSettingsContent from "@/components/employer/settings/EmployerSettingsContent";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EmployerSettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Settings"
        searchPlaceholder="Search settings, team, notifications"
        workspaceLabel="Employer Workspace"
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <EmployerSettingsContent />
        </main>
      </DashboardShell>
    </ProtectedRoute>
  );
}


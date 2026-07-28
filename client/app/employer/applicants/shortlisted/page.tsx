import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ShortlistedApplicantsContent from "@/components/employer/applicants/ShortlistedApplicantsContent";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EmployerShortlistedApplicantsPage() {
  return (
    <ProtectedRoute allowedRoles="employer">
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Shortlisted Applicants"
        searchPlaceholder="Search shortlisted applicants"
        workspaceLabel="Employer Workspace"
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <ShortlistedApplicantsContent />
        </main>
      </DashboardShell>
    </ProtectedRoute>
  );
}

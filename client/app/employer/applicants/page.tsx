import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ApplicantsPageContent from "@/components/employer/applicants/ApplicantsPageContent";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EmployerApplicantsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Applicants"
        searchPlaceholder="Search applicants, jobs, skills"
        workspaceLabel="Employer Workspace"
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <ApplicantsPageContent />
        </main>
      </DashboardShell>
    </ProtectedRoute>
  );
}

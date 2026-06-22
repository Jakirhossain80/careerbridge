import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ApplicantDetailsContent from "@/components/employer/applicants/ApplicantDetailsContent";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EmployerApplicantDetailsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Applicant Details"
        searchPlaceholder="Search applications"
        workspaceLabel="Employer Workspace"
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <ApplicantDetailsContent />
        </main>
      </DashboardShell>
    </ProtectedRoute>
  );
}

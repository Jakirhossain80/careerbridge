import ProtectedRoute from "@/components/auth/ProtectedRoute";
import InterviewDetailsContent from "@/components/employer/interviews/InterviewDetailsContent";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EmployerInterviewDetailsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Interview Details"
        searchPlaceholder="Search interviews, candidates, jobs"
        workspaceLabel="Employer Workspace"
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <InterviewDetailsContent />
        </main>
      </DashboardShell>
    </ProtectedRoute>
  );
}

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import InterviewManagementContent from "@/components/employer/interviews/InterviewManagementContent";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EmployerInterviewsPage() {
  return (
    <ProtectedRoute allowedRoles="employer">
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Interviews"
        searchPlaceholder="Search interviews, candidates, jobs"
        workspaceLabel="Employer Workspace"
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <InterviewManagementContent />
        </main>
      </DashboardShell>
    </ProtectedRoute>
  );
}

"use client";

import { useParams } from "next/navigation";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import EditJobForm from "@/components/employer/jobs/EditJobForm";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EditEmployerJobPage() {
  const params = useParams<{ id: string }>();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <ProtectedRoute allowedRoles="employer">
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Edit Job Posting"
        searchPlaceholder="Search jobs, applicants, interviews"
        workspaceLabel="Employer Workspace"
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <EditJobForm jobId={jobId} />
        </main>
      </DashboardShell>
    </ProtectedRoute>
  );
}

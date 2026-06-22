import type { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import { employerDashboardLinks } from "@/components/layout/DashboardSidebar";

export default function EmployerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardShell
        navItems={employerDashboardLinks}
        roleLabel="Employer"
        title="Employer Overview"
        searchPlaceholder="Search jobs, applicants, interviews"
        workspaceLabel="Employer Workspace"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}

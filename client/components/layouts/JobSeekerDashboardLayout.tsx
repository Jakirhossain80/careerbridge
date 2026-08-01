"use client";

import type { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import JobSeekerSidebar from "@/components/job-seeker/dashboard/JobSeekerSidebar";
import JobSeekerTopbar from "@/components/job-seeker/dashboard/JobSeekerTopbar";
import useMobileSidebar from "@/hooks/useMobileSidebar";

type JobSeekerDashboardLayoutProps = {
  children: ReactNode;
};

export default function JobSeekerDashboardLayout({
  children,
}: JobSeekerDashboardLayoutProps) {
  const { isOpen, closeSidebar, openSidebar } = useMobileSidebar();
  const sidebarId = "job-seeker-sidebar";

  return (
    <ProtectedRoute allowedRoles="job_seeker">
      <div className="min-h-screen bg-background text-foreground lg:flex">
        <JobSeekerSidebar
          id={sidebarId}
          isOpen={isOpen}
          onClose={closeSidebar}
        />
        <div className="min-w-0 flex-1">
          <JobSeekerTopbar
            isMenuOpen={isOpen}
            menuControlsId={sidebarId}
            onMenuClick={openSidebar}
          />
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}

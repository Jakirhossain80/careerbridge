"use client";

import { useState, type ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import JobSeekerSidebar from "@/components/job-seeker/dashboard/JobSeekerSidebar";
import JobSeekerTopbar from "@/components/job-seeker/dashboard/JobSeekerTopbar";

type JobSeekerDashboardLayoutProps = {
  children: ReactNode;
};

export default function JobSeekerDashboardLayout({
  children,
}: JobSeekerDashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground lg:flex">
        <JobSeekerSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="min-w-0 flex-1">
          <JobSeekerTopbar
            search={search}
            onSearchChange={setSearch}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}

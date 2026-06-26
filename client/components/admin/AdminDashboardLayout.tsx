"use client";

import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  Building2,
  FileText,
  Flag,
  FolderTree,
  LayoutDashboard,
  Newspaper,
  Settings,
  UserRoundSearch,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import type { DashboardNavItem } from "@/components/layout/DashboardSidebar";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";

export const adminDashboardLinks: DashboardNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Job Seekers", href: "/admin/job-seekers", icon: UserRoundSearch },
  { label: "Employers", href: "/admin/employers", icon: Building2 },
  { label: "Jobs", href: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
  { label: "Reports", href: "/admin/reports", icon: Flag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminRouteGuard>
        <DashboardShell
          navItems={adminDashboardLinks}
          roleLabel="Admin"
          title="Admin Console"
          searchPlaceholder="Search users, jobs, reports"
          workspaceLabel="Platform Operations"
          sidebarVariant="admin"
        >
          {children}
        </DashboardShell>
      </AdminRouteGuard>
    </ProtectedRoute>
  );
}

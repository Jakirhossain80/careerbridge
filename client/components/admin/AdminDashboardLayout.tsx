"use client";

import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  FileText,
  Flag,
  FolderTree,
  LayoutDashboard,
  Newspaper,
  Settings,
  ShieldCheck,
  UserRoundSearch,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import type { DashboardNavItem } from "@/components/layout/DashboardSidebar";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { useAuth } from "@/hooks/useAuth";
import { getSidebarRoleLabel } from "@/lib/role-labels";

export const adminDashboardLinks: DashboardNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: ChartNoAxesCombined },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Job Seekers", href: "/admin/job-seekers", icon: UserRoundSearch },
  { label: "Employers", href: "/admin/employers", icon: Building2 },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Pending Employers", href: "/admin/employers/pending", icon: ShieldCheck },
  { label: "Jobs", href: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Pending Jobs", href: "/admin/jobs/pending", icon: ShieldCheck },
  { label: "Featured Jobs", href: "/admin/jobs/featured", icon: BriefcaseBusiness },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
  { label: "Reports", href: "/admin/reports", icon: Flag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === "super_admin";
  const consoleTitle = isSuperAdmin ? "Super Admin Console" : "Admin Console";

  return (
    <ProtectedRoute>
      <AdminRouteGuard>
        <DashboardShell
          navItems={adminDashboardLinks}
          roleLabel={getSidebarRoleLabel(profile?.role)}
          title={consoleTitle}
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

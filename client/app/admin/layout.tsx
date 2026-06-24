import type { ReactNode } from "react";

import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}

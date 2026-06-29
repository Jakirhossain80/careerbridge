import type { Metadata } from "next";

import UniversalDashboardRedirect from "@/components/utility/UniversalDashboardRedirect";

export const metadata: Metadata = {
  title: "Dashboard | CareerBridge",
  description: "Open the right CareerBridge dashboard for your account role.",
};

export default function DashboardPage() {
  return <UniversalDashboardRedirect />;
}

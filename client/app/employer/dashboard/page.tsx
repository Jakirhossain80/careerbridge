import EmployerDashboardOverview from "@/components/employer-dashboard/EmployerDashboardOverview";
import { employerDashboardData } from "@/lib/employer-dashboard-data";

export default function EmployerDashboardPage() {
  return <EmployerDashboardOverview data={employerDashboardData} />;
}

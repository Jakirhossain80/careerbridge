"use client";

import EmployerDashboardOverview from "@/components/employer-dashboard/EmployerDashboardOverview";
import { employerDashboardData } from "@/lib/employer-dashboard-data";
import { useEmployerCompanyProfile } from "@/hooks/employer/useEmployerCompanyProfile";
import { Button, Card, LoadingSkeleton } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export default function EmployerDashboardPage() {
  const { profile, user } = useAuth();
  const companyQuery = useEmployerCompanyProfile();

  if (companyQuery.isLoading) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <LoadingSkeleton variant="card" rows={1} />
          <LoadingSkeleton variant="card" rows={3} />
        </div>
      </main>
    );
  }

  if (companyQuery.isError) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="border-red-200 bg-red-50">
            <h1 className="text-base font-semibold text-red-900">
              Unable to load employer dashboard.
            </h1>
            <Button className="mt-4" onClick={() => void companyQuery.refetch()}>
              Retry
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <EmployerDashboardOverview
      data={{
        ...employerDashboardData,
        employerProfile: {
          ...employerDashboardData.employerProfile,
          companyName: companyQuery.data?.companyName ?? "Company profile not set up",
          contactName: profile?.name ?? user?.displayName ?? "Employer",
          email: companyQuery.data?.contactEmail ?? profile?.email ?? user?.email ?? "",
        },
      }}
    />
  );
}

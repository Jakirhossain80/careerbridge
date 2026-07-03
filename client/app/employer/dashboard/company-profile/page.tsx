"use client";

import Link from "next/link";

import CompanyProfileOverview from "@/components/employer-company-profile/CompanyProfileOverview";
import { ProfileSkeleton } from "@/components/skeletons";
import { Button, Card } from "@/components/ui";
import { useEmployerCompanyProfile } from "@/hooks/employer/useEmployerCompanyProfile";

export default function EmployerCompanyProfilePage() {
  const companyQuery = useEmployerCompanyProfile();

  if (companyQuery.isLoading) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProfileSkeleton />
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
              Unable to load company profile.
            </h1>
            <Button className="mt-4" onClick={() => void companyQuery.refetch()}>
              Retry
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  if (!companyQuery.data) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card>
            <h1 className="text-lg font-semibold text-foreground">
              Company profile not set up
            </h1>
            <p className="mt-2 text-sm text-muted">
              Add your company details so candidates can review your employer profile.
            </p>
            <Link
              href="/employer/dashboard/company-profile/edit"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Set Up Company Profile
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  return <CompanyProfileOverview company={companyQuery.data} />;
}

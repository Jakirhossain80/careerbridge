"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import EditCompanyProfileForm from "@/components/employer-company-profile/edit/EditCompanyProfileForm";
import { FormSkeleton } from "@/components/skeletons";
import { Button, Card } from "@/components/ui";
import { useEmployerCompanyProfile } from "@/hooks/employer/useEmployerCompanyProfile";
import { useAuth } from "@/hooks/useAuth";
import { createEmptyEmployerCompanyProfile } from "@/services/employer-company-profile.service";

export default function EditEmployerCompanyProfilePage() {
  const companyQuery = useEmployerCompanyProfile();
  const { profile, user } = useAuth();

  return (
    <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <li>
              <Link
                href="/employer/dashboard/company-profile"
                className="transition hover:text-primary"
              >
                Company Profile
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="font-medium text-foreground">
              Edit Details
            </li>
          </ol>
        </nav>

        {companyQuery.isLoading ? (
          <FormSkeleton sections={3} fieldsPerSection={3} />
        ) : null}

        {companyQuery.isError ? (
          <Card className="border-red-200 bg-red-50">
            <h1 className="text-base font-semibold text-red-900">
              Unable to load company profile information.
            </h1>
            <Button className="mt-4" onClick={() => void companyQuery.refetch()}>
              Retry
            </Button>
          </Card>
        ) : null}

        {!companyQuery.isLoading && !companyQuery.isError ? (
          <EditCompanyProfileForm
            company={
              companyQuery.data ??
              createEmptyEmployerCompanyProfile({
                contactEmail: profile?.email ?? user?.email ?? "",
              })
            }
          />
        ) : null}
      </div>
    </main>
  );
}

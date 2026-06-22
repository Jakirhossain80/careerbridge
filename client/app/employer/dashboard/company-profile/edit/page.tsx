import Link from "next/link";
import { ChevronRight } from "lucide-react";

import EditCompanyProfileForm from "@/components/employer-company-profile/edit/EditCompanyProfileForm";
import { employerCompanyProfile } from "@/lib/employer-company-profile-data";

export default function EditEmployerCompanyProfilePage() {
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

        <EditCompanyProfileForm company={employerCompanyProfile} />
      </div>
    </main>
  );
}

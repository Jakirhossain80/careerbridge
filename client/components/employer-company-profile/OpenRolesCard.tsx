import Link from "next/link";
import { BriefcaseBusiness, ChevronRight } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { CompanyProfile } from "@/lib/employer-company-profile-data";

type OpenRolesCardProps = {
  company: CompanyProfile;
};

export default function OpenRolesCard({ company }: OpenRolesCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">Open roles</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
            {company.openRolesCount}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Active listings currently visible to qualified candidates.
          </p>
        </div>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-slate-800">
          <BriefcaseBusiness className="size-6" aria-hidden="true" />
        </div>
      </div>

      <Button className="mt-5 w-full" rightIcon={<ChevronRight className="size-4" />}>
        Manage Listings
      </Button>

      <Link
        href="/employer/dashboard"
        className="mt-3 inline-flex text-sm font-medium text-primary transition hover:text-blue-700"
      >
        View dashboard summary
      </Link>
    </Card>
  );
}

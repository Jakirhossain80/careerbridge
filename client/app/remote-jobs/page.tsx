import type { Metadata } from "next";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import RemoteJobsBenefits from "@/components/remote-jobs/RemoteJobsBenefits";
import RemoteJobsEmptyState from "@/components/remote-jobs/RemoteJobsEmptyState";
import RemoteJobsFilters from "@/components/remote-jobs/RemoteJobsFilters";
import RemoteJobsHero from "@/components/remote-jobs/RemoteJobsHero";
import RemoteJobsList from "@/components/remote-jobs/RemoteJobsList";
import RemoteJobsLoadingSkeleton from "@/components/remote-jobs/RemoteJobsLoadingSkeleton";

export const metadata: Metadata = {
  title: "Remote Jobs | CareerBridge",
  description:
    "Find verified remote jobs by keyword, timezone, salary range, remote type, category, experience level, and location restrictions on CareerBridge.",
};

export default function RemoteJobsPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <RemoteJobsHero />

        <section className="bg-background px-6 py-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
            <RemoteJobsFilters />

            <div>
              <RemoteJobsList />

              <div className="mt-8 grid gap-6">
                <RemoteJobsEmptyState />
                <RemoteJobsLoadingSkeleton />
              </div>
            </div>
          </div>
        </section>

        <RemoteJobsBenefits />
      </main>
      <PublicFooter />
    </>
  );
}

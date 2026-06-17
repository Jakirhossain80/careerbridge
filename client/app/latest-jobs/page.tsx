import type { Metadata } from "next";

import LatestJobsBenefits from "@/components/latest-jobs/LatestJobsBenefits";
import LatestJobsEmptyState from "@/components/latest-jobs/LatestJobsEmptyState";
import LatestJobsFilters from "@/components/latest-jobs/LatestJobsFilters";
import LatestJobsHero from "@/components/latest-jobs/LatestJobsHero";
import LatestJobsList from "@/components/latest-jobs/LatestJobsList";
import LatestJobsLoadingSkeleton from "@/components/latest-jobs/LatestJobsLoadingSkeleton";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

export const metadata: Metadata = {
  title: "Latest Jobs | CareerBridge",
  description:
    "Find the newest jobs by keyword, location, salary range, category, experience level, job type, company, featured status, and posted date on CareerBridge.",
};

export default function LatestJobsPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <LatestJobsHero />

        <section className="bg-background px-6 py-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
            <LatestJobsFilters />

            <div>
              <LatestJobsList />

              <div className="mt-8 grid gap-6">
                <LatestJobsEmptyState />
                <LatestJobsLoadingSkeleton />
              </div>
            </div>
          </div>
        </section>

        <LatestJobsBenefits />
      </main>
      <PublicFooter />
    </>
  );
}

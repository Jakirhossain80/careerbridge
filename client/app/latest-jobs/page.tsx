import type { Metadata } from "next";

import LatestJobsBenefits from "@/components/latest-jobs/LatestJobsBenefits";
import LatestJobsHero from "@/components/latest-jobs/LatestJobsHero";
import JobsSearchResults from "@/components/jobs/JobsSearchResults";
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

        <JobsSearchResults fixedParams={{ sort: "-createdAt" }} showSearchBar={false} />

        <LatestJobsBenefits />
      </main>
      <PublicFooter />
    </>
  );
}

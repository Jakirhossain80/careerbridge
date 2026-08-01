import type { Metadata } from "next";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import FeaturedJobsBenefits from "@/components/featured-jobs/FeaturedJobsBenefits";
import FeaturedJobsHero from "@/components/featured-jobs/FeaturedJobsHero";
import JobsSearchResults from "@/components/jobs/JobsSearchResults";

export const metadata: Metadata = {
  title: "Featured Jobs | CareerBridge",
  description:
    "Find featured jobs by keyword, location, salary range, category, experience level, job type, company, and posted date on CareerBridge.",
};

export default function FeaturedJobsPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <FeaturedJobsHero />

        <JobsSearchResults featured showSearchBar={false} />

        <FeaturedJobsBenefits />
      </main>
      <PublicFooter />
    </>
  );
}

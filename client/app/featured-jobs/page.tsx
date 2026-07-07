import type { Metadata } from "next";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import FeaturedJobsBenefits from "@/components/featured-jobs/FeaturedJobsBenefits";
import FeaturedJobsFilters from "@/components/featured-jobs/FeaturedJobsFilters";
import FeaturedJobsHero from "@/components/featured-jobs/FeaturedJobsHero";
import FeaturedJobsList from "@/components/featured-jobs/FeaturedJobsList";

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

        <section className="bg-background px-6 py-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
            <FeaturedJobsFilters />

            <div>
              <FeaturedJobsList />
            </div>
          </div>
        </section>

        <FeaturedJobsBenefits />
      </main>
      <PublicFooter />
    </>
  );
}

import type { Metadata } from "next";

import JobsHero from "@/components/jobs/JobsHero";
import JobsSearchResults from "@/components/jobs/JobsSearchResults";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

export const metadata: Metadata = {
  title: "Jobs | CareerBridge",
  description:
    "Search verified jobs by title, company, skill, keyword, location, salary, work mode, and experience level on CareerBridge.",
};

export default function JobsPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <JobsHero />

        <JobsSearchResults />
      </main>
      <PublicFooter />
    </>
  );
}

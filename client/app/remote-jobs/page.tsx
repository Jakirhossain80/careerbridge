import type { Metadata } from "next";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import RemoteJobsBenefits from "@/components/remote-jobs/RemoteJobsBenefits";
import RemoteJobsHero from "@/components/remote-jobs/RemoteJobsHero";
import JobsSearchResults from "@/components/jobs/JobsSearchResults";

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

        <JobsSearchResults fixedParams={{ workMode: "remote" }} showSearchBar={false} />

        <RemoteJobsBenefits />
      </main>
      <PublicFooter />
    </>
  );
}

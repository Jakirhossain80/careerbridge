import type { Metadata } from "next";

import JobDetailsContent from "@/components/job-details/JobDetailsContent";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

type JobDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Job Details | CareerBridge",
  description: "View job details and apply through CareerBridge.",
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;

  return (
    <>
      <PublicNavbar />
      <JobDetailsContent idOrSlug={id} />
      <PublicFooter />
    </>
  );
}

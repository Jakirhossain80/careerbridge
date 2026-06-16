import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ApplicationTipsCard from "@/components/job-details/ApplicationTipsCard";
import ApplyPanel from "@/components/job-details/ApplyPanel";
import CompanyProfileCard from "@/components/job-details/CompanyProfileCard";
import JobDescription from "@/components/job-details/JobDescription";
import JobDetailsHeader from "@/components/job-details/JobDetailsHeader";
import JobSummaryCards from "@/components/job-details/JobSummaryCards";
import MobileApplyBar from "@/components/job-details/MobileApplyBar";
import SimilarJobs from "@/components/job-details/SimilarJobs";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { getJobDetailsById, jobDetails } from "@/lib/job-details-data";

type JobDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return jobDetails.map((job) => ({ id: job.id }));
}

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJobDetailsById(id);

  if (!job) {
    return {
      title: "Job not found | CareerBridge",
    };
  }

  return {
    title: `${job.title} at ${job.company} | CareerBridge`,
    description: `${job.title} role at ${job.company} in ${job.location}. ${job.jobType}, ${job.experienceLevel}, ${job.salaryRange}.`,
  };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const job = getJobDetailsById(id);

  if (!job) {
    notFound();
  }

  return (
    <>
      <PublicNavbar />
      <main className="bg-background pb-20 lg:pb-0">
        <JobDetailsHeader job={job} />

        <section className="px-6 pb-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
            <div className="grid gap-6">
              <JobSummaryCards items={job.summaryCards} />
              <JobDescription job={job} />
              <CompanyProfileCard job={job} />
              <ApplicationTipsCard />
              <SimilarJobs jobs={job.similarJobs} />
            </div>

            <ApplyPanel job={job} />
          </div>
        </section>
      </main>
      <PublicFooter />
      <MobileApplyBar job={job} />
    </>
  );
}

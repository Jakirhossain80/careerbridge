import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JobCard } from "@/components/cards";
import { latestJobs } from "@/lib/home-data";

import SectionHeader from "./SectionHeader";

export default function LatestJobs() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Latest jobs"
          title="New opportunities added recently"
          description="Stay close to the newest roles so you can apply while shortlists are still forming."
          action={
            <Link
              href="/jobs?sort=latest"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
            >
              See latest jobs
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {latestJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>
    </section>
  );
}

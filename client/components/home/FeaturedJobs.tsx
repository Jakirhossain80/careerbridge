"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { JobCard } from "@/components/cards";
import { featuredJobs } from "@/lib/home-data";
import {
  getPublicFeaturedJobs,
  publicJobQueryKeys,
} from "@/services/jobs.service";

import SectionHeader from "./SectionHeader";

export default function FeaturedJobs() {
  const featuredJobsQuery = useQuery({
    queryKey: publicJobQueryKeys.featured({ limit: 3 }),
    queryFn: () => getPublicFeaturedJobs({ limit: 3 }),
  });
  const jobResults = featuredJobsQuery.data?.homeJobs ?? featuredJobs;

  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Featured jobs"
          title="Handpicked roles hiring now"
          description="A focused set of opportunities with clear requirements, compensation, and skill signals."
          action={
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
            >
              View all jobs
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {jobResults.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>
    </section>
  );
}

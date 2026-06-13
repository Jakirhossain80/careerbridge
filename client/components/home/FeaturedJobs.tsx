import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JobCard } from "@/components/cards";
import { featuredJobs } from "@/lib/home-data";

import SectionHeader from "./SectionHeader";

export default function FeaturedJobs() {
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
          {featuredJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";

import { JobCard } from "@/components/cards";
import { LoadingSkeleton } from "@/components/ui";
import ErrorState from "@/components/ui/ErrorState";
import { usePublicJobs } from "@/hooks/usePublicJobs";

export default function RemoteJobs() {
  const jobsQuery = usePublicJobs({ limit: 3, workMode: "remote", sort: "-createdAt" });
  const jobs = jobsQuery.data?.homeJobs ?? [];
  return <section className="bg-surface px-6 py-16"><div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start"><div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-950/30"><div className="flex size-12 items-center justify-center rounded-lg bg-white text-primary shadow-sm dark:bg-slate-900"><Globe2 className="size-6" aria-hidden="true" /></div><p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">Remote jobs</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Work from anywhere with verified remote roles.</h2><p className="mt-4 text-base leading-7 text-muted">Find flexible opportunities with clear expectations, collaboration habits, and remote-ready hiring teams.</p><Link href="/jobs?workMode=remote" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700">Browse remote jobs<ArrowRight className="size-4" aria-hidden="true" /></Link></div><div className="grid gap-5">{jobsQuery.isLoading ? <LoadingSkeleton variant="card" /> : null}{jobsQuery.isError ? <ErrorState title="Unable to load remote jobs" onRetry={() => jobsQuery.refetch()} /> : null}{jobsQuery.isSuccess && jobs.length === 0 ? <p className="text-sm text-muted">No remote jobs are available right now.</p> : null}{jobs.map((job) => <JobCard key={job.id} {...job} />)}</div></div></section>;
}

"use client";

import { useState, type FormEvent } from "react";
import { Building2, MapPin, Search, SlidersHorizontal, Sparkles, Tag } from "lucide-react";

import type { PublicJobsParams } from "@/types/job.types";

type JobsSearchBarProps = {
  values: PublicJobsParams;
  onSubmit: (values: Pick<PublicJobsParams, "title" | "company" | "skill" | "keyword" | "location">) => void;
};

const fields = [
  { label: "Job title", name: "title", placeholder: "Product designer", icon: Search },
  { label: "Company name", name: "company", placeholder: "Company", icon: Building2 },
  { label: "Skill", name: "skill", placeholder: "React, SQL", icon: Sparkles },
  { label: "Keyword", name: "keyword", placeholder: "Keyword", icon: Tag },
  { label: "Location", name: "location", placeholder: "City or remote", icon: MapPin },
] as const;

export default function JobsSearchBar({ values, onSubmit }: JobsSearchBarProps) {
  const [drafts, setDrafts] = useState(() => ({
    title: values.title ?? "",
    company: values.company ?? "",
    skill: values.skill ?? "",
    keyword: values.keyword ?? values.search ?? "",
    location: values.location ?? "",
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(drafts);
  }

  return (
    <form role="search" aria-label="Search jobs" onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-surface p-3 shadow-sm dark:border-slate-700">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.15fr_1fr_0.9fr_0.9fr_1fr_auto]">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <label key={field.name} className="relative block">
              <span className="sr-only">{field.label}</span>
              <Icon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input type="search" name={field.name} value={drafts[field.name]} maxLength={120} placeholder={field.placeholder} onChange={(event) => setDrafts((current) => ({ ...current, [field.name]: event.target.value }))} className="h-12 w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
            </label>
          );
        })}
        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 md:col-span-2 xl:col-span-1">
          <SlidersHorizontal className="size-4" aria-hidden="true" /> Search jobs
        </button>
      </div>
    </form>
  );
}

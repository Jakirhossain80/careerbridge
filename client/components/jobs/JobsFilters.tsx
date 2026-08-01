"use client";

import type { PublicJobsParams } from "@/types/job.types";

type JobsFiltersProps = {
  values: PublicJobsParams;
  onChange: (updates: Partial<PublicJobsParams>) => void;
  onReset: () => void;
};

const selectClass = "mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900";

export default function JobsFilters({ values, onChange, onReset }: JobsFiltersProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700" aria-labelledby="jobs-filters-heading">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2 id="jobs-filters-heading" className="text-base font-semibold">Filters</h2>
        <button type="button" onClick={onReset} className="text-sm font-semibold text-primary transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30">Reset</button>
      </div>
      <div className="mt-5 space-y-5">
        <label className="block text-sm font-semibold text-foreground">Job type
          <select value={values.jobType ?? ""} onChange={(event) => onChange({ jobType: event.target.value as PublicJobsParams["jobType"] || undefined })} className={selectClass}>
            <option value="">All job types</option><option value="full_time">Full-time</option><option value="part_time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option><option value="temporary">Temporary</option><option value="freelance">Freelance</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-foreground">Work mode
          <select value={values.workMode ?? ""} onChange={(event) => onChange({ workMode: event.target.value as PublicJobsParams["workMode"] || undefined })} className={selectClass}>
            <option value="">All work modes</option><option value="remote">Remote</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-foreground">Experience level
          <input key={`experience-${values.experienceLevel ?? ""}`} defaultValue={values.experienceLevel ?? ""} maxLength={80} onBlur={(event) => onChange({ experienceLevel: event.target.value.trim() || undefined })} placeholder="e.g. Mid level" className={selectClass} />
        </label>
        <label className="block text-sm font-semibold text-foreground">Category
          <input key={`category-${values.category ?? ""}`} defaultValue={values.category ?? ""} maxLength={80} onBlur={(event) => onChange({ category: event.target.value.trim() || undefined })} placeholder="e.g. Engineering" className={selectClass} />
        </label>
        <label className="block text-sm font-semibold text-foreground">Industry
          <input key={`industry-${values.industry ?? ""}`} defaultValue={values.industry ?? ""} maxLength={80} onBlur={(event) => onChange({ industry: event.target.value.trim() || undefined })} placeholder="e.g. Software" className={selectClass} />
        </label>
        <fieldset>
          <legend className="text-sm font-semibold text-foreground">Salary range</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="text-xs text-muted">Minimum<input key={`minimum-${values.salaryMin ?? ""}`} type="number" min="0" defaultValue={values.salaryMin ?? ""} onBlur={(event) => onChange({ salaryMin: event.target.value ? Number(event.target.value) : undefined })} className={selectClass} /></label>
            <label className="text-xs text-muted">Maximum<input key={`maximum-${values.salaryMax ?? ""}`} type="number" min="0" defaultValue={values.salaryMax ?? ""} onBlur={(event) => onChange({ salaryMax: event.target.value ? Number(event.target.value) : undefined })} className={selectClass} /></label>
          </div>
        </fieldset>
      </div>
    </aside>
  );
}

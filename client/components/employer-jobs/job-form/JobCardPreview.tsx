import { CalendarDays, Lightbulb, MapPin, Sparkles, Users } from "lucide-react";

import { normalizeCurrencyCode } from "@/constants/currency-options";
import type {
  EmployerJobCompany,
  EmployerJobFormData,
} from "@/types/employer-job";

type JobCardPreviewProps = {
  job: EmployerJobFormData;
  company: EmployerJobCompany;
};

function formatSalary(job: EmployerJobFormData) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizeCurrencyCode(job.currency),
    maximumFractionDigits: 0,
  });

  return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
}

function formatDeadline(deadline: string) {
  if (!deadline) {
    return "Deadline not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${deadline}T00:00:00`));
}

export default function JobCardPreview({ job, company }: JobCardPreviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="job-preview-heading"
        className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Live preview
            </p>
            <h2
              id="job-preview-heading"
              className="mt-1 text-lg font-semibold text-foreground"
            >
              Job card preview
            </h2>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
            {job.status}
          </span>
        </div>

        <article className="mt-5 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              {company.logoInitials}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                {job.title || "Untitled role"}
              </h3>
              <p className="mt-1 text-sm text-muted">{company.name}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {job.location || company.location} · {job.workMode}
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4 text-primary" aria-hidden="true" />
              {job.jobType} · {job.experienceLevel} · {job.vacancies} vacancies
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              Apply by {formatDeadline(job.applicationDeadline)}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted">
            {job.description || "Add a concise role summary to preview it here."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
            <span className="font-semibold text-foreground">
              {formatSalary(job)}
            </span>
            <span className="rounded-md bg-accent px-3 py-1.5 font-semibold text-white">
              Apply now
            </span>
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-blue-50 p-2 text-primary dark:bg-blue-500/10">
            <Lightbulb className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Tips for high engagement
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              <li>Use a familiar job title candidates already search for.</li>
              <li>Show salary range and work mode before the description.</li>
              <li>Keep must-have skills focused on the role&apos;s core work.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
          alt="Hiring team collaborating around a table"
          className="h-36 w-full object-cover"
        />
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-emerald-50 p-2 text-accent dark:bg-emerald-500/10">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Showcase your hiring team
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Add team context and clear expectations so candidates can picture
                the work before applying.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

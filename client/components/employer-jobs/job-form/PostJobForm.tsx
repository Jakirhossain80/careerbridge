"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import EmploymentDetails from "@/components/employer-jobs/job-form/EmploymentDetails";
import JobBasicInformation from "@/components/employer-jobs/job-form/JobBasicInformation";
import JobCardPreview from "@/components/employer-jobs/job-form/JobCardPreview";
import JobContentSection from "@/components/employer-jobs/job-form/JobContentSection";
import JobSkillsDeadline from "@/components/employer-jobs/job-form/JobSkillsDeadline";
import PostJobActions from "@/components/employer-jobs/job-form/PostJobActions";
import PostJobToast from "@/components/employer-jobs/job-form/PostJobToast";
import type {
  EmployerJobCompany,
  EmployerJobFormData,
  EmployerJobStatus,
} from "@/types/employer-job";

type PostJobFormProps = {
  initialJob: EmployerJobFormData;
  company: EmployerJobCompany;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostJobForm({ initialJob, company }: PostJobFormProps) {
  const [formData, setFormData] = useState<EmployerJobFormData>(initialJob);
  const [skillInput, setSkillInput] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const completionLabel = useMemo(() => {
    const fields = [
      formData.title,
      formData.category,
      formData.jobType,
      formData.workMode,
      formData.location,
      formData.description,
      formData.responsibilities,
      formData.applicationDeadline,
    ];
    const filledFields = fields.filter(Boolean).length;
    const hasSkills = formData.skills.length > 0 ? 1 : 0;
    return `${Math.round(((filledFields + hasSkills) / 9) * 100)}% ready`;
  }, [formData]);

  function updateField<Key extends keyof EmployerJobFormData>(
    key: Key,
    value: EmployerJobFormData[Key],
  ) {
    setFormData((current) => {
      const next = { ...current, [key]: value };

      if (key === "title" && typeof value === "string") {
        next.slug = slugify(value);
      }

      return next;
    });
    setToastMessage("");
  }

  function setStatus(status: EmployerJobStatus) {
    setFormData((current) => ({
      ...current,
      status,
      publishedAt:
        status === "published" ? new Date().toISOString() : current.publishedAt,
    }));
  }

  function handleDraft() {
    setStatus("draft");
    setToastMessage("Draft saved locally. Backend submission can be connected later.");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("published");
    setToastMessage("Job published locally. Backend submission can be connected later.");
  }

  function handleAddSkill() {
    const nextSkill = skillInput.trim();

    if (!nextSkill) {
      return;
    }

    setFormData((current) => {
      const exists = current.skills.some(
        (skill) => skill.toLowerCase() === nextSkill.toLowerCase(),
      );

      if (exists) {
        return current;
      }

      return { ...current, skills: [...current.skills, nextSkill] };
    });
    setSkillInput("");
    setToastMessage("");
  }

  function handleRemoveSkill(skillToRemove: string) {
    setFormData((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));
    setToastMessage("");
  }

  return (
    <form id="post-job-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
      <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/employer/dashboard" className="transition hover:text-primary">
            Dashboard
          </Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <Link href="#" className="transition hover:text-primary">
            My Jobs
          </Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <span className="font-medium text-foreground">Post New Job</span>
        </nav>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Employer workspace
              </p>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary dark:bg-blue-500/10 dark:text-blue-200">
                {completionLabel}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Post New Job
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Create a clear, candidate-friendly job post for {company.name}.
              Actions are UI-only for now and ready for a future API submission.
            </p>
          </div>

          <PostJobActions onDraft={handleDraft} />
        </div>
      </header>

      {toastMessage ? <PostJobToast message={toastMessage} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <JobBasicInformation formData={formData} onFieldChange={updateField} />
          <EmploymentDetails formData={formData} onFieldChange={updateField} />
          <JobContentSection formData={formData} onFieldChange={updateField} />
          <JobSkillsDeadline
            formData={formData}
            skillInput={skillInput}
            onSkillInputChange={setSkillInput}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            onFieldChange={updateField}
          />
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start" aria-label="Job publishing guidance">
          <JobCardPreview job={formData} company={company} />
        </aside>
      </div>
    </form>
  );
}

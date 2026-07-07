"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import EmploymentDetails from "@/components/employer-jobs/job-form/EmploymentDetails";
import JobBasicInformation from "@/components/employer-jobs/job-form/JobBasicInformation";
import JobCardPreview from "@/components/employer-jobs/job-form/JobCardPreview";
import JobContentSection from "@/components/employer-jobs/job-form/JobContentSection";
import JobSkillsDeadline from "@/components/employer-jobs/job-form/JobSkillsDeadline";
import PostJobActions from "@/components/employer-jobs/job-form/PostJobActions";
import PostJobToast from "@/components/employer-jobs/job-form/PostJobToast";
import { normalizeCurrencyCode } from "@/constants/currency-options";
import { useEmployerJobMutations } from "@/hooks/employer/useEmployerJobs";
import { getApiErrorMessage } from "@/lib/api";
import type {
  EmployerJobCompany,
  EmployerJobFormData,
  EmployerJobStatus,
} from "@/types/employer-job";
import type { CreateJobPayload, JobType, WorkMode } from "@/types/job.types";

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

const jobTypeMap: Record<string, JobType> = {
  "Full-time": "full_time",
  "Part-time": "part_time",
  Contract: "contract",
  Internship: "internship",
  Temporary: "temporary",
};

const workModeMap: Record<string, WorkMode> = {
  Remote: "remote",
  Hybrid: "hybrid",
  "On-site": "onsite",
};

function toList(value: string) {
  return value
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDeadlineIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
}

function toCreateJobPayload(
  formData: EmployerJobFormData,
  status: CreateJobPayload["status"],
): CreateJobPayload {
  return {
    title: formData.title.trim(),
    category: formData.category,
    jobType: jobTypeMap[formData.jobType] ?? "full_time",
    workplaceType: workModeMap[formData.workMode] ?? "hybrid",
    location: formData.workMode === "Remote" ? formData.location || "Remote" : formData.location,
    salaryMin: formData.salaryMin,
    salaryMax: formData.salaryMax,
    currency: normalizeCurrencyCode(formData.currency),
    experienceLevel: formData.experienceLevel,
    vacancies: formData.vacancies,
    deadline: toDeadlineIso(formData.applicationDeadline),
    skills: formData.skills,
    description: formData.description.trim(),
    responsibilities: toList(formData.responsibilities),
    requirements: toList(formData.requirements),
    status,
    featured: status === "published",
  };
}

export default function PostJobForm({ initialJob, company }: PostJobFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<EmployerJobFormData>(initialJob);
  const [skillInput, setSkillInput] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { createMutation } = useEmployerJobMutations();

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
    setErrorMessage("");
  }

  function setStatus(status: EmployerJobStatus) {
    setFormData((current) => ({
      ...current,
      status,
      publishedAt:
        status === "published" ? new Date().toISOString() : current.publishedAt,
    }));
  }

  async function submitJob(status: CreateJobPayload["status"]) {
    setToastMessage("");
    setErrorMessage("");
    const payload = toCreateJobPayload(formData, status);

    if (process.env.NODE_ENV !== "production") {
      console.debug("Employer job create payload", payload);
    }

    try {
      await createMutation.mutateAsync(payload);
      setStatus(status);
      setToastMessage(
        status === "draft"
          ? "Draft saved successfully."
          : "Job published successfully.",
      );
      router.push("/employer/dashboard/jobs");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  function handleDraft() {
    void submitJob("draft");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitJob("published");
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
    setErrorMessage("");
  }

  function handleRemoveSkill(skillToRemove: string) {
    setFormData((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));
    setToastMessage("");
    setErrorMessage("");
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
            </p>
          </div>

          <PostJobActions
            onDraft={handleDraft}
            isSubmitting={createMutation.isPending}
          />
        </div>
      </header>

      {toastMessage ? <PostJobToast message={toastMessage} /> : null}
      {errorMessage ? (
        <div
          className="whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

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

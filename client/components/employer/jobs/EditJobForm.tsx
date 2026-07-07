"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, ChevronRight, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Badge, Button, Card, Input, LoadingSkeleton, Select, Textarea } from "@/components/ui";
import {
  currencyOptions,
  normalizeCurrencyCode,
} from "@/constants/currency-options";
import { getApiErrorMessage } from "@/lib/api";
import { jobFormSchema, type JobFormValues } from "@/lib/validations/job.schema";
import { getJobById, updateJob } from "@/services/jobs.service";
import type { Job, JobStatus, UpdateJobPayload } from "@/types/job.types";

type EditJobFormProps = {
  jobId: string;
};

const categoryOptions = [
  "Software Engineering",
  "Product & Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Data & Analytics",
  "People Operations",
  "Finance",
];

const experienceOptions = [
  "Entry level",
  "Mid level",
  "Senior level",
  "Lead / Principal",
  "Manager",
];

const educationOptions = [
  "No degree required",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
];

const statusOptions: Array<{ label: string; value: JobStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Pending review", value: "pending" },
  { label: "Published", value: "published" },
  { label: "Active", value: "active" },
  { label: "Closed", value: "closed" },
  { label: "Archived", value: "archived" },
];

type EditableJobStatus = JobFormValues["status"];

const defaultValues: JobFormValues = {
  title: "",
  category: "",
  jobType: "full_time",
  workMode: "hybrid",
  location: "",
  salaryMin: undefined,
  salaryMax: undefined,
  currency: "USD",
  experienceLevel: "",
  educationLevel: "",
  openings: 1,
  applicationDeadline: "",
  skills: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  status: "draft",
  isPublished: false,
};

function toText(value: string[] | string | undefined) {
  if (Array.isArray(value)) {
    return value.join("\n");
  }

  return value ?? "";
}

function toList(value?: string) {
  return (value ?? "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDateInput(value?: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function formValuesFromJob(job: Job): JobFormValues {
  const status = statusOptions.some((option) => option.value === job.status)
    ? job.status
    : "draft";

  return {
    title: job.title ?? "",
    category: job.category ?? "",
    jobType: job.jobType ?? "full_time",
    workMode: job.workMode ?? job.workplaceType ?? "hybrid",
    location: job.location ?? "",
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    currency: normalizeCurrencyCode(job.currency),
    experienceLevel: job.experienceLevel ?? "",
    educationLevel: job.educationLevel ?? "",
    openings: job.openings ?? job.vacancies ?? 1,
    applicationDeadline: toDateInput(job.applicationDeadline ?? job.deadline),
    skills: job.skills?.join(", ") ?? "",
    description: job.description ?? "",
    responsibilities: toText(job.responsibilities),
    requirements: toText(job.requirements),
    benefits: toText(job.benefits),
    status: status as EditableJobStatus,
    isPublished: job.isPublished ?? ["published", "active"].includes(status),
  };
}

function payloadFromValues(values: JobFormValues): UpdateJobPayload {
  return {
    title: values.title,
    category: values.category,
    jobType: values.jobType,
    workplaceType: values.workMode,
    location: values.workMode === "remote" ? values.location || "Remote" : values.location,
    salaryMin: values.salaryMin,
    salaryMax: values.salaryMax,
    currency: values.currency.toUpperCase(),
    experienceLevel: values.experienceLevel || undefined,
    educationLevel: values.educationLevel || undefined,
    vacancies: values.openings,
    deadline: values.applicationDeadline,
    skills: toList(values.skills),
    description: values.description,
    responsibilities: toList(values.responsibilities),
    requirements: toList(values.requirements),
    benefits: toList(values.benefits),
    status: values.isPublished && values.status === "draft" ? "published" : values.status,
    featured: values.isPublished,
  };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      }
    >
      {children}
    </Card>
  );
}

export default function EditJobForm({ jobId }: EditJobFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState("");

  const jobQuery = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    enabled: Boolean(jobId),
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors, isDirty },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (jobQuery.data) {
      reset(formValuesFromJob(jobQuery.data));
    }
  }, [jobQuery.data, reset]);

  const mutation = useMutation({
    mutationFn: (payload: UpdateJobPayload) => updateJob(jobId, payload),
    onSuccess: async () => {
      setSuccessMessage("Job posting updated successfully.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["employer-jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["job", jobId] }),
      ]);
      reset(getValues());
    },
  });

  const watchedValues = useWatch({ control });
  const currentValues = useMemo(
    () => ({ ...defaultValues, ...watchedValues }),
    [watchedValues],
  );
  const selectedStatus = currentValues.status;
  const statusLabel = statusOptions.find((option) => option.value === selectedStatus)?.label;

  const summary = useMemo(
    () => [
      { label: "Work mode", value: currentValues.workMode },
      { label: "Job type", value: currentValues.jobType.replace("_", " ") },
      { label: "Openings", value: String(currentValues.openings || 1) },
      { label: "Deadline", value: currentValues.applicationDeadline || "Not set" },
    ],
    [currentValues],
  );

  async function onSubmit(values: JobFormValues) {
    setSuccessMessage("");
    mutation.mutate(payloadFromValues(values));
  }

  if (jobQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <LoadingSkeleton variant="card" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    );
  }

  if (jobQuery.isError) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-red-50 text-red-700">
          !
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Unable to load job</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {getApiErrorMessage(jobQuery.error)}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => router.push("/employer/dashboard/jobs")}>
            Back to My Jobs
          </Button>
          <Button onClick={() => jobQuery.refetch()}>Try again</Button>
        </div>
      </Card>
    );
  }

  if (!jobQuery.data) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-foreground">Job not found</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          This job posting may have been removed or you may not have access to it.
        </p>
        <Button className="mt-6" onClick={() => router.push("/employer/dashboard/jobs")}>
          Back to My Jobs
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/employer/dashboard" className="transition hover:text-primary">
            Dashboard
          </Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <Link href="/employer/dashboard/jobs" className="transition hover:text-primary">
            My Jobs
          </Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <span className="font-medium text-foreground">Edit Job Posting</span>
        </nav>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Employer workspace
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Edit Job Posting
              </h1>
              {statusLabel ? <Badge variant="primary">{statusLabel}</Badge> : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Update job details, requirements, salary, visibility, and publishing status.
            </p>
          </div>

          <Link href="/employer/dashboard/jobs">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
              className="w-full sm:w-auto"
            >
              Back to My Jobs
            </Button>
          </Link>
        </div>
      </header>

      {successMessage ? (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>{successMessage}</p>
        </div>
      ) : null}

      {mutation.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {getApiErrorMessage(mutation.error)}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Section
            title="Basic Job Information"
            description="Keep the role title, category, and candidate profile accurate."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Job title" required error={errors.title?.message} {...register("title")} wrapperClassName="md:col-span-2" />
              <Select label="Category" required error={errors.category?.message} {...register("category")}>
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <Select label="Experience level" error={errors.experienceLevel?.message} {...register("experienceLevel")}>
                <option value="">Select experience</option>
                {experienceOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
              <Select label="Education level" error={errors.educationLevel?.message} {...register("educationLevel")} wrapperClassName="md:col-span-2">
                <option value="">Select education</option>
                {educationOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            </div>
          </Section>

          <Section
            title="Job Details"
            description="Define how the role works and where candidates are expected to be."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Select label="Job type" required error={errors.jobType?.message} {...register("jobType")}>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
                <option value="freelance">Freelance</option>
              </Select>
              <Select label="Work mode" required error={errors.workMode?.message} {...register("workMode")}>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </Select>
              <Input label="Location" error={errors.location?.message} placeholder="City, state or Remote" {...register("location")} wrapperClassName="md:col-span-2" />
            </div>
          </Section>

          <Section
            title="Salary & Openings"
            description="Set compensation, number of openings, and application deadline."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Salary min"
                type="number"
                min={0}
                error={errors.salaryMin?.message}
                {...register("salaryMin", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
              />
              <Input
                label="Salary max"
                type="number"
                min={0}
                error={errors.salaryMax?.message}
                {...register("salaryMax", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
              />
              <Select label="Currency" required error={errors.currency?.message} {...register("currency")}>
                {currencyOptions.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Openings"
                type="number"
                min={1}
                required
                error={errors.openings?.message}
                {...register("openings", { valueAsNumber: true })}
              />
              <Input label="Application deadline" type="date" required error={errors.applicationDeadline?.message} {...register("applicationDeadline")} wrapperClassName="md:col-span-2" />
            </div>
          </Section>

          <Section
            title="Description Sections"
            description="Use clear, scannable content for candidate expectations."
          >
            <div className="grid gap-5">
              <Textarea label="Description" required error={errors.description?.message} {...register("description")} />
              <Textarea label="Responsibilities" required helperText="Separate items with commas or new lines." error={errors.responsibilities?.message} {...register("responsibilities")} />
              <Textarea label="Requirements" required helperText="Separate items with commas or new lines." error={errors.requirements?.message} {...register("requirements")} />
              <Textarea label="Benefits" helperText="Separate items with commas or new lines." error={errors.benefits?.message} {...register("benefits")} />
            </div>
          </Section>

          <Section
            title="Skills"
            description="Add searchable skills that help candidates find the role."
          >
            <Textarea label="Skills" helperText="Comma-separated skills, for example: React, TypeScript, Next.js" error={errors.skills?.message} {...register("skills")} />
          </Section>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <Card
            header={
              <div>
                <h2 className="text-lg font-semibold text-foreground">Status & Visibility</h2>
                <p className="mt-1 text-sm text-muted">Control whether candidates can find this post.</p>
              </div>
            }
            footer={
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  isLoading={mutation.isPending}
                  disabled={mutation.isPending}
                  leftIcon={<Save className="size-4" aria-hidden="true" />}
                  className="w-full"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/employer/dashboard/jobs")}
                >
                  Cancel
                </Button>
                <p className="text-center text-xs text-muted">
                  {isDirty ? "Unsaved changes" : "No unsaved changes"}
                </p>
              </div>
            }
          >
            <div className="space-y-5">
              <Select label="Status" required error={errors.status?.message} {...register("status")}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary"
                  {...register("isPublished")}
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    Published visibility
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted">
                    Make this job available to candidates when status allows it.
                  </span>
                </span>
              </label>

              <div className="rounded-lg border border-slate-200 bg-blue-50/60 p-4 dark:border-slate-700 dark:bg-blue-500/10">
                <h3 className="text-sm font-semibold text-foreground">Posting summary</h3>
                <dl className="mt-3 space-y-3">
                  {summary.map((item) => (
                    <div key={item.label} className="flex justify-between gap-4 text-sm">
                      <dt className="text-muted">{item.label}</dt>
                      <dd className="text-right font-medium capitalize text-foreground">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </form>
  );
}

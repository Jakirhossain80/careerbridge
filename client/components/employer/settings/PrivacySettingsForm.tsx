"use client";

import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui";
import type { EmployerSettingsFormValues } from "@/lib/validations/employer-settings.schema";

const privacyRows = [
  {
    name: "privacy.companyProfileVisible",
    label: "Company profile visibility",
    description: "Allow job seekers to view the company profile.",
  },
  {
    name: "privacy.jobPostingVisible",
    label: "Job posting visibility",
    description: "Keep published jobs visible in public listings.",
  },
  {
    name: "privacy.contactInfoVisible",
    label: "Contact information visibility",
    description: "Show company contact details on public pages.",
  },
  {
    name: "privacy.showCompanySize",
    label: "Show company size",
    description: "Display team size alongside company details.",
  },
  {
    name: "privacy.showSalaryRange",
    label: "Show salary range",
    description: "Display salary ranges where they are included on job posts.",
  },
] as const;

export default function PrivacySettingsForm() {
  const { register } = useFormContext<EmployerSettingsFormValues>();

  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold">Privacy Settings</h2>
          <p className="mt-1 text-sm text-muted">
            Control how employer and job details appear to candidates.
          </p>
        </div>
      }
      contentClassName="divide-y divide-slate-200 p-0 dark:divide-slate-700"
    >
      {privacyRows.map((row) => (
        <label
          key={row.name}
          className="flex cursor-pointer flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="block text-sm font-semibold text-foreground">{row.label}</span>
            <span className="mt-1 block text-sm leading-6 text-muted">{row.description}</span>
          </span>
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-slate-300 text-primary accent-primary"
            {...register(row.name)}
          />
        </label>
      ))}
    </Card>
  );
}


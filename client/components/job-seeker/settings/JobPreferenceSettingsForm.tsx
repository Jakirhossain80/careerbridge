"use client";

import { BriefcaseBusiness } from "lucide-react";
import { useFormContext } from "react-hook-form";

import SettingsCard from "@/components/settings/SettingsCard";
import { Input } from "@/components/ui";
import type { UserSettingsFormValues } from "@/lib/validations/user-settings.schema";

type ArrayFieldName =
  | "jobPreferences.preferredCategories"
  | "jobPreferences.preferredLocations"
  | "jobPreferences.preferredEmploymentTypes"
  | "jobPreferences.preferredWorkModes";

const arrayFields: Array<{
  name: ArrayFieldName;
  label: string;
  helperText: string;
  placeholder: string;
}> = [
  {
    name: "jobPreferences.preferredCategories",
    label: "Preferred job categories",
    helperText: "Separate each category with a comma.",
    placeholder: "Software Engineering, Product Management",
  },
  {
    name: "jobPreferences.preferredLocations",
    label: "Preferred locations",
    helperText: "Add cities or remote locations separated by commas.",
    placeholder: "Dhaka, Remote, Singapore",
  },
  {
    name: "jobPreferences.preferredEmploymentTypes",
    label: "Preferred employment types",
    helperText: "Examples: Full-time, Contract, Internship.",
    placeholder: "Full-time, Contract",
  },
  {
    name: "jobPreferences.preferredWorkModes",
    label: "Preferred work modes",
    helperText: "Examples: Remote, Hybrid, On-site.",
    placeholder: "Remote, Hybrid",
  },
];

function toCsv(value?: string[]) {
  return value?.join(", ") ?? "";
}

function fromCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function JobPreferenceSettingsForm() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<UserSettingsFormValues>();

  return (
    <SettingsCard
      title="Job Preference Settings"
      description="Prepare your saved preferences for matching, alerts, and recommendations."
      icon={<BriefcaseBusiness className="size-5" aria-hidden="true" />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {arrayFields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            helperText={field.helperText}
            placeholder={field.placeholder}
            value={toCsv(watch(field.name))}
            onChange={(event) =>
              setValue(field.name, fromCsv(event.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        ))}
        <Input
          label="Expected salary minimum"
          type="number"
          min={0}
          error={errors.jobPreferences?.expectedSalaryMin?.message}
          {...register("jobPreferences.expectedSalaryMin", { valueAsNumber: true })}
        />
        <Input
          label="Expected salary maximum"
          type="number"
          min={0}
          error={errors.jobPreferences?.expectedSalaryMax?.message}
          {...register("jobPreferences.expectedSalaryMax", { valueAsNumber: true })}
        />
      </div>
    </SettingsCard>
  );
}

"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Shield } from "lucide-react";

import SettingsCard from "@/components/settings/SettingsCard";
import ToggleSwitch from "@/components/settings/ToggleSwitch";
import { Select } from "@/components/ui";
import type { UserSettingsFormValues } from "@/lib/validations/user-settings.schema";

const visibilityOptions = [
  { label: "Public", value: "public" },
  { label: "Recruiters only", value: "recruiters_only" },
  { label: "Private", value: "private" },
];

const privacyToggles = [
  {
    name: "privacySettings.contactInfoVisible",
    label: "Contact information visibility",
    description: "Allow approved recruiters to view your phone and email.",
  },
  {
    name: "privacySettings.publicSearchVisible",
    label: "Public search visibility",
    description: "Allow your candidate profile to appear in recruiter search results.",
  },
] as const;

export default function PrivacySettingsForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<UserSettingsFormValues>();

  return (
    <SettingsCard
      title="Privacy Settings"
      description="Control how your profile, resume, and contact details are visible."
      icon={<Shield className="size-5" aria-hidden="true" />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Profile visibility"
          options={visibilityOptions}
          error={errors.privacySettings?.profileVisibility?.message}
          {...register("privacySettings.profileVisibility")}
        />
        <Select
          label="Resume visibility"
          options={visibilityOptions}
          error={errors.privacySettings?.resumeVisibility?.message}
          {...register("privacySettings.resumeVisibility")}
        />
      </div>

      <div className="-mx-5 mt-5 divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {privacyToggles.map((row) => (
          <Controller
            key={row.name}
            control={control}
            name={row.name}
            render={({ field }) => (
              <ToggleSwitch
                label={row.label}
                description={row.description}
                checked={Boolean(field.value)}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        ))}
      </div>
    </SettingsCard>
  );
}

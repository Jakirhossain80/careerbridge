"use client";

import { Mail } from "lucide-react";
import { useFormContext } from "react-hook-form";

import SettingsCard from "@/components/settings/SettingsCard";
import { Button, Input, Select } from "@/components/ui";
import type { UserSettingsFormValues } from "@/lib/validations/user-settings.schema";

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Bangla", value: "bn" },
  { label: "Hindi", value: "hi" },
  { label: "Arabic", value: "ar" },
];

const timeZoneOptions = [
  { label: "Dhaka (GMT+6)", value: "Asia/Dhaka" },
  { label: "UTC", value: "UTC" },
  { label: "New York (Eastern Time)", value: "America/New_York" },
  { label: "London", value: "Europe/London" },
  { label: "Singapore", value: "Asia/Singapore" },
];

export default function AccountSettingsForm() {
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<UserSettingsFormValues>();
  const linkedProfiles = watch("accountPreferences.linkedProfiles") ?? [];

  return (
    <SettingsCard
      title="Account Settings"
      description="Manage your email, contact details, language, and regional preferences."
      icon={<Mail className="size-5" aria-hidden="true" />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Current email"
          type="email"
          error={errors.accountPreferences?.currentEmail?.message}
          {...register("accountPreferences.currentEmail")}
        />
        <Input
          label="New email"
          type="email"
          placeholder="name@example.com"
          error={errors.accountPreferences?.newEmail?.message}
          {...register("accountPreferences.newEmail")}
        />
        <Input
          label="Phone number"
          type="tel"
          error={errors.accountPreferences?.phone?.message}
          {...register("accountPreferences.phone")}
        />
        <Select
          label="Language preference"
          options={languageOptions}
          error={errors.accountPreferences?.language?.message}
          {...register("accountPreferences.language")}
        />
        <Select
          label="Time zone"
          options={timeZoneOptions}
          error={errors.accountPreferences?.timeZone?.message}
          {...register("accountPreferences.timeZone")}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-md border border-slate-200 bg-background p-4 dark:border-slate-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Linked profile information
            </h3>
            <p className="mt-1 text-sm text-muted">
              Connected sign-in providers associated with this account.
            </p>
          </div>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            Update Email
          </Button>
        </div>

        {linkedProfiles.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {linkedProfiles.map((profile) => (
              <div
                key={`${profile.provider}-${profile.email ?? "profile"}`}
                className="rounded-md border border-slate-200 bg-surface px-3 py-2 text-sm dark:border-slate-700"
              >
                <p className="font-semibold text-foreground">{profile.provider}</p>
                <p className="mt-1 truncate text-muted">{profile.email ?? "No email listed"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No linked profiles are connected yet.</p>
        )}
      </div>
    </SettingsCard>
  );
}

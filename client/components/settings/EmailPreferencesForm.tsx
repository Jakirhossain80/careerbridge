"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Mail, RefreshCcw, Save, Undo2 } from "lucide-react";

import SettingsCard from "@/components/settings/SettingsCard";
import ToggleSwitch from "@/components/settings/ToggleSwitch";
import { Button, Card } from "@/components/ui";
import {
  useEmailPreferences,
  useUpdateEmailPreferences,
} from "@/hooks/settings/useEmailPreferences";
import { getApiErrorMessage } from "@/lib/api";
import {
  emailPreferencesSchema,
  type EmailPreferencesFormValues,
} from "@/lib/validations/email-preferences.schema";

const preferenceRows = [
  {
    name: "applicationSubmittedEmail",
    label: "Job application submitted",
    description: "Email me when a submitted application creates an employer-facing update.",
  },
  {
    name: "applicationStatusChangedEmail",
    label: "Application status changed",
    description: "Email me when an application moves to a new status.",
  },
  {
    name: "interviewScheduledEmail",
    label: "Interview scheduled",
    description: "Email me when an interview is scheduled.",
  },
  {
    name: "employerApprovedEmail",
    label: "Employer approved",
    description: "Email me when an employer account is approved.",
  },
  {
    name: "jobApprovedRejectedEmail",
    label: "Job approved or rejected",
    description: "Email me when a job posting review is completed.",
  },
  {
    name: "newJobAlertEmail",
    label: "New job alert",
    description: "Email me when new jobs match saved alert preferences.",
  },
] as const;

const defaultValues: EmailPreferencesFormValues = {
  applicationSubmittedEmail: true,
  applicationStatusChangedEmail: true,
  interviewScheduledEmail: true,
  employerApprovedEmail: true,
  jobApprovedRejectedEmail: true,
  newJobAlertEmail: true,
};

export default function EmailPreferencesForm() {
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const preferencesQuery = useEmailPreferences();
  const updatePreferences = useUpdateEmailPreferences();

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = useForm<EmailPreferencesFormValues>({
    resolver: zodResolver(emailPreferencesSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (preferencesQuery.data) {
      reset(preferencesQuery.data);
    }
  }, [preferencesQuery.data, reset]);

  function handleDiscard() {
    reset(preferencesQuery.data ?? defaultValues);
    setSuccessMessage("");
    setActionError("");
  }

  function handleSave(values: EmailPreferencesFormValues) {
    setSuccessMessage("");
    setActionError("");

    updatePreferences.mutate(values, {
      onSuccess: (preferences) => {
        reset(preferences);
        setSuccessMessage("Email preferences updated successfully.");
      },
      onError: (error) => {
        setActionError(getApiErrorMessage(error) || "Unable to update email preferences.");
      },
    });
  }

  if (preferencesQuery.isLoading) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8" aria-live="polite" aria-busy="true">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card contentClassName="p-6">
            <p className="text-sm font-semibold text-muted">Loading email preferences...</p>
          </Card>
          <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
        </div>
      </main>
    );
  }

  if (preferencesQuery.isError) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card contentClassName="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-red-700">
                  Unable to load email preferences.
                </h1>
                <p className="mt-1 text-sm text-muted">Please retry the request.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => preferencesQuery.refetch()}
                leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />}
              >
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <form className="mx-auto max-w-4xl space-y-6" onSubmit={handleSubmit(handleSave)}>
        <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Email Preferences
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Choose which CareerBridge notification events should be sent to your email.
          </p>

          {successMessage ? (
            <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {successMessage}
            </div>
          ) : null}

          {actionError ? (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {actionError}
            </div>
          ) : null}
        </header>

        <SettingsCard
          title="Notification Emails"
          description="These preferences only control email delivery. In-app notifications remain available when supported."
          icon={<Mail className="size-5" aria-hidden="true" />}
          contentClassName="divide-y divide-slate-200 p-0 dark:divide-slate-700"
        >
          {preferenceRows.map((row) => (
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
        </SettingsCard>

        <footer className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-background/95 px-4 py-4 backdrop-blur dark:border-slate-700 sm:mx-0 sm:rounded-lg sm:border sm:bg-surface sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {isDirty ? "You have unsaved changes." : "Email preferences are up to date."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                leftIcon={<Undo2 className="size-4" aria-hidden="true" />}
                onClick={handleDiscard}
                disabled={!isDirty || updatePreferences.isPending}
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                leftIcon={<Save className="size-4" aria-hidden="true" />}
                isLoading={updatePreferences.isPending}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </footer>
      </form>
    </main>
  );
}

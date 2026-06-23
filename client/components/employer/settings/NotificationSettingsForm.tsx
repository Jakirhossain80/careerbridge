"use client";

import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui";
import type { EmployerSettingsFormValues } from "@/lib/validations/employer-settings.schema";

const notificationRows = [
  {
    name: "notifications.newApplicant",
    label: "New applicant notifications",
    description: "Get notified when candidates apply to active jobs.",
  },
  {
    name: "notifications.interviewReminder",
    label: "Interview reminder notifications",
    description: "Receive reminders before scheduled interviews.",
  },
  {
    name: "notifications.jobExpiry",
    label: "Job expiry notifications",
    description: "Warn recruiters before job posts expire.",
  },
  {
    name: "notifications.emailNotifications",
    label: "Email notification preferences",
    description: "Send important hiring updates to your email address.",
  },
  {
    name: "notifications.dailyDigest",
    label: "Daily digest",
    description: "Bundle applicant and hiring activity into one daily summary.",
  },
] as const;

export default function NotificationSettingsForm() {
  const { register } = useFormContext<EmployerSettingsFormValues>();

  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold">Notification Settings</h2>
          <p className="mt-1 text-sm text-muted">
            Choose which hiring events should reach your team.
          </p>
        </div>
      }
      contentClassName="divide-y divide-slate-200 p-0 dark:divide-slate-700"
    >
      {notificationRows.map((row) => (
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


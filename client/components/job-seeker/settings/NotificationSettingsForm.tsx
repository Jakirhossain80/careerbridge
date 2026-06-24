"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Bell } from "lucide-react";

import SettingsCard from "@/components/settings/SettingsCard";
import ToggleSwitch from "@/components/settings/ToggleSwitch";
import type { UserSettingsFormValues } from "@/lib/validations/user-settings.schema";

const notificationRows = [
  {
    name: "notificationPreferences.enableNotifications",
    label: "Enable notifications",
    description: "Allow CareerBridge to notify you about job search activity.",
  },
  {
    name: "notificationPreferences.emailNotifications",
    label: "Email notifications",
    description: "Send important updates to your account email.",
  },
  {
    name: "notificationPreferences.applicationUpdates",
    label: "Application updates",
    description: "Receive updates when employers review or update your applications.",
  },
  {
    name: "notificationPreferences.interviewNotifications",
    label: "Interview notifications",
    description: "Get notified when an employer schedules or changes an interview.",
  },
  {
    name: "notificationPreferences.interviewReminders",
    label: "Interview reminders",
    description: "Receive reminders before upcoming interviews.",
  },
  {
    name: "notificationPreferences.jobAlerts",
    label: "Job alert notifications",
    description: "Notify me when saved job alerts match new openings.",
  },
  {
    name: "notificationPreferences.recommendedJobs",
    label: "Recommended job notifications",
    description: "Show personalized recommendations based on my profile.",
  },
] as const;

export default function NotificationSettingsForm() {
  const { control } = useFormContext<UserSettingsFormValues>();

  return (
    <SettingsCard
      title="Notification Settings"
      description="Choose which job search updates should reach you."
      icon={<Bell className="size-5" aria-hidden="true" />}
      contentClassName="divide-y divide-slate-200 p-0 dark:divide-slate-700"
    >
      {notificationRows.map((row) => (
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
  );
}

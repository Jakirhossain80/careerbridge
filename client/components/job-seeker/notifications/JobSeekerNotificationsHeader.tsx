"use client";

import { CheckCheck } from "lucide-react";

import { Badge, Button } from "@/components/ui";

type JobSeekerNotificationsHeaderProps = {
  total: number;
  unreadCount: number;
  onMarkAllRead: () => void;
  isMarkingAllRead: boolean;
};

export default function JobSeekerNotificationsHeader({
  total,
  unreadCount,
  onMarkAllRead,
  isMarkingAllRead,
}: JobSeekerNotificationsHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Job Seeker Portal
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Notifications
            </h1>
            <Badge variant={unreadCount > 0 ? "primary" : "neutral"}>
              {unreadCount} New
            </Badge>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted sm:text-base">
            Track application updates, interviews, job alerts, employer activity,
            account security, and CareerBridge system messages.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground" aria-live="polite">
            Showing {total} notifications
          </p>
        </div>

        <Button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          isLoading={isMarkingAllRead}
          leftIcon={<CheckCheck className="size-4" aria-hidden="true" />}
          className="w-full sm:w-fit"
        >
          Mark All as Read
        </Button>
      </div>
    </header>
  );
}

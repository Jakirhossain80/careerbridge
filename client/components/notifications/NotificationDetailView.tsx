"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, RefreshCcw } from "lucide-react";

import NotificationTypeIcon from "@/components/notifications/NotificationTypeIcon";
import { Badge, Button, Card, EmptyState, LoadingSkeleton } from "@/components/ui";
import { useNotification } from "@/hooks/notifications/useNotification";
import { useNotificationMutations } from "@/hooks/notifications/useNotificationMutations";
import { getApiErrorMessage } from "@/lib/api";

type NotificationDetailViewProps = {
  notificationId: string;
};

const typeLabels = {
  application_submitted: "Application Submitted",
  application_status_changed: "Application Status Changed",
  interview_scheduled: "Interview Scheduled",
  employer_approved: "Employer Approved",
  job_approved: "Job Approved",
  job_rejected: "Job Rejected",
  new_job_alert: "New Job Alert",
  application_update: "Application Update",
  interview_invitation: "Interview Invitation",
  interview_reminder: "Interview Reminder",
  job_alert: "Job Alert",
  recommended_job: "Recommended Job",
  saved_job_update: "Saved Job Update",
  employer_message: "Employer Message",
  system: "System",
  security: "Security",
  career_insight: "Career Insight",
} as const;

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function NotificationDetailView({
  notificationId,
}: NotificationDetailViewProps) {
  const [actionError, setActionError] = useState("");
  const notificationQuery = useNotification(notificationId);
  const { markRead } = useNotificationMutations();
  const notification = notificationQuery.data;
  const autoMarkedNotificationId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      notification &&
      !notification.isRead &&
      autoMarkedNotificationId.current !== notification._id
    ) {
      autoMarkedNotificationId.current = notification._id;
      markRead.mutate(notification._id, {
        onError: (error) =>
          setActionError(getApiErrorMessage(error) || "Unable to mark notification as read."),
      });
    }
  }, [markRead, notification]);

  if (notificationQuery.isLoading) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8" aria-live="polite" aria-busy="true">
        <div className="mx-auto max-w-4xl space-y-4">
          <LoadingSkeleton variant="card" rows={1} />
          <LoadingSkeleton variant="card" rows={4} />
        </div>
      </main>
    );
  }

  if (notificationQuery.isError) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <Link href="/notifications">
            <Button
              type="button"
              variant="ghost"
              leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
            >
              Back to Notifications
            </Button>
          </Link>
          <Card contentClassName="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-red-700">
                  Unable to load notification.
                </h1>
                <p className="mt-1 text-sm text-muted">
                  The notification may not exist or may not belong to your account.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => notificationQuery.refetch()}
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

  if (!notification) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            title="Notification not found."
            description="This notification is unavailable or no longer exists."
            actionLabel="Back to Notifications"
            actionHref="/notifications"
          />
        </div>
      </main>
    );
  }

  const relatedType = notification.entityType ?? notification.resourceType;
  const relatedId = notification.entityId ?? notification.resourceId;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/notifications">
          <Button
            type="button"
            variant="ghost"
            leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
          >
            Back to Notifications
          </Button>
        </Link>

        {actionError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </div>
        ) : null}

        <Card contentClassName="p-5 sm:p-6">
          <article className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${
                  notification.isRead ? "bg-slate-100 text-slate-600" : "bg-primary text-white"
                }`}
              >
                <NotificationTypeIcon type={notification.type} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={notification.isRead ? "neutral" : "primary"}>
                    {notification.isRead ? "Read" : "Unread"}
                  </Badge>
                  <Badge variant="neutral">{typeLabels[notification.type]}</Badge>
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {notification.title}
                </h1>
                <time className="mt-2 block text-sm text-muted" dateTime={notification.createdAt}>
                  {formatDateTime(notification.createdAt)}
                </time>
              </div>
            </div>

            <p className="text-base leading-7 text-foreground">{notification.message}</p>

            <dl className="grid gap-4 rounded-lg border border-slate-200 bg-background p-4 text-sm dark:border-slate-700 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-muted">Related Type</dt>
                <dd className="mt-1 capitalize text-foreground">
                  {relatedType?.replace(/_/g, " ") ?? "None"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-muted">Related ID</dt>
                <dd className="mt-1 break-all text-foreground">{relatedId ?? "None"}</dd>
              </div>
            </dl>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!notification.isRead ? (
                <Button
                  type="button"
                  isLoading={markRead.isPending}
                  leftIcon={<Check className="size-4" aria-hidden="true" />}
                  onClick={() => markRead.mutate(notification._id)}
                >
                  Mark as Read
                </Button>
              ) : null}

              {notification.link ? (
                <Link href={notification.link}>
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<ExternalLink className="size-4" aria-hidden="true" />}
                  >
                    Open Related Item
                  </Button>
                </Link>
              ) : null}
            </div>
          </article>
        </Card>
      </div>
    </main>
  );
}

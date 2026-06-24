"use client";

import Link from "next/link";
import { Check, Circle, Eye, ExternalLink, Trash2 } from "lucide-react";

import NotificationTypeIcon from "@/components/notifications/NotificationTypeIcon";
import { Badge, Button, Card } from "@/components/ui";
import type { CareerBridgeNotification } from "@/types/notification.types";

type NotificationCardProps = {
  notification: CareerBridgeNotification;
  href?: string;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onMarkRead: (notification: CareerBridgeNotification) => void;
  onMarkUnread: (notification: CareerBridgeNotification) => void;
  onDelete: (notification: CareerBridgeNotification) => void;
};

const typeLabels: Record<CareerBridgeNotification["type"], string> = {
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
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function NotificationCard({
  notification,
  href,
  isUpdating = false,
  isDeleting = false,
  onMarkRead,
  onMarkUnread,
  onDelete,
}: NotificationCardProps) {
  return (
    <Card
      className={
        notification.isRead
          ? "bg-surface"
          : "border-blue-200 bg-blue-50/60 shadow-blue-900/5"
      }
      contentClassName="p-4 sm:p-5"
    >
      <article className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4 sm:flex-1">
          <div
            className={`mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-lg ${
              notification.isRead
                ? "bg-slate-100 text-slate-600"
                : "bg-primary text-white"
            }`}
          >
            <NotificationTypeIcon type={notification.type} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {!notification.isRead ? (
                <Circle className="size-2 fill-primary text-primary" aria-label="Unread" />
              ) : null}
              <h3 className="text-base font-semibold text-foreground">
                {notification.title}
              </h3>
              <Badge variant={notification.isRead ? "neutral" : "primary"}>
                {notification.isRead ? "Read" : "Unread"}
              </Badge>
              <Badge variant="neutral">{typeLabels[notification.type]}</Badge>
            </div>

            <p className="mt-2 text-sm leading-6 text-muted">{notification.message}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
              <time dateTime={notification.createdAt}>
                {formatTime(notification.createdAt)}
              </time>
              {notification.resourceType ? (
                <span className="capitalize">
                  {notification.resourceType.replace(/_/g, " ")}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {href ? (
            <Link href={href}>
              <Button
                type="button"
                size="sm"
                variant="outline"
                leftIcon={<ExternalLink className="size-4" aria-hidden="true" />}
              >
                {notification.actionLabel ?? "View Details"}
              </Button>
            </Link>
          ) : null}

          {notification.isRead ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              isLoading={isUpdating}
              leftIcon={<Eye className="size-4" aria-hidden="true" />}
              onClick={() => onMarkUnread(notification)}
            >
              Mark Unread
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              isLoading={isUpdating}
              leftIcon={<Check className="size-4" aria-hidden="true" />}
              onClick={() => onMarkRead(notification)}
            >
              Mark Read
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            isLoading={isDeleting}
            leftIcon={<Trash2 className="size-4" aria-hidden="true" />}
            onClick={() => onDelete(notification)}
            className="text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            Delete
          </Button>
        </div>
      </article>
    </Card>
  );
}

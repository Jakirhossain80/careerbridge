"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BriefcaseBusiness, RefreshCcw } from "lucide-react";

import DeleteNotificationConfirmModal from "@/components/job-seeker/notifications/DeleteNotificationConfirmModal";
import JobSeekerNotificationsHeader from "@/components/job-seeker/notifications/JobSeekerNotificationsHeader";
import NotificationPromoBanner from "@/components/job-seeker/notifications/NotificationPromoBanner";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationList, {
  type NotificationGroup,
} from "@/components/notifications/NotificationList";
import { Button, Card, EmptyState, LoadingSkeleton, Pagination } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markNotificationAsUnread,
  notificationQueryKeys,
} from "@/services/notifications.service";
import type {
  CareerBridgeNotification,
  NotificationsQueryParams,
  NotificationSortBy,
  NotificationStatusFilter,
  NotificationType,
} from "@/types/notification.types";

const pageSize = 8;
const emptyNotifications: CareerBridgeNotification[] = [];

const initialFilters: Required<
  Pick<NotificationsQueryParams, "status" | "type" | "sortBy" | "page" | "limit">
> = {
  status: "all",
  type: "all",
  sortBy: "newest",
  page: 1,
  limit: pageSize,
};

function getDateGroup(value: string) {
  const date = new Date(value);
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  const dayDiff = Math.floor((startOfToday - startOfDate) / 86_400_000);

  if (dayDiff === 0) {
    return "Today";
  }

  if (dayDiff === 1) {
    return "Yesterday";
  }

  if (dayDiff <= 7) {
    return "Last Week";
  }

  return "Earlier";
}

function groupNotifications(
  notifications: CareerBridgeNotification[],
): NotificationGroup[] {
  const groupOrder = ["Today", "Yesterday", "Last Week", "Earlier"];
  const grouped = notifications.reduce<Record<string, CareerBridgeNotification[]>>(
    (acc, notification) => {
      const label = getDateGroup(notification.createdAt);
      acc[label] = [...(acc[label] ?? []), notification];
      return acc;
    },
    {},
  );

  return groupOrder
    .map((label) => ({
      label,
      notifications: grouped[label] ?? [],
    }))
    .filter((group) => group.notifications.length > 0);
}

function getNotificationHref(notification: CareerBridgeNotification) {
  if (notification.resourceType === "application" && notification.resourceId) {
    return `/profile/applications/${notification.resourceId}`;
  }

  if (
    notification.resourceType === "job" &&
    (notification.resourceSlug || notification.resourceId)
  ) {
    return `/jobs/${notification.resourceSlug ?? notification.resourceId}`;
  }

  if (notification.resourceType === "interview" && notification.resourceId) {
    return `/job-seeker/interviews`;
  }

  if (notification.resourceType === "recommended_job") {
    return "/job-seeker/recommended-jobs";
  }

  if (notification.resourceType === "saved_job") {
    return "/profile/saved-jobs";
  }

  if (notification.type === "career_insight") {
    return "/job-seeker/profile/edit";
  }

  return undefined;
}

function buildQueryParams(filters: NotificationsQueryParams): NotificationsQueryParams {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null,
    ),
  ) as NotificationsQueryParams;
}

function NotificationsLoadingState() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <p className="text-sm font-medium text-muted">Loading notifications...</p>
        <LoadingSkeleton variant="card" rows={1} />
        <LoadingSkeleton variant="card" rows={1} />
        <LoadingSkeleton variant="card" rows={4} />
      </div>
    </main>
  );
}

export default function JobSeekerNotificationsContent() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<NotificationsQueryParams>(initialFilters);
  const [searchDraft, setSearchDraft] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingNotificationId, setUpdatingNotificationId] = useState<string>();
  const [deletingNotificationId, setDeletingNotificationId] = useState<string>();
  const [notificationToDelete, setNotificationToDelete] =
    useState<CareerBridgeNotification | null>(null);

  const queryParams = useMemo(() => buildQueryParams(filters), [filters]);

  const notificationsQuery = useQuery({
    queryKey: notificationQueryKeys.list(queryParams),
    queryFn: () => getNotifications(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const invalidateNotifications = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unread }),
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.dashboard }),
    ]);
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: (notificationId) => {
      setUpdatingNotificationId(notificationId);
      setFeedbackMessage("");
      setActionError("");
    },
    onSuccess: async () => {
      setFeedbackMessage("Notification marked as read.");
      await invalidateNotifications();
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error) || "Unable to update notification.");
    },
    onSettled: () => setUpdatingNotificationId(undefined),
  });

  const markUnreadMutation = useMutation({
    mutationFn: markNotificationAsUnread,
    onMutate: (notificationId) => {
      setUpdatingNotificationId(notificationId);
      setFeedbackMessage("");
      setActionError("");
    },
    onSuccess: async () => {
      setFeedbackMessage("Notification marked as unread.");
      await invalidateNotifications();
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error) || "Unable to update notification.");
    },
    onSettled: () => setUpdatingNotificationId(undefined),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: () => {
      setFeedbackMessage("");
      setActionError("");
    },
    onSuccess: async () => {
      setFeedbackMessage("All notifications marked as read.");
      await invalidateNotifications();
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error) || "Unable to update notification.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onMutate: (notificationId) => {
      setDeletingNotificationId(notificationId);
      setFeedbackMessage("");
      setActionError("");
    },
    onSuccess: async () => {
      setNotificationToDelete(null);
      setFeedbackMessage("Notification deleted.");
      await invalidateNotifications();
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error) || "Unable to delete notification.");
    },
    onSettled: () => setDeletingNotificationId(undefined),
  });

  const data = notificationsQuery.data;
  const notifications = data?.notifications ?? emptyNotifications;
  const groups = useMemo(() => groupNotifications(notifications), [notifications]);

  function updateFilters(updates: NotificationsQueryParams) {
    setFilters((current) => ({
      ...current,
      ...updates,
      page: updates.page ?? 1,
    }));
  }

  if (notificationsQuery.isLoading) {
    return <NotificationsLoadingState />;
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <JobSeekerNotificationsHeader
          total={data?.total ?? 0}
          unreadCount={data?.unreadCount ?? 0}
          onMarkAllRead={() => markAllReadMutation.mutate()}
          isMarkingAllRead={markAllReadMutation.isPending}
        />

        {feedbackMessage ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedbackMessage}
          </div>
        ) : null}

        {actionError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </div>
        ) : null}

        <NotificationFilters
          search={searchDraft}
          status={(filters.status ?? "all") as NotificationStatusFilter}
          type={(filters.type ?? "all") as NotificationType | "all"}
          sortBy={(filters.sortBy ?? "newest") as NotificationSortBy}
          onSearchChange={(value) => {
            setSearchDraft(value);
            if (!value) {
              updateFilters({ search: undefined });
            }
          }}
          onSearchSubmit={(value) => updateFilters({ search: value.trim() || undefined })}
          onStatusChange={(status) => updateFilters({ status })}
          onTypeChange={(type) => updateFilters({ type })}
          onSortChange={(sortBy) => updateFilters({ sortBy })}
          onReset={() => {
            setSearchDraft("");
            setFilters(initialFilters);
          }}
        />

        {notificationsQuery.isError ? (
          <Card contentClassName="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-red-800">
                  Unable to load notifications. Please try again.
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Application updates, interview reminders, and alerts could not be
                  loaded.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => notificationsQuery.refetch()}
                leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />}
              >
                Retry
              </Button>
            </div>
          </Card>
        ) : null}

        {!notificationsQuery.isError && notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet."
            description="Application updates, interview invitations, and job alerts will appear here."
            actionLabel="Browse Jobs"
            actionHref="/jobs"
            icon={<Bell className="size-6" aria-hidden="true" />}
          />
        ) : null}

        {groups.length > 0 ? (
          <>
            <NotificationList
              groups={groups}
              getNotificationHref={getNotificationHref}
              updatingNotificationId={updatingNotificationId}
              deletingNotificationId={deletingNotificationId}
              onMarkRead={(notification) => markReadMutation.mutate(notification._id)}
              onMarkUnread={(notification) => markUnreadMutation.mutate(notification._id)}
              onDelete={setNotificationToDelete}
            />

            <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
              <Pagination
                currentPage={data?.page ?? filters.page ?? 1}
                totalPages={data?.totalPages ?? 1}
                onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
                className="w-full sm:w-auto"
              />
              <Link href="/profile/applications">
                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<BriefcaseBusiness className="size-4" aria-hidden="true" />}
                >
                  View Applications
                </Button>
              </Link>
            </div>
          </>
        ) : null}

        <NotificationPromoBanner />
      </div>

      <DeleteNotificationConfirmModal
        notification={notificationToDelete}
        isDeleting={deleteMutation.isPending}
        onClose={() => setNotificationToDelete(null)}
        onConfirm={() => {
          if (notificationToDelete) {
            deleteMutation.mutate(notificationToDelete._id);
          }
        }}
      />
    </main>
  );
}

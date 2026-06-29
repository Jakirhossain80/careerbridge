"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCheck, RefreshCcw } from "lucide-react";

import DeleteNotificationConfirmModal from "@/components/job-seeker/notifications/DeleteNotificationConfirmModal";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationList, {
  type NotificationGroup,
} from "@/components/notifications/NotificationList";
import { Badge, Button, Card, EmptyState, LoadingSkeleton, Pagination } from "@/components/ui";
import { useNotificationMutations } from "@/hooks/notifications/useNotificationMutations";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { getApiErrorMessage } from "@/lib/api";
import type {
  CareerBridgeNotification,
  NotificationsQueryParams,
  NotificationSortBy,
  NotificationStatusFilter,
  NotificationType,
} from "@/types/notification.types";

const pageSize = 10;
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
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.floor((startOfToday - startOfDate) / 86_400_000);

  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff <= 7) return "Last Week";
  return "Earlier";
}

function groupNotifications(notifications: CareerBridgeNotification[]): NotificationGroup[] {
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
    .map((label) => ({ label, notifications: grouped[label] ?? [] }))
    .filter((group) => group.notifications.length > 0);
}

function getNotificationHref(notification: CareerBridgeNotification) {
  return `/notifications/${notification._id}`;
}

function buildQueryParams(filters: NotificationsQueryParams): NotificationsQueryParams {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined && value !== null),
  ) as NotificationsQueryParams;
}

export default function NotificationsPageContent() {
  const [filters, setFilters] = useState<NotificationsQueryParams>(initialFilters);
  const [searchDraft, setSearchDraft] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingNotificationId, setUpdatingNotificationId] = useState<string>();
  const [deletingNotificationId, setDeletingNotificationId] = useState<string>();
  const [notificationToDelete, setNotificationToDelete] =
    useState<CareerBridgeNotification | null>(null);

  const queryParams = useMemo(() => buildQueryParams(filters), [filters]);
  const notificationsQuery = useNotifications(queryParams);
  const { markRead, markAllRead, remove } = useNotificationMutations();

  const data = notificationsQuery.data;
  const notifications = data?.notifications ?? emptyNotifications;
  const groups = useMemo(() => groupNotifications(notifications), [notifications]);

  function updateFilters(updates: NotificationsQueryParams) {
    setFilters((current) => ({ ...current, ...updates, page: updates.page ?? 1 }));
  }

  function handleMarkRead(notification: CareerBridgeNotification) {
    setUpdatingNotificationId(notification._id);
    setFeedbackMessage("");
    setActionError("");
    markRead.mutate(notification._id, {
      onSuccess: () => setFeedbackMessage("Notification marked as read."),
      onError: (error) =>
        setActionError(getApiErrorMessage(error) || "Unable to update notification."),
      onSettled: () => setUpdatingNotificationId(undefined),
    });
  }

  function handleMarkAllRead() {
    setFeedbackMessage("");
    setActionError("");
    markAllRead.mutate(undefined, {
      onSuccess: () => setFeedbackMessage("All notifications marked as read."),
      onError: (error) =>
        setActionError(getApiErrorMessage(error) || "Unable to update notifications."),
    });
  }

  function handleDelete(notification: CareerBridgeNotification) {
    setDeletingNotificationId(notification._id);
    setFeedbackMessage("");
    setActionError("");
    remove.mutate(notification._id, {
      onSuccess: () => {
        setNotificationToDelete(null);
        setFeedbackMessage("Notification deleted.");
      },
      onError: (error) =>
        setActionError(getApiErrorMessage(error) || "Unable to delete notification."),
      onSettled: () => setDeletingNotificationId(undefined),
    });
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Notifications
                </h1>
                <Badge variant={(data?.unreadCount ?? 0) > 0 ? "primary" : "neutral"}>
                  {data?.unreadCount ?? 0} New
                </Badge>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted sm:text-base">
                Review application activity, interviews, employer approvals, job decisions, and saved job alerts.
              </p>
              <p className="mt-3 text-sm font-medium text-foreground" aria-live="polite">
                Showing {data?.total ?? 0} notifications
              </p>
            </div>

            <Button
              type="button"
              onClick={handleMarkAllRead}
              disabled={(data?.unreadCount ?? 0) === 0}
              isLoading={markAllRead.isPending}
              leftIcon={<CheckCheck className="size-4" aria-hidden="true" />}
              className="w-full sm:w-fit"
            >
              Mark All as Read
            </Button>
          </div>
        </header>

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
            if (!value) updateFilters({ search: undefined });
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

        {notificationsQuery.isLoading ? (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            <LoadingSkeleton variant="card" rows={1} />
            <LoadingSkeleton variant="card" rows={1} />
            <LoadingSkeleton variant="card" rows={1} />
          </div>
        ) : null}

        {notificationsQuery.isError ? (
          <Card contentClassName="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-red-800">Unable to load notifications.</h2>
                <p className="mt-1 text-sm text-muted">Please retry the request.</p>
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

        {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet."
            description="Application updates, interview schedules, job decisions, and job alerts will appear here."
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
              onMarkRead={handleMarkRead}
              onMarkUnread={handleMarkRead}
              onDelete={setNotificationToDelete}
              allowMarkUnread={false}
            />

            <div className="rounded-lg border border-slate-200 bg-surface px-4 py-3 dark:border-slate-700">
              <Pagination
                currentPage={data?.page ?? filters.page ?? 1}
                totalPages={data?.totalPages ?? 1}
                onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
              />
            </div>
          </>
        ) : null}
      </div>

      <DeleteNotificationConfirmModal
        notification={notificationToDelete}
        isDeleting={remove.isPending}
        onClose={() => setNotificationToDelete(null)}
        onConfirm={() => {
          if (notificationToDelete) handleDelete(notificationToDelete);
        }}
      />
    </main>
  );
}

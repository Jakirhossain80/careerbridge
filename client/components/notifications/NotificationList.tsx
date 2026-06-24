"use client";

import NotificationCard from "@/components/notifications/NotificationCard";
import type { CareerBridgeNotification } from "@/types/notification.types";

export type NotificationGroup = {
  label: string;
  notifications: CareerBridgeNotification[];
};

type NotificationListProps = {
  groups: NotificationGroup[];
  getNotificationHref: (notification: CareerBridgeNotification) => string | undefined;
  updatingNotificationId?: string;
  deletingNotificationId?: string;
  onMarkRead: (notification: CareerBridgeNotification) => void;
  onMarkUnread: (notification: CareerBridgeNotification) => void;
  onDelete: (notification: CareerBridgeNotification) => void;
};

export default function NotificationList({
  groups,
  getNotificationHref,
  updatingNotificationId,
  deletingNotificationId,
  onMarkRead,
  onMarkUnread,
  onDelete,
}: NotificationListProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const headingId = `notification-group-${group.label
          .toLowerCase()
          .replace(/\s+/g, "-")}`;

        return (
          <section
            key={group.label}
            className="space-y-3"
            aria-labelledby={headingId}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id={headingId} className="text-sm font-bold uppercase text-muted">
                {group.label}
              </h2>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="space-y-3">
              {group.notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  href={getNotificationHref(notification)}
                  isUpdating={updatingNotificationId === notification._id}
                  isDeleting={deletingNotificationId === notification._id}
                  onMarkRead={onMarkRead}
                  onMarkUnread={onMarkUnread}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

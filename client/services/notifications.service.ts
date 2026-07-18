"use client";

import { api } from "@/lib/api";
import type {
  CareerBridgeNotification,
  NotificationResourceType,
  NotificationsQueryParams,
  NotificationsResponse,
  NotificationType,
} from "@/types/notification.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type LegacyNotification = {
  _id: string;
  userId?: string;
  recipientId?: string;
  recipientRole?: string;
  actorId?: string;
  type?: string;
  title: string;
  message: string;
  isRead?: boolean;
  read?: boolean;
  entityType?: NotificationResourceType;
  entityId?: string;
  link?: string;
  metadata?: Record<string, unknown>;
  relatedId?: string;
  resourceType?: NotificationResourceType;
  resourceId?: string;
  resourceSlug?: string;
  actionLabel?: string;
  createdAt?: string;
  updatedAt?: string;
};

const apiNotificationTypes = new Set<string>([
  "application_submitted",
  "application_status_changed",
  "interview_scheduled",
  "employer_approved",
  "job_approved",
  "job_rejected",
  "new_job_alert",
]);

type NotificationsPayload =
  | CareerBridgeNotification[]
  | {
      notifications?: CareerBridgeNotification[];
      items?: CareerBridgeNotification[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
      unreadCount?: number;
      meta?: {
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
        unreadCount?: number;
      };
    };

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  const payload = response.data;

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
}

function mapLegacyType(type?: string): NotificationType {
  if (
    type === "application_submitted" ||
    type === "application_status_changed" ||
    type === "interview_scheduled" ||
    type === "employer_approved" ||
    type === "job_approved" ||
    type === "job_rejected" ||
    type === "new_job_alert" ||
    type === "application_update" ||
    type === "interview_invitation" ||
    type === "interview_reminder" ||
    type === "job_alert" ||
    type === "recommended_job" ||
    type === "saved_job_update" ||
    type === "employer_message" ||
    type === "security" ||
    type === "career_insight"
  ) {
    return type;
  }

  if (type === "application") {
    return "application_update";
  }

  if (type === "interview") {
    return "interview_invitation";
  }

  if (type === "job") {
    return "recommended_job";
  }

  if (type === "account") {
    return "security";
  }

  return "system";
}

function inferResourceType(
  type: NotificationType,
  resourceType?: NotificationResourceType,
): NotificationResourceType | undefined {
  if (resourceType) {
    return resourceType;
  }

  if (type === "application_update") {
    return "application";
  }

  if (type === "application_submitted" || type === "application_status_changed") {
    return "application";
  }

  if (
    type === "interview_invitation" ||
    type === "interview_reminder" ||
    type === "interview_scheduled"
  ) {
    return "interview";
  }

  if (type === "recommended_job" || type === "job_approved" || type === "job_rejected") {
    return "job";
  }

  if (type === "new_job_alert") {
    return "job_alert";
  }

  if (type === "employer_approved") {
    return "employer";
  }

  if (type === "saved_job_update") {
    return "saved_job";
  }

  if (type === "job_alert") {
    return "recommended_job";
  }

  if (type === "employer_message") {
    return "message";
  }

  return undefined;
}

function normalizeNotification(item: LegacyNotification): CareerBridgeNotification {
  const type = mapLegacyType(item.type);
  const resourceType = inferResourceType(type, item.resourceType);

  return {
    _id: item._id,
    userId: item.userId,
    recipientId: item.recipientId,
    recipientRole: item.recipientRole,
    actorId: item.actorId,
    type,
    title: item.title,
    message: item.message,
    isRead: item.isRead ?? item.read ?? false,
    read: item.read ?? item.isRead ?? false,
    entityType: item.entityType,
    entityId: item.entityId,
    link: item.link,
    metadata: item.metadata,
    resourceType,
    resourceId: item.resourceId ?? item.entityId ?? item.relatedId,
    resourceSlug: item.resourceSlug,
    actionLabel: item.actionLabel,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt,
  };
}

function filterNotifications(
  notifications: CareerBridgeNotification[],
  params: NotificationsQueryParams = {},
): NotificationsResponse {
  const page = params.page ?? 1;
  const limit = params.limit ?? 8;
  const search = params.search?.trim().toLowerCase();

  let filtered = [...notifications];

  if (search) {
    filtered = filtered.filter((notification) =>
      [notification.title, notification.message].some((value) =>
        value.toLowerCase().includes(search),
      ),
    );
  }

  if (params.status === "read") {
    filtered = filtered.filter((notification) => notification.isRead);
  }

  if (params.status === "unread") {
    filtered = filtered.filter((notification) => !notification.isRead);
  }

  if (params.type && params.type !== "all") {
    filtered = filtered.filter((notification) => notification.type === params.type);
  }

  filtered.sort((a, b) => {
    const first = new Date(a.createdAt).getTime();
    const second = new Date(b.createdAt).getTime();
    return params.sortBy === "oldest" ? first - second : second - first;
  });

  const total = filtered.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    notifications: filtered.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages,
    unreadCount: notifications.filter((notification) => !notification.isRead).length,
  };
}

function normalizeResponse(
  payload: NotificationsPayload,
  params: NotificationsQueryParams = {},
): NotificationsResponse {
  if (Array.isArray(payload)) {
    return filterNotifications(payload.map(normalizeNotification), params);
  }

  const notifications = (payload.notifications ?? payload.items ?? []).map(
    normalizeNotification,
  );
  const meta = payload.meta;
  const total = payload.total ?? meta?.total ?? notifications.length;
  const limit = payload.limit ?? meta?.limit ?? params.limit ?? 8;

  return {
    notifications,
    total,
    page: payload.page ?? meta?.page ?? params.page ?? 1,
    limit,
    totalPages:
      payload.totalPages ??
      meta?.totalPages ??
      Math.max(Math.ceil(total / limit), 1),
    unreadCount:
      payload.unreadCount ??
      meta?.unreadCount ??
      notifications.filter((notification) => !notification.isRead).length,
  };
}

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (params: NotificationsQueryParams) => ["notifications", params] as const,
  details: ["notification"] as const,
  detail: (notificationId: string) => ["notification", notificationId] as const,
  unread: ["notifications-unread"] as const,
  dashboard: ["job-seeker-dashboard"] as const,
};

export async function getNotifications(params: NotificationsQueryParams = {}) {
  const response = await api.get<
      ApiEnvelope<NotificationsPayload> | NotificationsPayload
    >("/notifications", {
      params: {
        page: params.page,
        limit: params.limit,
        read:
          params.status === "read"
            ? true
            : params.status === "unread"
              ? false
              : undefined,
        type:
          params.type && params.type !== "all" && apiNotificationTypes.has(params.type)
            ? params.type
            : undefined,
      },
    });

  return normalizeResponse(unwrap(response), params);
}

export async function getNotification(notificationId: string) {
  const response = await api.get<
      ApiEnvelope<LegacyNotification> | LegacyNotification
    >(`/notifications/${notificationId}`);

  return normalizeNotification(unwrap(response));
}

export async function getUnreadNotifications() {
  const response = await api.get<
      ApiEnvelope<{ count?: number; notifications?: CareerBridgeNotification[] }> | {
        count?: number;
        notifications?: CareerBridgeNotification[];
      }
    >("/notifications/unread-count");
    const payload = unwrap(response);

  return {
      count:
        payload.count ??
        payload.notifications?.filter((notification) => !notification.isRead).length ??
        0,
      notifications: payload.notifications ?? [],
  };
}

export async function markNotificationAsRead(notificationId: string) {
  const response = await api.patch<
      ApiEnvelope<CareerBridgeNotification> | CareerBridgeNotification
    >(`/notifications/${notificationId}/read`);
  return normalizeNotification(unwrap(response));
}

export async function markNotificationAsUnread(notificationId: string) {
  const response = await api.patch<
      ApiEnvelope<CareerBridgeNotification> | CareerBridgeNotification
    >(`/notifications/${notificationId}/unread`);
  return normalizeNotification(unwrap(response));
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch<
      ApiEnvelope<{ modifiedCount?: number }> | { modifiedCount?: number }
    >("/notifications/read-all");
  return unwrap(response);
}

export async function deleteNotification(notificationId: string) {
  await api.delete(`/notifications/${notificationId}`);
  return { notificationId };
}

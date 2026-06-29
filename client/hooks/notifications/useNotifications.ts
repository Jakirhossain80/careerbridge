"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotifications,
  notificationQueryKeys,
} from "@/services/notifications.service";
import type { NotificationsQueryParams } from "@/types/notification.types";

export function useNotifications(params: NotificationsQueryParams) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => getNotifications(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: notificationQueryKeys.unread,
    queryFn: getUnreadNotifications,
  });
}

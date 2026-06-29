"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getNotification,
  notificationQueryKeys,
} from "@/services/notifications.service";

export function useNotification(notificationId: string) {
  return useQuery({
    queryKey: notificationQueryKeys.detail(notificationId),
    queryFn: () => getNotification(notificationId),
    enabled: Boolean(notificationId),
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  notificationQueryKeys,
} from "@/services/notifications.service";

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const invalidateNotifications = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.details }),
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unread }),
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.dashboard }),
    ]);
  };

  const markRead = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: invalidateNotifications,
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: invalidateNotifications,
  });

  const remove = useMutation({
    mutationFn: deleteNotification,
    onSuccess: invalidateNotifications,
  });

  return {
    markRead,
    markAllRead,
    remove,
    invalidateNotifications,
  };
}

"use client";

import { RouteErrorFallback } from "@/components/errors";

type NotificationsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function NotificationsError({
  error,
  reset,
}: NotificationsErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="notifications-route"
      title="Notifications could not load"
      message="We could not load notifications right now. Please retry the request."
      dashboardHref="/dashboard"
    />
  );
}

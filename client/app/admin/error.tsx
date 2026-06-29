"use client";

import { RouteErrorFallback } from "@/components/errors";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="admin-route"
      title="Admin console could not load"
      message="We could not load this admin view. Please retry the request or return to the admin dashboard."
      dashboardHref="/admin/dashboard"
    />
  );
}

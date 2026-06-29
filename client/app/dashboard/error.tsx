"use client";

import { RouteErrorFallback } from "@/components/errors";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="dashboard-route"
      title="Dashboard could not load"
      message="We could not open your dashboard workspace. Please retry the request."
      dashboardHref="/dashboard"
    />
  );
}

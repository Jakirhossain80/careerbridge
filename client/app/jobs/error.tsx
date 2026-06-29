"use client";

import { RouteErrorFallback } from "@/components/errors";

type JobsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function JobsError({ error, reset }: JobsErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="jobs-route"
      title="Jobs could not load"
      message="We could not load job listings. Please retry the request."
      showDashboardLink={false}
    />
  );
}

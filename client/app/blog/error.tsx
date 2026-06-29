"use client";

import { RouteErrorFallback } from "@/components/errors";

type BlogErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BlogError({ error, reset }: BlogErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="blog-route"
      title="Blog could not load"
      message="We could not load this blog view. Please retry the request."
      showDashboardLink={false}
    />
  );
}

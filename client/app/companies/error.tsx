"use client";

import { RouteErrorFallback } from "@/components/errors";

type CompaniesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CompaniesError({ error, reset }: CompaniesErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="companies-route"
      title="Companies could not load"
      message="We could not load company information. Please retry the request."
      showDashboardLink={false}
    />
  );
}

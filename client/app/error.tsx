"use client";

import { RouteErrorFallback } from "@/components/errors";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="root-app"
      title="Something went wrong"
      message="We could not load this page. Please retry the request."
    />
  );
}

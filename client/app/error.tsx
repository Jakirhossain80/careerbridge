"use client";

import ErrorState from "@/components/ui/ErrorState";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ reset }: AppErrorProps) {
  return (
    <ErrorState
      title="Something went wrong"
      message="We could not load this page. Please retry the request."
      onRetry={reset}
    />
  );
}

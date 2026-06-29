"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button, Card } from "@/components/ui";

type WidgetErrorFallbackProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export default function WidgetErrorFallback({
  title = "This section could not load",
  message = "Please retry this section or refresh the page.",
  onRetry,
}: WidgetErrorFallbackProps) {
  return (
    <Card contentClassName="p-6 text-center">
      <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        {message}
      </p>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={onRetry}
          leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />}
        >
          Retry
        </Button>
      ) : null}
    </Card>
  );
}

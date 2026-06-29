type ErrorReportInput = {
  error: Error & { digest?: string };
  context: string;
  pathname?: string | null;
};

export function reportClientError({
  error,
  context,
  pathname,
}: ErrorReportInput) {
  const safeReport = {
    context,
    digest: error.digest,
    message: error.message,
    pathname,
    timestamp: new Date().toISOString(),
  };

  console.error("[CareerBridge error boundary]", safeReport);
}

import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "Unable to load this page",
  message = "Please try again. If the problem continues, come back later.",
  retryLabel = "Try again",
  onRetry,
}: ErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <section className="app-surface w-full max-w-md rounded-lg border border-slate-200 p-8 text-center shadow-sm dark:border-slate-700">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">{message}</p>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 h-11 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {retryLabel}
          </button>
        ) : null}
      </section>
    </main>
  );
}

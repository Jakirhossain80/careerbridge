"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, Mail, RefreshCcw } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { reportClientError } from "@/lib/error-reporting";

type GlobalErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorFallback({
  error,
  reset,
}: GlobalErrorFallbackProps) {
  useEffect(() => {
    reportClientError({ error, context: "global-app" });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl text-center" contentClassName="p-8 sm:p-10">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-lg bg-red-50 text-red-700">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold uppercase text-red-700">
          Application error
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted sm:text-base">
          CareerBridge could not recover this view. Please try again or contact
          support if the issue continues.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            onClick={reset}
            leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />}
          >
            Try Again
          </Button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
          >
            <Home className="size-4" aria-hidden="true" />
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-transparent px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Mail className="size-4" aria-hidden="true" />
            Contact Support
          </Link>
        </div>
      </Card>
    </main>
  );
}

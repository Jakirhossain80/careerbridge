"use client";

import { GlobalErrorFallback } from "@/components/errors";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans">
        <GlobalErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}

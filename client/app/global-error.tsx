"use client";

import { GlobalErrorFallback } from "@/components/errors";
import { themeInitializerScript } from "@/lib/theme";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <GlobalErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}

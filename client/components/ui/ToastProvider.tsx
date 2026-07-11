"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "border border-slate-200 bg-surface text-foreground shadow-sm dark:border-slate-700",
          description: "text-muted",
          actionButton: "bg-primary text-white",
          cancelButton: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white",
        },
      }}
    />
  );
}

"use client";

import { RouteErrorFallback } from "@/components/errors";

type SettingsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="settings-route"
      title="Settings could not load"
      message="We could not load your settings workspace. Please retry the request."
      dashboardHref="/dashboard"
    />
  );
}

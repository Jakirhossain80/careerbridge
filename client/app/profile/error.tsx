"use client";

import { RouteErrorFallback } from "@/components/errors";

type ProfileErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProfileError({ error, reset }: ProfileErrorProps) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="profile-route"
      title="Profile could not load"
      message="We could not load your profile workspace. Please retry the request."
      dashboardHref="/dashboard"
    />
  );
}

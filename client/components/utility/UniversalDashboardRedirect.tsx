"use client";

import UniversalRouteRedirect from "@/components/utility/UniversalRouteRedirect";
import { getDashboardPathForRole } from "@/lib/authRedirects";

export default function UniversalDashboardRedirect() {
  return (
    <UniversalRouteRedirect
      getPathForRole={getDashboardPathForRole}
      loadingTitle="Opening your dashboard"
      loadingMessage="Checking your account role and workspace."
      fallbackTitle="Dashboard access is pending"
      fallbackMessage="Your account does not have an assigned workspace yet."
    />
  );
}

"use client";

import UniversalRouteRedirect from "@/components/utility/UniversalRouteRedirect";
import { getSettingsPathForRole } from "@/lib/authRedirects";

export default function UniversalSettingsRedirect() {
  return (
    <UniversalRouteRedirect
      getPathForRole={getSettingsPathForRole}
      loadingTitle="Opening settings"
      loadingMessage="Loading the correct settings workspace for your account."
      fallbackTitle="Settings are not available"
      fallbackMessage="Your account does not have a role-specific settings workspace yet."
    />
  );
}

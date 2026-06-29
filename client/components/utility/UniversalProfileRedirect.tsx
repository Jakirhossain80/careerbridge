"use client";

import UniversalRouteRedirect from "@/components/utility/UniversalRouteRedirect";
import { getProfilePathForRole } from "@/lib/authRedirects";

export default function UniversalProfileRedirect() {
  return (
    <UniversalRouteRedirect
      getPathForRole={getProfilePathForRole}
      loadingTitle="Opening your profile"
      loadingMessage="Finding the right profile workspace for your account."
      fallbackTitle="Profile workspace unavailable"
      fallbackMessage="A role-specific profile page is not available for this account yet."
    />
  );
}

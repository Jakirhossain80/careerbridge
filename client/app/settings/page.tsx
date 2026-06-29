import type { Metadata } from "next";

import UniversalSettingsRedirect from "@/components/utility/UniversalSettingsRedirect";

export const metadata: Metadata = {
  title: "Settings | CareerBridge",
  description: "Open the right CareerBridge settings page for your account.",
};

export default function SettingsPage() {
  return <UniversalSettingsRedirect />;
}

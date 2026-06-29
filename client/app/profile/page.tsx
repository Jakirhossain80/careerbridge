import type { Metadata } from "next";

import UniversalProfileRedirect from "@/components/utility/UniversalProfileRedirect";

export const metadata: Metadata = {
  title: "Profile | CareerBridge",
  description: "Open your CareerBridge profile workspace.",
};

export default function ProfilePage() {
  return <UniversalProfileRedirect />;
}

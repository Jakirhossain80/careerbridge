import type { Metadata } from "next";

import MaintenancePage from "@/components/utility/MaintenancePage";

export const metadata: Metadata = {
  title: "Maintenance | CareerBridge",
  description: "CareerBridge maintenance status page.",
};

export default function MaintenanceRoute() {
  return (
    <MaintenancePage
      estimatedReturnAt={process.env.NEXT_PUBLIC_MAINTENANCE_RETURN_AT}
    />
  );
}

import { Suspense } from "react";

import ManageApplicationsView from "@/components/admin/applications/ManageApplicationsView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminApplicationsPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading applications"
          message="Preparing application monitor..."
        />
      }
    >
      <ManageApplicationsView />
    </Suspense>
  );
}

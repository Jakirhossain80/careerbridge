import { Suspense } from "react";

import FeaturedJobsManagementView from "@/components/admin/jobs/featured/FeaturedJobsManagementView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminFeaturedJobsPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading featured jobs"
          message="Preparing featured job promotions..."
        />
      }
    >
      <FeaturedJobsManagementView />
    </Suspense>
  );
}

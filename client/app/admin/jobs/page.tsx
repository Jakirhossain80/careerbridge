import { Suspense } from "react";

import ManageJobsView from "@/components/admin/jobs/ManageJobsView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminJobsPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading jobs"
          message="Preparing admin job management..."
        />
      }
    >
      <ManageJobsView />
    </Suspense>
  );
}

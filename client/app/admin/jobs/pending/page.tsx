import { Suspense } from "react";

import PendingJobsView from "@/components/admin/jobs/pending/PendingJobsView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminPendingJobsPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading pending jobs"
          message="Preparing the job approval queue..."
        />
      }
    >
      <PendingJobsView />
    </Suspense>
  );
}

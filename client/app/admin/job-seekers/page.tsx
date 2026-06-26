import { Suspense } from "react";

import ManageJobSeekersView from "@/components/admin/job-seekers/ManageJobSeekersView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminJobSeekersPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading job seekers"
          message="Preparing admin job seeker management..."
        />
      }
    >
      <ManageJobSeekersView />
    </Suspense>
  );
}

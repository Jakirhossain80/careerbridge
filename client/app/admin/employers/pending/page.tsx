import { Suspense } from "react";

import PendingEmployersView from "@/components/admin/employers/pending/PendingEmployersView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminPendingEmployersPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading pending employers"
          message="Preparing employer verification queue..."
        />
      }
    >
      <PendingEmployersView />
    </Suspense>
  );
}

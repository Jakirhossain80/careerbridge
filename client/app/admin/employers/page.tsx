import { Suspense } from "react";

import ManageEmployersView from "@/components/admin/employers/ManageEmployersView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminEmployersPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading employers"
          message="Preparing admin employer management..."
        />
      }
    >
      <ManageEmployersView />
    </Suspense>
  );
}

import { Suspense } from "react";

import ManageCompaniesView from "@/components/admin/companies/ManageCompaniesView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminCompaniesPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading companies"
          message="Preparing admin company management..."
        />
      }
    >
      <ManageCompaniesView />
    </Suspense>
  );
}

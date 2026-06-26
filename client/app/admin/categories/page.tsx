import { Suspense } from "react";

import ManageCategoriesView from "@/components/admin/categories/ManageCategoriesView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminCategoriesRoutePage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading categories"
          message="Preparing category taxonomy..."
        />
      }
    >
      <ManageCategoriesView />
    </Suspense>
  );
}

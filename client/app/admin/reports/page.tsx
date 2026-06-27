import { Suspense } from "react";

import ReportsModerationView from "@/components/admin/reports/ReportsModerationView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading reports..." />}>
      <ReportsModerationView />
    </Suspense>
  );
}

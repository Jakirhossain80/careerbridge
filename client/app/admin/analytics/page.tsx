import { Suspense } from "react";

import AdminAnalyticsView from "@/components/admin/analytics/AdminAnalyticsView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading platform analytics..." />}>
      <AdminAnalyticsView />
    </Suspense>
  );
}

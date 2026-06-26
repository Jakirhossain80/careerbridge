import { Suspense } from "react";

import ManageBlogsView from "@/components/admin/blogs/ManageBlogsView";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminBlogsRoutePage() {
  return (
    <Suspense fallback={<PageLoader message="Loading blog management..." />}>
      <ManageBlogsView />
    </Suspense>
  );
}

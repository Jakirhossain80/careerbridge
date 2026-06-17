import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/ui";

export default function LatestJobsEmptyState() {
  return (
    <EmptyState
      icon={<SearchX className="size-6" aria-hidden="true" />}
      title="No latest jobs match these filters"
      description="Try changing the keyword, location, salary range, posted date, or category filters to discover more fresh roles."
      actionLabel="Clear filters"
    />
  );
}

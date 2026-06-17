import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/ui";

export default function FeaturedJobsEmptyState() {
  return (
    <EmptyState
      icon={<SearchX className="size-6" aria-hidden="true" />}
      title="No featured jobs match these filters"
      description="Try changing the keyword, location, salary range, or featured status filters to discover more roles."
      actionLabel="Clear filters"
    />
  );
}

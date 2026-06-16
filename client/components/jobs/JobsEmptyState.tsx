import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/ui";

export default function JobsEmptyState() {
  return (
    <EmptyState
      icon={<SearchX className="size-6" aria-hidden="true" />}
      title="No jobs match these filters"
      description="Try changing the job title, location, salary range, or selected filters to see more openings."
      actionLabel="Clear filters"
    />
  );
}

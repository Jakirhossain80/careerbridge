import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/ui";

type JobsEmptyStateProps = { onClear?: () => void };

export default function JobsEmptyState({ onClear }: JobsEmptyStateProps) {
  return (
    <EmptyState
      icon={<SearchX className="size-6" aria-hidden="true" />}
      title="No jobs match these filters"
      description="Try changing the job title, location, salary range, or selected filters to see more openings."
      actionLabel="Clear filters"
      onAction={onClear}
    />
  );
}

import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/ui";

export default function RemoteJobsEmptyState() {
  return (
    <EmptyState
      icon={<SearchX className="size-6" aria-hidden="true" />}
      title="No remote jobs match these filters"
      description="Try changing the keyword, timezone, salary range, or remote work filters to discover more roles."
      actionLabel="Clear filters"
    />
  );
}

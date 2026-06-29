import { SlidersHorizontal } from "lucide-react";

import { EmptyState } from "@/components/ui";

type FilterEmptyStateProps = {
  onClear?: () => void;
  className?: string;
};

export default function FilterEmptyState({
  onClear,
  className,
}: FilterEmptyStateProps) {
  return (
    <EmptyState
      className={className}
      icon={<SlidersHorizontal className="size-6" aria-hidden="true" />}
      title="No matches for selected filters"
      description="Try clearing filters or choosing a broader set of criteria."
      actionLabel={onClear ? "Clear Filters" : undefined}
      onAction={onClear}
    />
  );
}

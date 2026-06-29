import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/ui";

type SearchEmptyStateProps = {
  query?: string;
  onClear?: () => void;
  className?: string;
};

export default function SearchEmptyState({
  query,
  onClear,
  className,
}: SearchEmptyStateProps) {
  const safeQuery = query?.trim();

  return (
    <EmptyState
      className={className}
      icon={<SearchX className="size-6" aria-hidden="true" />}
      title="No results found"
      description={
        safeQuery
          ? `No records match "${safeQuery}". Try a different search term.`
          : "No records match your search. Try a different search term."
      }
      actionLabel={onClear ? "Clear Search" : undefined}
      onAction={onClear}
    />
  );
}

import { Inbox } from "lucide-react";

type TableEmptyStateProps = {
  message: string;
};

export default function TableEmptyState({ message }: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Inbox className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-foreground">{message}</p>
    </div>
  );
}

import Link from "next/link";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui";

type ProfileSectionEmptyStateProps = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function ProfileSectionEmptyState({
  title,
  actionLabel,
  actionHref,
}: ProfileSectionEmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-muted dark:border-slate-700">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Inbox className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          {actionLabel && actionHref ? (
            <Link href={actionHref} className="mt-3 inline-flex">
              <Button size="sm">{actionLabel}</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
